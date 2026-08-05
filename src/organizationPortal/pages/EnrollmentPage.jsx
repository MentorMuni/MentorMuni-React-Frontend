import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, FileUp, Link2, Pencil, Trash2, UserPlus, X } from 'lucide-react';
import { listDepartments, subscribeOrgDb } from '../store';
import { fetchDepartments } from '../departmentsApi';
import {
  addStudentManualApi,
  approveStudentInvite,
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

const CSV_TEMPLATE = `email,name,college_id,batch_year
rahul.sharma@college.edu,Rahul Sharma,CSE2024A01,2025
`;

const EMPTY_EDIT = {
  name: '',
  email: '',
  phone: '',
  collegeId: '',
  batchYear: '',
  departmentId: '',
};

function sourceLabel(source) {
  if (source === 'csv') return 'CSV';
  if (source === 'manual') return 'Manual';
  if (source === 'self_register') return 'Self-register';
  return 'Invite';
}

export default function EnrollmentPage() {
  const [departments, setDepartments] = useState(() => listDepartments());
  const [students, setStudents] = useState([]);
  const [pending, setPending] = useState([]);
  const [dataSource, setDataSource] = useState('');
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('queue');
  const [addMode, setAddMode] = useState('emails');
  const [csvText, setCsvText] = useState('');
  const [manual, setManual] = useState({ name: '', email: '', collegeId: '', batchYear: '' });
  const [lastSetupUrl, setLastSetupUrl] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const [deptHodMap, setDeptHodMap] = useState({}); // id → hodStatus
  const [busyId, setBusyId] = useState('');
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT);
  const [editBusy, setEditBusy] = useState(false);

  const registerUrl = useMemo(
    () => getRegistrationLink(departmentId || departments[0]?.id || ''),
    [departmentId, departments]
  );

  /** Self-register pending is owned by HOD when that dept has an active mentor */
  const visiblePending = useMemo(() => {
    return pending.filter((inv) => {
      if (inv.source !== 'self_register') return true;
      const status = deptHodMap[String(inv.departmentId || '')];
      return status !== 'active';
    });
  }, [pending, deptHodMap]);

  const clearFlash = () => {
    setErr('');
    setMsg('');
    setLastSetupUrl('');
    setCopiedKey('');
  };

  const reload = async (deptFilter = departmentId) => {
    setLoading(true);
    const [roster, queue] = await Promise.all([
      fetchStudents({ departmentId: deptFilter || undefined }),
      fetchStudentInvites({ status: 'pending', departmentId: deptFilter || undefined }),
    ]);
    setStudents(roster.students || []);
    setPending(queue.invitations || []);
    setDataSource(roster.source || queue.source || '');
    if (!roster.ok && roster.error) setErr(roster.error);
    else if (!queue.ok && queue.error) setErr(queue.error);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetchDepartments();
      if (cancelled) return;
      if (res.ok && res.departments?.length) {
        setDepartments(
          res.departments.map((d) => ({
            id: d.id,
            name: d.name,
            code: d.code,
          }))
        );
        const map = {};
        res.departments.forEach((d) => {
          map[String(d.id)] = d.hodStatus || d.hod_status || '';
        });
        setDeptHodMap(map);
      } else {
        setDepartments(listDepartments());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const unsub = subscribeOrgDb(() => {
      fetchDepartments().then((res) => {
        if (res.ok && res.departments?.length) {
          setDepartments(
            res.departments.map((d) => ({
              id: d.id,
              name: d.name,
              code: d.code,
            }))
          );
        } else {
          setDepartments(listDepartments());
        }
      });
    });
    return unsub;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const deptFilter = departmentId || undefined;
    Promise.all([
      fetchStudents({ departmentId: deptFilter }),
      fetchStudentInvites({ status: 'pending', departmentId: deptFilter }),
    ]).then(([roster, queue]) => {
      if (cancelled) return;
      setStudents(roster.students || []);
      setPending(queue.invitations || []);
      setDataSource(roster.source || queue.source || '');
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [departmentId]);

  const flash = (ok, text, setupUrl = '') => {
    setErr(ok ? '' : text);
    setMsg(ok ? text : '');
    if (setupUrl) setLastSetupUrl(setupUrl);
    else if (!ok) setLastSetupUrl('');
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

  const switchAddMode = (id) => {
    clearFlash();
    setAddMode(id);
  };

  const switchTab = (next) => {
    clearFlash();
    setTab(next);
  };

  const onEmails = async (e) => {
    e.preventDefault();
    if (!departmentId) {
      flash(false, 'Select a department for invites.');
      return;
    }
    if (!emails.trim()) {
      flash(false, 'Add at least one student email.');
      return;
    }
    const res = await inviteStudentsApi({ emails, departmentId, autoEnroll: true });
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
    setTab('roster');
    await reload();
  };

  const onManual = async (e) => {
    e.preventDefault();
    if (!departmentId) {
      flash(false, 'Select a department.');
      return;
    }
    const res = await addStudentManualApi({ ...manual, departmentId, autoEnroll: true });
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    setManual({ name: '', email: '', collegeId: '', batchYear: '' });
    flash(true, res.message || 'Student added to roster.', res.setupUrl || '');
    setTab('roster');
    await reload();
  };

  const onCsv = async (e) => {
    e.preventDefault();
    if (!departmentId) {
      flash(false, 'Select a department for CSV import.');
      return;
    }
    const res = await importStudentsApi({
      csvText,
      departmentId,
      sendInviteEmail: true,
      autoEnroll: true,
    });
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    flash(
      true,
      res.message || `Imported ${res.added} · skipped ${res.skipped || 0}.`,
      res.setupUrl || ''
    );
    setCsvText('');
    setTab('roster');
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

  const openEdit = (s) => {
    clearFlash();
    setEditing(s);
    setEditForm({
      name: s.name || '',
      email: s.email || '',
      phone: s.phone || '',
      collegeId: s.collegeId || '',
      batchYear: s.batchYear || '',
      departmentId: s.departmentId || '',
    });
    setTab('roster');
  };

  const onSaveEdit = async (e) => {
    e.preventDefault();
    if (!editing?.id) return;
    if (!String(editForm.name || '').trim()) {
      flash(false, 'Name is required.');
      return;
    }
    if (!String(editForm.email || '').trim()) {
      flash(false, 'Email is required.');
      return;
    }
    if (!editForm.departmentId) {
      flash(false, 'Select a department.');
      return;
    }
    setEditBusy(true);
    const dept = departments.find((d) => String(d.id) === String(editForm.departmentId));
    const res = await patchStudent(editing.id, {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      collegeId: editForm.collegeId,
      batchYear: editForm.batchYear,
      departmentId: editForm.departmentId,
      departmentName: dept?.name || '',
    });
    setEditBusy(false);
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    setEditing(null);
    setEditForm(EMPTY_EDIT);
    flash(true, 'Student details updated.');
    await reload();
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
    setBusyId(`delete:${s.id}`);
    const res = await deleteStudentApi(s.id);
    setBusyId('');
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    if (editing && String(editing.id) === String(s.id)) {
      setEditing(null);
      setEditForm(EMPTY_EDIT);
    }
    flash(true, res.message || 'Student removed.');
    await reload();
  };

  return (
    <div className="space-y-5">
      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">Student enrollment</h2>
            <p className="mm-org-panel__meta">
              Approve sends a set-password email to the student; Deny sends a rejection notice.
              Demo mode shows a copyable link instead of email
              {dataSource ? ` · ${dataSource}` : ''}
              {loading ? ' · loading' : ''}
            </p>
          </div>
        </div>

        {err ? <div className="mm-org-alert mm-org-alert--error mb-3">{err}</div> : null}
        {msg ? <div className="mm-org-alert mm-org-alert--success mb-3">{msg}</div> : null}
        {lastSetupUrl ? (
          <div className="mm-org-callout mb-4">
            <p className="mm-org-callout__title">
              Set-password link — share with the student (they choose password; userid = email or
              college ID)
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="mm-org-code text-xs" style={{ flex: 1 }}>
                {lastSetupUrl}
              </code>
              <button
                type="button"
                className="mm-org-btn mm-org-btn--sm mm-org-btn--primary"
                onClick={() => copyText(lastSetupUrl, 'setup')}
              >
                {copiedKey === 'setup' ? (
                  <>
                    <Check size={14} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy link
                  </>
                )}
              </button>
              <button
                type="button"
                className="mm-org-btn mm-org-btn--sm mm-org-btn--ghost"
                onClick={() => setLastSetupUrl('')}
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 mb-4">
          {[
            ['emails', 'Email list'],
            ['manual', 'Manual'],
            ['csv', 'CSV'],
            ['link', 'Reg link'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`mm-org-btn mm-org-btn--sm ${
                addMode === id ? 'mm-org-btn--primary' : 'mm-org-btn--ghost'
              }`}
              onClick={() => switchAddMode(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-4" style={{ maxWidth: 320 }}>
          <label className="mm-org-label" htmlFor="stu-dept">
            Department
          </label>
          <select
            id="stu-dept"
            className="mm-org-select"
            value={departmentId}
            onChange={(e) => {
              clearFlash();
              setDepartmentId(e.target.value);
            }}
          >
            <option value="">All departments (TPO)</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        {addMode === 'emails' ? (
          <form onSubmit={onEmails}>
            <label className="mm-org-label" htmlFor="stu-emails">
              Student emails
            </label>
            <textarea
              id="stu-emails"
              className="mm-org-textarea"
              placeholder={'rahul@college.edu\npriya@college.edu'}
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
            <div className="mm-org-form-actions">
              <button type="submit" className="mm-org-btn mm-org-btn--primary">
                <UserPlus size={15} /> Invite to roster
              </button>
            </div>
          </form>
        ) : null}

        {addMode === 'manual' ? (
          <form onSubmit={onManual} className="mm-org-form-grid">
            <div>
              <label className="mm-org-label">Name</label>
              <input
                className="mm-org-input"
                value={manual.name}
                onChange={(e) => setManual((m) => ({ ...m, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mm-org-label">Email</label>
              <input
                type="email"
                className="mm-org-input"
                value={manual.email}
                onChange={(e) => setManual((m) => ({ ...m, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mm-org-label">College ID</label>
              <input
                className="mm-org-input"
                value={manual.collegeId}
                onChange={(e) => setManual((m) => ({ ...m, collegeId: e.target.value }))}
              />
            </div>
            <div>
              <label className="mm-org-label">Batch year</label>
              <input
                className="mm-org-input"
                value={manual.batchYear}
                onChange={(e) => setManual((m) => ({ ...m, batchYear: e.target.value }))}
              />
            </div>
            <div className="mm-org-form-actions" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="mm-org-btn mm-org-btn--primary">
                Add to roster
              </button>
            </div>
          </form>
        ) : null}

        {addMode === 'csv' ? (
          <form onSubmit={onCsv}>
            <div className="flex gap-2 mb-3">
              <label className="mm-org-btn mm-org-btn--sm mm-org-btn--ghost" style={{ cursor: 'pointer' }}>
                <FileUp size={14} /> Choose CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  hidden
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) setCsvText(await f.text());
                  }}
                />
              </label>
              <button
                type="button"
                className="mm-org-btn mm-org-btn--sm mm-org-btn--ghost"
                onClick={() => setCsvText(CSV_TEMPLATE)}
              >
                Template
              </button>
            </div>
            <textarea
              className="mm-org-textarea"
              rows={7}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={CSV_TEMPLATE}
            />
            <div className="mm-org-form-actions">
              <button type="submit" className="mm-org-btn mm-org-btn--primary">
                Import to roster
              </button>
            </div>
          </form>
        ) : null}

        {addMode === 'link' ? (
          <div>
            <p className="mb-2 text-xs mm-org-text-muted">
              Students open this link to request enrollment
              {departmentId
                ? ' for the selected department'
                : ' (pick a department above to pre-select it)'}.
              Uses your org code and lands on <code>/studentportal/enroll</code>.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="mm-org-code text-xs" style={{ flex: 1 }}>
                {registerUrl}
              </code>
              <button
                type="button"
                className="mm-org-btn mm-org-btn--sm mm-org-btn--primary"
                onClick={() => copyText(registerUrl, 'reg')}
              >
                {copiedKey === 'reg' ? (
                  <>
                    <Check size={14} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy
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
            <p className="mt-3 text-xs mm-org-text-muted">
              Flow: student opens link → submits details → appears in Approval queue → you Approve →
              share set-password link → student sets password → logs in with email / college ID.
            </p>
          </div>
        ) : null}
      </section>

      <div className="mm-org-toolbar">
        <div className="flex gap-2">
          <button
            type="button"
            className={`mm-org-btn mm-org-btn--sm ${tab === 'queue' ? 'mm-org-btn--primary' : 'mm-org-btn--ghost'}`}
            onClick={() => switchTab('queue')}
          >
            Approval queue ({visiblePending.length})
          </button>
          <button
            type="button"
            className={`mm-org-btn mm-org-btn--sm ${tab === 'roster' ? 'mm-org-btn--primary' : 'mm-org-btn--ghost'}`}
            onClick={() => switchTab('roster')}
          >
            Enrolled roster ({students.length})
          </button>
        </div>
      </div>

      {tab === 'queue' && pending.length > visiblePending.length ? (
        <div className="mm-org-alert mm-org-alert--success" role="status">
          Self-register requests for departments with an active HOD are handled on the HOD Students
          queue — hidden here ({pending.length - visiblePending.length} hidden).
        </div>
      ) : null}

      <section className="mm-org-panel">
        {tab === 'queue' ? (
          visiblePending.length ? (
            <div className="mm-org-table-wrap">
              <table className="mm-org-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Source</th>
                    <th>Department</th>
                    <th>Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {visiblePending.map((inv) => (
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
                      <td>{inv.departmentName || '—'}</td>
                      <td>
                        <div className="flex gap-2">
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
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mm-org-empty">
              {loading ? 'Loading queue…' : 'No pending invites for this filter.'}
            </div>
          )
        ) : students.length ? (
          <div className="mm-org-table-wrap">
            <table className="mm-org-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Department</th>
                  <th>Login</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <p className="mm-org-table__title">{s.name}</p>
                      <p className="mm-org-table__meta">
                        {s.email}
                        {s.phone ? ` · ${s.phone}` : ''}
                        {s.collegeId ? ` · ${s.collegeId}` : ''}
                      </p>
                    </td>
                    <td>
                      {s.departmentName ||
                        departments.find((d) => String(d.id) === String(s.departmentId || ''))
                          ?.name ||
                        '—'}
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
                        s.authStatus === 'blocked' ? (
                          <button
                            type="button"
                            className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                            onClick={async () => {
                              const res = await resendStudentSetupLink(s.id);
                              if (res.ok) {
                                flash(
                                  true,
                                  res.message || 'Link ready.',
                                  res.setupUrl || ''
                                );
                              } else flash(false, res.error);
                            }}
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
                          disabled={busyId === `delete:${s.id}`}
                          onClick={() => onDeleteStudent(s)}
                        >
                          <Trash2 size={14} />{' '}
                          {busyId === `delete:${s.id}` ? 'Removing…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mm-org-empty">
            {loading
              ? 'Loading roster…'
              : dataSource === 'api'
                ? 'No enrolled students for this filter.'
                : 'No enrolled students yet.'}
          </div>
        )}
      </section>

      {editing ? (
        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Edit student</h2>
              <p className="mm-org-panel__meta">
                Fix name, email, phone, roll, or department when the student reports a mistake.
              </p>
            </div>
            <button
              type="button"
              className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
              onClick={() => {
                setEditing(null);
                setEditForm(EMPTY_EDIT);
              }}
            >
              <X size={14} /> Close
            </button>
          </div>
          <form onSubmit={onSaveEdit} className="mm-org-form-grid">
            <div>
              <label className="mm-org-label" htmlFor="enroll-edit-name">
                Full name
              </label>
              <input
                id="enroll-edit-name"
                className="mm-org-input"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mm-org-label" htmlFor="enroll-edit-email">
                College email
              </label>
              <input
                id="enroll-edit-email"
                type="email"
                className="mm-org-input"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mm-org-label" htmlFor="enroll-edit-phone">
                Phone
              </label>
              <input
                id="enroll-edit-phone"
                className="mm-org-input"
                value={editForm.phone}
                onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="10-digit mobile"
              />
            </div>
            <div>
              <label className="mm-org-label" htmlFor="enroll-edit-roll">
                College ID / roll
              </label>
              <input
                id="enroll-edit-roll"
                className="mm-org-input"
                value={editForm.collegeId}
                onChange={(e) => setEditForm((f) => ({ ...f, collegeId: e.target.value }))}
              />
            </div>
            <div>
              <label className="mm-org-label" htmlFor="enroll-edit-batch">
                Batch year
              </label>
              <input
                id="enroll-edit-batch"
                className="mm-org-input"
                value={editForm.batchYear}
                onChange={(e) => setEditForm((f) => ({ ...f, batchYear: e.target.value }))}
                placeholder="2025"
              />
            </div>
            <div>
              <label className="mm-org-label" htmlFor="enroll-edit-dept">
                Department
              </label>
              <select
                id="enroll-edit-dept"
                className="mm-org-select"
                value={editForm.departmentId}
                onChange={(e) => setEditForm((f) => ({ ...f, departmentId: e.target.value }))}
                required
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                    {d.code ? ` (${d.code})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="mm-org-form-actions" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="mm-org-btn mm-org-btn--primary" disabled={editBusy}>
                {editBusy ? 'Saving…' : 'Save changes'}
              </button>
              <button
                type="button"
                className="mm-org-btn mm-org-btn--ghost"
                onClick={() => {
                  setEditing(null);
                  setEditForm(EMPTY_EDIT);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}
