import { useEffect, useState } from 'react';
import { Bell, Trash2 } from 'lucide-react';
import {
  createDrive,
  listDepartments,
  listDrives,
  removeDrive,
  subscribeOrgDb,
} from '../store';

const empty = {
  company: '',
  role: '',
  date: '',
  message: '',
  audience: 'all',
  departmentId: '',
};

export default function DrivesPage() {
  const [drives, setDrives] = useState(() => listDrives());
  const [departments, setDepartments] = useState(() => listDepartments());
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(
    () =>
      subscribeOrgDb(() => {
        setDrives(listDrives());
        setDepartments(listDepartments());
      }),
    []
  );

  const onSubmit = (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (!form.company.trim()) {
      setErr('Company name is required.');
      return;
    }
    createDrive(form);
    setForm(empty);
    setMsg('Drive saved and marked as notified (email/push API next).');
  };

  return (
    <div className="mm-org-split">
      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">Announce a drive</h2>
            <p className="mm-org-panel__meta">Notify the campus about an upcoming company visit.</p>
          </div>
        </div>
        {err ? <div className="mm-org-alert mm-org-alert--error mb-3">{err}</div> : null}
        {msg ? <div className="mm-org-alert mm-org-alert--success mb-3">{msg}</div> : null}
        <form onSubmit={onSubmit}>
          <div className="mm-org-form-grid">
            <div>
              <label className="mm-org-label" htmlFor="drv-co">Company</label>
              <input
                id="drv-co"
                className="mm-org-input"
                placeholder="Infosys"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              />
            </div>
            <div>
              <label className="mm-org-label" htmlFor="drv-role">Role</label>
              <input
                id="drv-role"
                className="mm-org-input"
                placeholder="SDE Intern"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              />
            </div>
            <div>
              <label className="mm-org-label" htmlFor="drv-date">Drive date</label>
              <input
                id="drv-date"
                type="date"
                className="mm-org-input"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="mm-org-label" htmlFor="drv-aud">Audience</label>
              <select
                id="drv-aud"
                className="mm-org-select"
                value={form.audience}
                onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))}
              >
                <option value="all">Entire campus</option>
                <option value="department">One department</option>
              </select>
            </div>
            {form.audience === 'department' ? (
              <div>
                <label className="mm-org-label" htmlFor="drv-dept">Department</label>
                <select
                  id="drv-dept"
                  className="mm-org-select"
                  value={form.departmentId}
                  onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))}
                >
                  <option value="">Select…</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            ) : null}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="mm-org-label" htmlFor="drv-msg">Message</label>
              <textarea
                id="drv-msg"
                className="mm-org-textarea"
                placeholder="Eligibility, rounds, prep tips…"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              />
            </div>
          </div>
          <div className="mm-org-form-actions">
            <button type="submit" className="mm-org-btn mm-org-btn--primary">
              <Bell size={15} /> Notify campus
            </button>
          </div>
        </form>
      </section>

      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">Scheduled drives</h2>
            <p className="mm-org-panel__meta">{drives.length} announcement(s)</p>
          </div>
        </div>
        {drives.length ? (
          <div className="space-y-3">
            {drives.map((d) => (
              <div
                key={d.id}
                className="mm-org-list-card"
              >
                <div className="min-w-0">
                  <p className="m-0 font-bold mm-org-text">{d.company}</p>
                  <p className="m-0 mt-1 text-sm mm-org-text-muted">
                    {d.role}
                    {d.date ? ` · ${d.date}` : ''}
                    {d.audience === 'department'
                      ? ` · ${departments.find((x) => x.id === d.departmentId)?.name || 'Dept'}`
                      : ' · Campus-wide'}
                  </p>
                  {d.message ? (
                    <p className="m-0 mt-2 text-sm mm-org-text-muted">{d.message}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                  onClick={() => removeDrive(d.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mm-org-empty">No drives announced yet.</div>
        )}
      </section>
    </div>
  );
}
