import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  fetchLoginColleges,
  getSavedCollegeCode,
  pickInitialCollege,
  saveCollegeCode,
} from '../../orgPortal';
import { DEMO_ORG } from '../../organizationPortal/demoAuth';
import { useCollegeTenantContext } from '../../tenant/CollegeTenantProvider';
import { tenantPortalPath } from '../../tenant/resolveTenant';
import {
  fetchPublicDepartments,
  registerStudentPublic,
} from '../../organizationPortal/studentsApi';
import { studentPaths } from '../paths';
import { StudentThemeFab, useStudentTheme } from '../useStudentTheme.jsx';
import '../student-login.css';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;

/**
 * Self-enroll for students not yet on the roster (e.g. HOD added most of a batch).
 * Submits to HOD approval queue → same approve / set-password / login flow.
 */
export default function StudentEnrollPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { theme, toggle, rootClass } = useStudentTheme();
  const {
    college: tenantCollege,
    organizationCode: tenantOrgCode,
    locked: tenantLocked,
    loading: tenantLoading,
  } = useCollegeTenantContext();
  const presetDept = String(params.get('dept') || '').trim();

  const [colleges, setColleges] = useState([]);
  const [college, setCollege] = useState(null);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [deptSource, setDeptSource] = useState('');
  const [deptLoadFor, setDeptLoadFor] = useState('');
  const [deptHint, setDeptHint] = useState('');

  const [departmentId, setDepartmentId] = useState(presetDept);
  const [name, setName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tenantLocked) {
      if (tenantCollege?.code) {
        setCollege(tenantCollege);
        setColleges([tenantCollege]);
      }
      setCollegesLoading(tenantLoading);
      return undefined;
    }

    let cancelled = false;
    (async () => {
      setCollegesLoading(true);
      const result = await fetchLoginColleges();
      if (cancelled) return;
      setCollegesLoading(false);
      const list = result.ok ? result.colleges || [] : [DEMO_ORG];
      setColleges(list.length ? list : [DEMO_ORG]);
      const fromUrl = pickInitialCollege(list, params);
      const saved = getSavedCollegeCode();
      const fromSaved = saved ? list.find((c) => c.code === saved) : null;
      setCollege(fromUrl || fromSaved || null);
    })();
    return () => {
      cancelled = true;
    };
  }, [params, tenantLocked, tenantCollege, tenantLoading]);

  const orgCode = useMemo(() => {
    if (tenantLocked) return tenantOrgCode;
    return String(college?.code || '').trim().toUpperCase();
  }, [tenantLocked, tenantOrgCode, college]);

  const displayCollege = tenantLocked ? tenantCollege : college;
  const loginPath = tenantPortalPath(studentPaths.login);

  const deptsLoading = Boolean(orgCode) && deptLoadFor !== orgCode;

  useEffect(() => {
    let cancelled = false;
    if (!orgCode) return undefined;
    fetchPublicDepartments(orgCode).then((res) => {
      if (cancelled) return;
      setDepartments(res.departments || []);
      setDeptSource(res.source || '');
      setDeptHint(res.error || '');
      setDeptLoadFor(orgCode);
      setDepartmentId((prev) => {
        if (prev && (res.departments || []).some((d) => String(d.id) === String(prev))) {
          return prev;
        }
        if (
          presetDept &&
          (res.departments || []).some((d) => String(d.id) === String(presetDept))
        ) {
          return presetDept;
        }
        return '';
      });
    });
    return () => {
      cancelled = true;
    };
  }, [orgCode, presetDept]);

  const selectedDept = useMemo(
    () => departments.find((d) => String(d.id) === String(departmentId)) || null,
    [departments, departmentId]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!orgCode) {
      setError('Select your college.');
      return;
    }
    if (!departmentId) {
      setError('Select your department.');
      return;
    }
    if (!phone.trim()) {
      setError('Enter a contact number.');
      return;
    }
    setLoading(true);
    const res = await registerStudentPublic({
      orgCode,
      orgName: college?.name || '',
      departmentId,
      departmentName: selectedDept?.name || '',
      name,
      email,
      collegeId,
      phone: phone.trim(),
    });
    setLoading(false);
    if (!res.ok) {
      setError(res.error || 'Unable to submit enrollment.');
      return;
    }
    saveCollegeCode(orgCode);
    setDone(true);
  };

  return (
    <div className={`mm-stu-login-root ${rootClass}`}>
      <StudentThemeFab theme={theme} onToggle={toggle} />
      <div className="mm-stu-atm" aria-hidden>
        <div className="mm-stu-atm__mesh" />
        <div className="mm-stu-atm__blob mm-stu-atm__blob--a" />
        <div className="mm-stu-atm__blob mm-stu-atm__blob--b" />
      </div>

      <div className="mm-stu-form-col" style={{ minHeight: '100dvh', paddingTop: 32 }}>
        <div className="mm-stu-card mm-stu-card--genz" style={{ width: 'min(460px, 100%)' }}>
          <button
            type="button"
            className="mm-stu-gate2__back"
            style={{ marginBottom: 16 }}
            onClick={() => navigate(loginPath)}
          >
            <ArrowLeft size={16} strokeWidth={2.4} /> Back to login
          </button>

          <div className="mm-stu-brand" style={{ marginBottom: 18 }}>
            <img src={LOGO} alt="MentorMuni" style={{ height: 36 }} />
            <div className="mm-stu-brand__text">
              <span className="mm-stu-brand__name">MentorMuni</span>
              <span className="mm-stu-brand__tag" style={{ color: 'var(--stu-muted)' }}>
                Request enrollment
              </span>
            </div>
          </div>

          {done ? (
            <>
              <p className="mm-stu-step-label">Request sent</p>
              <h1 className="mm-stu-card-title">Waiting for approval</h1>
              <p className="mm-stu-card-sub">
                <strong>{college?.name || orgCode}</strong>
                {selectedDept ? ` · ${selectedDept.name}` : ''}
              </p>
              <ul className="mm-stu-enroll-steps">
                <li>HOD reviews your request</li>
                <li>You get a set-password link if approved</li>
                <li>Set password, then sign in with email or roll</li>
              </ul>
              <Link
                to={loginPath}
                className="mm-stu-submit"
                style={{ textDecoration: 'none' }}
              >
                Back to login
              </Link>
            </>
          ) : (
            <>
              <p className="mm-stu-step-label">New student?</p>
              <h1 className="mm-stu-card-title">Enroll with your department</h1>
              <p className="mm-stu-card-sub">
                Send your details to your HOD. They approve or deny — same queue as invites and
                CSV adds.
              </p>

              {error ? (
                <div className="mm-stu-alert mm-stu-alert--error" role="alert">
                  {error}
                </div>
              ) : null}

              <form
                onSubmit={onSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                noValidate
              >
                <label className="mm-stu-label">
                  College
                  {tenantLocked && displayCollege?.name ? (
                    <div className="mm-stu-field-input" style={{ padding: '12px 14px' }}>
                      {displayCollege.name}
                      {displayCollege.code ? ` (${displayCollege.code})` : ''}
                    </div>
                  ) : (
                    <select
                      className="mm-stu-field-input"
                      value={college?.code || ''}
                      disabled={collegesLoading}
                      onChange={(e) => {
                        const next = colleges.find((c) => c.code === e.target.value) || null;
                        setCollege(next);
                        setError('');
                      }}
                      required
                    >
                      <option value="">{collegesLoading ? 'Loading…' : 'Select college'}</option>
                      {colleges.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  )}
                </label>

                <label className="mm-stu-label">
                  Department
                  <select
                    className="mm-stu-field-input"
                    value={departmentId}
                    disabled={!orgCode || deptsLoading}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    required
                  >
                    <option value="">
                      {!orgCode
                        ? 'Select college first'
                        : deptsLoading
                          ? 'Loading departments…'
                          : 'Select department'}
                    </option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                        {d.code ? ` (${d.code})` : ''}
                      </option>
                    ))}
                  </select>
                </label>
                {deptHint && orgCode && !deptsLoading ? (
                  <p className="mm-stu-card-sub" style={{ margin: 0, fontSize: 13 }}>
                    {deptHint}
                    {deptSource ? ` (${deptSource})` : ''}
                  </p>
                ) : null}

                <label className="mm-stu-label">
                  Full name
                  <input
                    className="mm-stu-field-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </label>

                <label className="mm-stu-label">
                  College ID / roll number
                  <input
                    className="mm-stu-field-input"
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    placeholder="CSE2024A01"
                    required
                  />
                </label>

                <label className="mm-stu-label">
                  Contact number
                  <input
                    className="mm-stu-field-input"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    required
                  />
                </label>

                <label className="mm-stu-label">
                  College email
                  <input
                    className="mm-stu-field-input"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="mm-stu-submit"
                  disabled={loading || !orgCode || !departmentId}
                >
                  {loading ? 'Submitting…' : 'Send to HOD for approval'}
                </button>
              </form>

              <p className="mm-stu-card-foot">
                Already approved?{' '}
                <Link
                  to={tenantLocked ? loginPath : orgCode ? `${studentPaths.login}?org=${encodeURIComponent(orgCode)}` : studentPaths.login}
                  className="mm-stu-link"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
