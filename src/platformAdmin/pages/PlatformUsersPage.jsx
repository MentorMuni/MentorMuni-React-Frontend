import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import {
  getPlatformUsers,
  createPlatformUser,
  updatePlatformUserStatus,
  PLATFORM_ROLES,
} from '../store';
import Modal from '../Modal';

export default function PlatformUsersPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SUPPORT',
    status: 'ACTIVE',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      setLoading(true);
      setUsers(await getPlatformUsers());
      setLoading(false);
    };
    refresh().catch((e) => {
      setError(e.message || 'Failed to load platform users.');
      setLoading(false);
    });
    window.addEventListener('mm-platform-db-updated', refresh);
    return () => window.removeEventListener('mm-platform-db-updated', refresh);
  }, []);

  useEffect(() => {
    if (!error) return undefined;
    const timer = window.setTimeout(() => setError(''), 3500);
    return () => window.clearTimeout(timer);
  }, [error]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createPlatformUser(form);
      setOpen(false);
      setForm({ name: '', email: '', password: '', role: 'SUPPORT', status: 'ACTIVE' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button type="button" className="mm-pa-btn mm-pa-btn--primary" onClick={() => setOpen(true)}>
          <Plus size={15} /> Add Platform User
        </button>
      </div>

      <div className="mm-pa-panel overflow-x-auto">
        {error && !open && <div className="mm-pa-inline-toast mm-pa-inline-toast--error">{error}</div>}
        <p className="mb-4 text-sm text-slate-400">
          MentorMuni employees only. Separate from organization users. Roles: Platform Admin, Support, Sales, Operations.
        </p>
        <table className="mm-pa-table min-w-[760px]">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(loading ? Array.from({ length: 5 }, (_, i) => ({ id: `loading-user-${i}` })) : users).map((u) => (
              <tr key={u.id}>
                {loading ? (
                  <>
                    <td><div className="mm-pa-skeleton h-5 w-32" /></td>
                    <td><div className="mm-pa-skeleton h-5 w-48" /></td>
                    <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                    <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                    <td><div className="mm-pa-skeleton h-5 w-24" /></td>
                    <td><div className="mm-pa-skeleton h-8 w-24" /></td>
                  </>
                ) : (
                  <>
                    <td className="mm-pa-table__title">{u.name}</td>
                    <td className="mm-pa-table__meta">{u.email}</td>
                    <td>
                      <span className="mm-pa-badge mm-pa-badge--neutral">{u.role}</span>
                    </td>
                    <td>
                      <span className={`mm-pa-badge ${u.status === 'ACTIVE' ? 'mm-pa-badge--active' : 'mm-pa-badge--suspended'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="text-slate-400">
                      {new Date(u.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      {u.email !== 'mentormuniteam@gmail.com' && (
                        <button
                          type="button"
                          className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs"
                          onClick={async () => {
                            try {
                              await updatePlatformUserStatus(
                                u.id,
                                u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                              );
                            } catch (err) {
                              setError(err.message || 'Failed to update platform user status.');
                            }
                          }}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Platform User"
        sub="Creates a MentorMuni employee account for the platform portal."
      >
        <form onSubmit={submit} className="space-y-3">
          {error && <div className="mm-pa-error">{error}</div>}
          <div>
            <label className="mm-pa-label">Name *</label>
            <input className="mm-pa-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mm-pa-label">Email *</label>
            <input type="email" className="mm-pa-input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="mm-pa-label">Role</label>
            <select className="mm-pa-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {PLATFORM_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mm-pa-label">Password *</label>
            <input
              type="password"
              className="mm-pa-input"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="mm-pa-btn mm-pa-btn--primary">Create User</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
