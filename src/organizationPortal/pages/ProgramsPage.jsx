import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { getOrgSession } from '../../orgPortal';
import { isHodRole, normalizeOrgRole, ORG_ROLES } from '../roles';
import { resolveHodDepartment } from '../hodScope';
import {
  PROGRAM_TYPES,
  createProgram,
  getHodAccess,
  listDepartments,
  listPrograms,
  listStudents,
  removeProgram,
  subscribeOrgDb,
} from '../store';

const empty = {
  title: '',
  type: 'readiness',
  audience: 'all',
  departmentId: '',
  studentIds: [],
  dueInDays: 7,
};

function typeLabel(id) {
  return PROGRAM_TYPES.find((t) => t.id === id)?.label || id;
}

export default function ProgramsPage() {
  const session = getOrgSession();
  const role = normalizeOrgRole(session?.role);
  const hod = isHodRole(session?.role);
  const hodDept = hod ? resolveHodDepartment(session) : null;

  const [programs, setPrograms] = useState(() => listPrograms());
  const [departments, setDepartments] = useState(() => listDepartments());
  const [students, setStudents] = useState(() => listStudents());
  const [access, setAccess] = useState(() => getHodAccess());
  const [form, setForm] = useState(() =>
    hod && hodDept
      ? { ...empty, audience: 'department', departmentId: hodDept.id }
      : empty
  );
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(
    () =>
      subscribeOrgDb(() => {
        setPrograms(listPrograms());
        setDepartments(listDepartments());
        setStudents(listStudents());
        setAccess(getHodAccess());
      }),
    []
  );

  const branchStudents = useMemo(() => {
    if (hod && hodDept) {
      return students.filter((s) => s.departmentId === hodDept.id);
    }
    return students;
  }, [students, hod, hodDept]);

  const visiblePrograms = useMemo(() => {
    if (!hod || !hodDept) return programs;
    const ids = new Set(branchStudents.map((s) => s.id));
    return programs.filter((p) => {
      if (p.audience === 'all') return true;
      if (p.audience === 'department') return p.departmentId === hodDept.id;
      if (p.audience === 'student') {
        return (p.studentIds || []).some((id) => ids.has(id));
      }
      return false;
    });
  }, [programs, hod, hodDept, branchStudents]);

  const selectableStudents = useMemo(() => {
    if (form.audience === 'department' && form.departmentId) {
      return students.filter((s) => s.departmentId === form.departmentId);
    }
    if (hod && hodDept) return branchStudents;
    return students;
  }, [students, form.audience, form.departmentId, hod, hodDept, branchStudents]);

  const canAssign = !hod || access.canAssignPrograms;
  const mockTypes = new Set(['mock_ai', 'mock_hr']);
  const typeAllowed = (typeId) => {
    if (!hod) return true;
    if (mockTypes.has(typeId) && !access.canRunMocks) return false;
    return true;
  };

  const toggleStudent = (id) => {
    setForm((f) => {
      const has = f.studentIds.includes(id);
      return {
        ...f,
        studentIds: has ? f.studentIds.filter((x) => x !== id) : [...f.studentIds, id],
      };
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (!canAssign) {
      setErr('TPO has not enabled program assignment for HODs.');
      return;
    }
    if (!form.title.trim()) {
      setErr('Program title is required.');
      return;
    }
    if (!typeAllowed(form.type)) {
      setErr('Mock interviews are disabled for HODs. Ask TPO to enable “Run AI / HR mocks”.');
      return;
    }
    if (hod && !hodDept) {
      setErr('Your department is not linked yet.');
      return;
    }

    let payload = { ...form };
    if (hod && hodDept) {
      if (payload.audience === 'all') {
        payload = { ...payload, audience: 'department', departmentId: hodDept.id };
      }
      if (payload.audience === 'department') {
        payload = { ...payload, departmentId: hodDept.id };
      }
      if (payload.audience === 'student') {
        const allowed = new Set(branchStudents.map((s) => s.id));
        payload = {
          ...payload,
          departmentId: hodDept.id,
          studentIds: payload.studentIds.filter((id) => allowed.has(id)),
        };
      }
    }

    if (payload.audience === 'department' && !payload.departmentId) {
      setErr('Pick a department for department-scoped programs.');
      return;
    }
    if (payload.audience === 'student' && !payload.studentIds.length) {
      setErr('Select at least one student.');
      return;
    }

    createProgram({
      ...payload,
      studentIds: payload.audience === 'student' ? payload.studentIds : [],
    });
    setForm(
      hod && hodDept
        ? { ...empty, audience: 'department', departmentId: hodDept.id }
        : empty
    );
    setMsg(
      hod
        ? 'Assessment assigned to your branch. Student inbox wires when notifications API is live.'
        : 'Program assigned. Delivery / student inbox wires when notifications API is live.'
    );
  };

  const audienceLabel = (p) => {
    if (p.audience === 'all') return 'All students';
    if (p.audience === 'department') {
      return departments.find((d) => d.id === p.departmentId)?.name || 'Department';
    }
    const n = (p.studentIds || []).length;
    return `${n} selected student${n === 1 ? '' : 's'}`;
  };

  const assessmentTypes = PROGRAM_TYPES.filter((t) => t.group === 'Assessment' || t.group === 'Interview');
  const otherTypes = PROGRAM_TYPES.filter((t) => t.group === 'Engagement');

  if (hod && !hodDept) {
    return (
      <div className="mm-org-panel">
        <h2 className="mm-org-panel__title">Branch not linked</h2>
        <p className="m-0 text-sm mm-org-text-muted">
          Link your HOD account to a department before assigning assessments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="mm-org-toolbar">
        <p className="m-0 text-sm mm-org-text-muted">
          {hod
            ? `Assign skill, aptitude, English, technical checks and AI/HR mocks for ${hodDept.name} — whole branch or selected students.`
            : 'Assign readiness tests, AI/HR mocks, competitions, or custom features — campus-wide, by department, or to specific students.'}
        </p>
      </div>

      {!canAssign ? (
        <div className="mm-org-alert mm-org-alert--error">
          Program assignment is disabled for HODs. Ask TPO to enable “Assign programs / mocks”.
        </div>
      ) : null}

      <div className="mm-org-split">
        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">
                {hod ? 'Assign assessment / program' : 'Assign a program / feature'}
              </h2>
              <p className="mm-org-panel__meta">
                {hod
                  ? 'Choose type, due date, and audience within your branch.'
                  : 'Timeline + audience. Product modules link when catalog API is live.'}
              </p>
            </div>
          </div>
          {err ? <div className="mm-org-alert mm-org-alert--error mb-3">{err}</div> : null}
          {msg ? <div className="mm-org-alert mm-org-alert--success mb-3">{msg}</div> : null}
          <form onSubmit={onSubmit}>
            <div className="mm-org-form-grid">
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="mm-org-label" htmlFor="prg-title">Title</label>
                <input
                  id="prg-title"
                  className="mm-org-input"
                  placeholder={hod ? 'CSE aptitude baseline · week 3' : 'Pre-drive readiness sprint'}
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  disabled={!canAssign}
                />
              </div>
              <div>
                <label className="mm-org-label" htmlFor="prg-type">Type / feature</label>
                <select
                  id="prg-type"
                  className="mm-org-select"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  disabled={!canAssign}
                >
                  <optgroup label="Assessments & interviews">
                    {assessmentTypes.map((t) => (
                      <option key={t.id} value={t.id} disabled={!typeAllowed(t.id)}>
                        {t.label}
                        {!typeAllowed(t.id) ? ' (disabled)' : ''}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Other">
                    {otherTypes.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="mm-org-label" htmlFor="prg-days">Complete in (days)</label>
                <input
                  id="prg-days"
                  type="number"
                  min={1}
                  className="mm-org-input"
                  value={form.dueInDays}
                  onChange={(e) => setForm((f) => ({ ...f, dueInDays: e.target.value }))}
                  disabled={!canAssign}
                />
              </div>
              <div>
                <label className="mm-org-label" htmlFor="prg-aud">Audience</label>
                <select
                  id="prg-aud"
                  className="mm-org-select"
                  value={hod && form.audience === 'all' ? 'department' : form.audience}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      audience: e.target.value,
                      studentIds: [],
                      departmentId:
                        e.target.value === 'department'
                          ? hodDept?.id || f.departmentId
                          : hod
                            ? hodDept?.id || ''
                            : '',
                    }))
                  }
                  disabled={!canAssign}
                >
                  {!hod ? <option value="all">All students</option> : null}
                  <option value="department">
                    {hod ? `Entire ${hodDept?.name || 'department'}` : 'One department'}
                  </option>
                  <option value="student">Specific students</option>
                </select>
              </div>
              {!hod && (form.audience === 'department' || form.audience === 'student') ? (
                <div>
                  <label className="mm-org-label" htmlFor="prg-dept">
                    {form.audience === 'student' ? 'Filter by department (optional)' : 'Department'}
                  </label>
                  <select
                    id="prg-dept"
                    className="mm-org-select"
                    value={form.departmentId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, departmentId: e.target.value, studentIds: [] }))
                    }
                    disabled={!canAssign}
                  >
                    <option value="">{form.audience === 'student' ? 'All departments' : 'Select…'}</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>

            {form.audience === 'student' ? (
              <div className="mt-4">
                <p className="mm-org-label">Select students ({form.studentIds.length})</p>
                {selectableStudents.length ? (
                  <div className="mm-org-chip-grid">
                    {selectableStudents.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`mm-org-chip ${form.studentIds.includes(s.id) ? 'is-on' : ''}`}
                        onClick={() => toggleStudent(s.id)}
                        disabled={!canAssign}
                      >
                        {s.name}
                        <span className="mm-org-text-muted">{s.readiness}%</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="m-0 text-sm mm-org-text-muted">
                    {hod
                      ? 'No enrolled students in your branch yet. Invite them from Students.'
                      : 'No enrolled students yet. Approve invites in Enrollment first.'}
                  </p>
                )}
              </div>
            ) : null}

            <p className="mt-3 text-xs mm-org-text-muted">
              {hod
                ? `${branchStudents.length} student(s) in your branch.`
                : `${students.length} enrolled student(s) available.`}{' '}
              Types map to MentorMuni product features when the catalog API is connected.
            </p>
            <div className="mm-org-form-actions">
              <button type="submit" className="mm-org-btn mm-org-btn--primary" disabled={!canAssign}>
                <Plus size={15} /> {hod ? 'Assign assessment' : 'Assign program'}
              </button>
            </div>
          </form>
        </section>

        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Active assignments</h2>
              <p className="mm-org-panel__meta">{visiblePrograms.length} program(s)</p>
            </div>
          </div>
          {visiblePrograms.length ? (
            <div className="mm-org-table-wrap">
              <table className="mm-org-table">
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>Audience</th>
                    <th>Timeline</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visiblePrograms.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <p className="mm-org-table__title">{p.title}</p>
                        <p className="mm-org-table__meta">{typeLabel(p.type)}</p>
                      </td>
                      <td className="mm-org-text">{audienceLabel(p)}</td>
                      <td>
                        <span className="mm-org-badge mm-org-badge--pending">{p.dueInDays} days</span>
                      </td>
                      <td>
                        {role === ORG_ROLES.TPO || (hod && canAssign) ? (
                          <button
                            type="button"
                            className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                            onClick={() => removeProgram(p.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mm-org-empty">
              {hod ? 'No assessments assigned to your branch yet.' : 'No programs assigned yet.'}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
