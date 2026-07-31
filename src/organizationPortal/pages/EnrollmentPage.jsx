import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, FileUp, Link2, UserPlus, X } from 'lucide-react';
import { listDepartments, subscribeOrgDb } from '../store';
import { fetchDepartments } from '../departmentsApi';
import {
  addStudentManualApi,
  approveStudentInvite,
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

  const registerUrl = useMemo(
    () => getRegistrationLink(departmentId || departments[0]?.id || ''),
    [departmentId, departments]
  );

  const reload = async (deptFilter = departmentId) => {
    setLoading(true);
    const [roster, queue] = await Promise.all([
      fetchStudents({ departmentId: deptFilter || undefined }),
      fetchStudentInvites({ status: 'pending', departmentId: deptFilter || undefined }),
    ]);
    setStudents(roster.students || []);
    setPending(queue.invitations || []);
    setDataSource(roster.source || queue.source || '');
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
      } else {
        setDepartments(listDepartments());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => subscribeOrgDb(() => setDepartments(listDepartments())), []);

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
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setMsg('Copied to clipboard.');
    } catch {
      setErr('Could not copy — select the link manually.');
    }
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
    const res = await inviteStudentsApi({ emails, departmentId });
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    setEmails('');
    flash(true, `${res.added || 0} invite(s) queued.`);
    setTab('queue');
    await reload();
  };

  const onManual = async (e) => {
    e.preventDefault();
    if (!departmentId) {
      flash(false, 'Select a department.');
      return;
    }
    const res = await addStudentManualApi({ ...manual, departmentId });
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    setManual({ name: '', email: '', collegeId: '', batchYear: '' });
    flash(true, res.message || 'Student queued for approval.');
    setTab('queue');
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
    });
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    flash(true, `Imported ${res.added} · skipped ${res.skipped || 0}.`);
    setCsvText('');
    setTab('queue');
    await reload();
  };

  const onDecide = async (id, decision) => {
    const res =
      decision === 'approve' ? await approveStudentInvite(id) : await rejectStudentInvite(id);
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    if (decision === 'approve') {
      flash(true, res.message || 'Approved.', res.setupUrl || '');
    } else {
      flash(true, res.message || 'Rejected.');
    }
    await reload();
  };

  return (
    <div className="space-y-5">
      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">Student enrollment</h2>
            <p className="mm-org-panel__meta">
              API-first · local fallback · {dataSource || '…'}
              {loading ? ' · loading' : ''}
            </p>
          </div>
        </div>

        {err ? <div className="mm-org-alert mm-org-alert--error mb-3">{err}</div> : null}
        {msg ? <div className="mm-org-alert mm-org-alert--success mb-3">{msg}</div> : null}
        {lastSetupUrl ? (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <code className="text-xs break-all" style={{ flex: 1 }}>
              {lastSetupUrl}
            </code>
            <button
              type="button"
              className="mm-org-btn mm-org-btn--sm mm-org-btn--ghost"
              onClick={() => copyText(lastSetupUrl)}
            >
              <Copy size={14} /> Copy link
            </button>
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
              onClick={() => setAddMode(id)}
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
            onChange={(e) => setDepartmentId(e.target.value)}
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
                <UserPlus size={15} /> Queue invites
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
                Queue for approval
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
                Import to queue
              </button>
            </div>
          </form>
        ) : null}

        {addMode === 'link' ? (
          <div className="flex flex-wrap items-center gap-2">
            <code className="text-xs break-all" style={{ flex: 1 }}>
              {registerUrl}
            </code>
            <button
              type="button"
              className="mm-org-btn mm-org-btn--sm mm-org-btn--primary"
              onClick={() => copyText(registerUrl)}
            >
              <Copy size={14} /> Copy
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
        ) : null}
      </section>

      <div className="mm-org-toolbar">
        <div className="flex gap-2">
          <button
            type="button"
            className={`mm-org-btn mm-org-btn--sm ${tab === 'queue' ? 'mm-org-btn--primary' : 'mm-org-btn--ghost'}`}
            onClick={() => setTab('queue')}
          >
            Approval queue ({pending.length})
          </button>
          <button
            type="button"
            className={`mm-org-btn mm-org-btn--sm ${tab === 'roster' ? 'mm-org-btn--primary' : 'mm-org-btn--ghost'}`}
            onClick={() => setTab('roster')}
          >
            Enrolled roster ({students.length})
          </button>
        </div>
      </div>

      <section className="mm-org-panel">
        {tab === 'queue' ? (
          pending.length ? (
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
                  {pending.map((inv) => (
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
                            onClick={() => onDecide(inv.id, 'approve')}
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            type="button"
                            className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                            onClick={() => onDecide(inv.id, 'reject')}
                          >
                            <X size={14} /> Deny
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
                      <p className="mm-org-table__meta">{s.email}</p>
                    </td>
                    <td>{s.departmentName || '—'}</td>
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
                      <div className="flex gap-2 justify-end">
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
    </div>
  );
}
