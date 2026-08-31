import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { getOrgSession } from '../../orgPortal';
import { isDemoSession } from '../demoAuth';
import { isHodRole, normalizeOrgRole, ORG_ROLES } from '../roles';
import { resolveHodDepartment } from '../hodScope';
import { fetchDepartmentOptions } from '../departmentsApi';
import { fetchStudents } from '../studentsApi';
import {
  createProgramApi,
  deleteProgramApi,
  fetchPrograms,
} from '../programsApi';
import DepartmentMultiSelect from '../components/DepartmentMultiSelect';
import { useTableQuery } from '../../hooks/useTableQuery';
import { TableToolbar } from '../../components/table/TableToolbar';
import { SortableTh } from '../../components/table/SortableTh';
import {
  PROGRAM_TYPES,
  getHodAccess,
  listDepartments,
  listStudents,
  subscribeOrgDb,
} from '../store';

const empty = {
  title: '',
  type: 'readiness',
  audience: 'all',
  departmentId: '',
  departmentIds: [],
  studentIds: [],
  dueInDays: 7,
};

function typeLabel(id) {
  return PROGRAM_TYPES.find((t) => t.id === id)?.label || id;
}

export default function ProgramsPage() {
  const session = getOrgSession();
  const demo = isDemoSession(session);
  const location = useLocation();
  const role = normalizeOrgRole(session?.role);
  const hod = isHodRole(session?.role);
  const [hodDept, setHodDept] = useState(() => (hod ? resolveHodDepartment(session) : null));

  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState(() => (demo ? listDepartments() : []));
  const [students, setStudents] = useState(() => (demo ? listStudents() : []));
  const [access, setAccess] = useState(() => getHodAccess());
  const [form, setForm] = useState(() =>
    hod && hodDept
      ? { ...empty, audience: 'department', departmentId: hodDept.id, departmentIds: [String(hodDept.id)] }
      : empty
  );
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [dataSource, setDataSource] = useState('');
  const [warning, setWarning] = useState('');

  const reloadPrograms = async () => {
    const res = await fetchPrograms();
    setPrograms(res.programs || []);
    setDataSource(res.source || '');
    setWarning(res.warning || '');
    if (!res.ok && res.error) {
      setErr(res.error);
      setWarning('');
    }
  };

  useEffect(() => {
    reloadPrograms();
    if (!demo) return undefined;
    return subscribeOrgDb(() => {
      reloadPrograms();
      setDepartments(listDepartments());
      setStudents(listStudents());
      setAccess(getHodAccess());
    });
  }, [demo, location.key]);

  // Live mode: hydrate departments + student roster from API for accurate pickers
  useEffect(() => {
    if (demo) return undefined;
    let cancelled = false;
    (async () => {
      const deptRes = await fetchDepartmentOptions();
      if (cancelled) return;
      const deptList = deptRes.departments || [];
      setDepartments(
        deptList.map((d) => ({ id: d.id, name: d.name, code: d.code || '' }))
      );
      if (hod) {
        const dept = resolveHodDepartment(getOrgSession(), deptList);
        setHodDept(dept);
        if (dept?.id) {
          const roster = await fetchStudents({ departmentId: dept.id });
          if (!cancelled) setStudents(roster.students || []);
        }
      } else {
        const roster = await fetchStudents();
        if (!cancelled) setStudents(roster.students || []);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [demo, hod, location.key, session?.department_id]);

  const branchStudents = useMemo(() => {
    if (hod && hodDept) {
      return students.filter((s) => String(s.departmentId) === String(hodDept.id));
    }
    return students;
  }, [students, hod, hodDept]);

  const visiblePrograms = useMemo(() => {
    if (!hod || !hodDept) return programs;
    const ids = new Set(branchStudents.map((s) => String(s.id)));
    return programs.filter((p) => {
      if (p.audience === 'all') return true;
      if (p.audience === 'department') {
        const ids = p.departmentIds?.length
          ? p.departmentIds
          : p.departmentId
            ? [p.departmentId]
            : [];
        return ids.some((id) => String(id) === String(hodDept.id));
      }
      if (p.audience === 'student') {
        return (p.studentIds || []).some((id) => ids.has(String(id)));
      }
      return false;
    });
  }, [programs, hod, hodDept, branchStudents]);

  const selectableStudents = useMemo(() => {
    if (form.audience === 'department' && form.departmentIds.length) {
      const allowed = new Set(form.departmentIds.map(String));
      return students.filter((s) => allowed.has(String(s.departmentId)));
    }
    if (form.audience === 'department' && form.departmentId) {
      return students.filter((s) => String(s.departmentId) === String(form.departmentId));
    }
    if (hod && hodDept) return branchStudents;
    return students;
  }, [students, form.audience, form.departmentId, form.departmentIds, hod, hodDept, branchStudents]);

  const canAssign = !hod || access.canAssignPrograms;
  const mockTypes = new Set(['mock_ai', 'mock_hr']);
  const typeAllowed = (typeId) => {
    if (!hod) return true;
    if (mockTypes.has(typeId) && !access.canRunMocks) return false;
    return true;
  };

  const toggleStudent = (id) => {
    const key = String(id);
    setForm((f) => {
      const has = f.studentIds.map(String).includes(key);
      return {
        ...f,
        studentIds: has ? f.studentIds.filter((x) => String(x) !== key) : [...f.studentIds, key],
      };
    });
  };

  const onSubmit = async (e) => {
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
        payload = {
          ...payload,
          departmentId: hodDept.id,
          departmentIds: [String(hodDept.id)],
        };
      }
      if (payload.audience === 'student') {
        const allowed = new Set(branchStudents.map((s) => String(s.id)));
        payload = {
          ...payload,
          departmentId: hodDept.id,
          studentIds: payload.studentIds.filter((id) => allowed.has(String(id))),
        };
      }
    }

    if (payload.audience === 'department' && !hod && !payload.departmentIds?.length) {
      setErr('Select at least one department.');
      return;
    }
    if (payload.audience === 'student' && !payload.studentIds.length) {
      setErr('Select at least one student.');
      return;
    }

    setBusy(true);
    try {
      const res = await createProgramApi({
        ...payload,
        studentIds: payload.audience === 'student' ? payload.studentIds : [],
      });
      if (!res.ok) {
        setErr(res.error || 'Unable to assign program.');
        return;
      }
      await reloadPrograms();
      setForm(
        hod && hodDept
          ? {
              ...empty,
              audience: 'department',
              departmentId: hodDept.id,
              departmentIds: [String(hodDept.id)],
            }
          : empty
      );
      const n = res.recipientsEstimated;
      setMsg(
        res.message ||
          (n != null
            ? `Program assigned to ~${n} student(s).`
            : 'Program assigned.')
      );
      if (res.warning) setWarning(typeof res.warning === 'string' ? res.warning : res.message);
    } finally {
      setBusy(false);
    }
  };

  const onRemove = async (id) => {
    setErr('');
    const res = await deleteProgramApi(id);
    if (!res.ok) {
      setErr(res.error || 'Unable to remove program.');
      return;
    }
    await reloadPrograms();
  };

  const audienceLabel = (p) => {
    if (p.audience === 'all') return 'All students';
    if (p.audience === 'department') {
      const ids = p.departmentIds?.length
        ? p.departmentIds
        : p.departmentId
          ? [p.departmentId]
          : [];
      const names = ids
        .map((id) => departments.find((d) => String(d.id) === String(id))?.name)
        .filter(Boolean);
      if (!names.length) return 'Department';
      if (names.length === 1) return names[0];
      if (names.length <= 3) return names.join(', ');
      return `${names.slice(0, 2).join(', ')} +${names.length - 2} more`;
    }
    const n = (p.studentIds || []).length;
    if (n > 0) return `${n} selected student${n === 1 ? '' : 's'}`;
    if (p.recipientsEstimated != null) return `~${p.recipientsEstimated} students`;
    return 'Selected students';
  };

  const programsTable = useTableQuery(visiblePrograms, {
    searchFn: (row, q) => {
      const hay = [row.title, typeLabel(row.type), audienceLabel(row)].join(' ').toLowerCase();
      return hay.includes(q);
    },
    getSortValue: (row, key) => {
      if (key === 'program') return (row.title || '').toLowerCase();
      if (key === 'audience') return audienceLabel(row);
      if (key === 'timeline') return row.dueInDays;
      return row[key];
    },
  });

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
      {demo ? (
        <div className="mm-org-alert mm-org-alert--error" role="status">
          Demo mode — programs save in this browser only (not delivered to students).
        </div>
      ) : dataSource === 'api' ? (
        <div className="mm-org-alert mm-org-alert--success" role="status">
          Live assignments — students receive programs in their MentorMuni inbox and email queue.
        </div>
      ) : dataSource === 'unavailable' || dataSource === 'error' ? (
        <div className="mm-org-alert mm-org-alert--error" role="status">
          {err || warning || 'Could not reach the programs API. Deploy the latest API and refresh.'}
        </div>
      ) : warning ? (
        <div className="mm-org-alert mm-org-alert--error" role="status">
          {warning}
        </div>
      ) : null}

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
                  : 'Timeline + audience. Delivered to the student inbox when assigned.'}
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
                  disabled={!canAssign || busy}
                />
              </div>
              <div>
                <label className="mm-org-label" htmlFor="prg-type">Type / feature</label>
                <select
                  id="prg-type"
                  className="mm-org-select"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  disabled={!canAssign || busy}
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
                  disabled={!canAssign || busy}
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
                  disabled={!canAssign || busy}
                >
                  {!hod ? <option value="all">All students</option> : null}
                  <option value="department">
                    {hod ? `Entire ${hodDept?.name || 'department'}` : 'Selected department(s)'}
                  </option>
                  <option value="student">Specific students</option>
                </select>
              </div>
              {!hod && form.audience === 'department' ? (
                <div style={{ gridColumn: '1 / -1' }}>
                  <DepartmentMultiSelect
                    label="Department(s)"
                    hint="Pick one or more departments for this assignment."
                    departments={departments}
                    value={form.departmentIds}
                    onChange={(departmentIds) =>
                      setForm((f) => ({ ...f, departmentIds, departmentId: departmentIds[0] || '' }))
                    }
                    disabled={!canAssign || busy}
                    min={1}
                  />
                </div>
              ) : null}
              {!hod && form.audience === 'student' ? (
                <div>
                  <label className="mm-org-label" htmlFor="prg-dept">
                    Filter by department (optional)
                  </label>
                  <select
                    id="prg-dept"
                    className="mm-org-select"
                    value={form.departmentId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, departmentId: e.target.value, studentIds: [] }))
                    }
                    disabled={!canAssign || busy}
                  >
                    <option value="">All departments</option>
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
                        className={`mm-org-chip ${form.studentIds.map(String).includes(String(s.id)) ? 'is-on' : ''}`}
                        onClick={() => toggleStudent(s.id)}
                        disabled={!canAssign || busy}
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
                : `${students.length} enrolled student(s) available.`}
            </p>
            <div className="mm-org-form-actions">
              <button
                type="submit"
                className="mm-org-btn mm-org-btn--primary"
                disabled={!canAssign || busy}
              >
                <Plus size={15} /> {busy ? 'Assigning…' : hod ? 'Assign assessment' : 'Assign program'}
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
            <>
            <TableToolbar
              query={programsTable.query}
              onQueryChange={programsTable.setQuery}
              placeholder="Search program, type, audience…"
              count={programsTable.count}
              total={programsTable.total}
            />
            <div className="mm-org-table-wrap">
              <table className="mm-org-table">
                <thead>
                  <tr>
                    <SortableTh label="Program" sortKey="program" sort={programsTable.sort} onSort={programsTable.toggleSort} />
                    <SortableTh label="Audience" sortKey="audience" sort={programsTable.sort} onSort={programsTable.toggleSort} />
                    <SortableTh label="Timeline" sortKey="timeline" sort={programsTable.sort} onSort={programsTable.toggleSort} />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {programsTable.rows.length ? programsTable.rows.map((p) => (
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
                            onClick={() => onRemove(p.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4}>
                        <div className="mm-org-empty">No programs match this search.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </>
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
