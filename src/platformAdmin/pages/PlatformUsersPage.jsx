import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  getPlatformUsers,
  createPlatformUser,
  updatePlatformUserStatus,
  PLATFORM_ROLES,
} from '../store';

export default function PlatformUsersPage() {
  const [users, setUsers] = useState(() => getPlatformUsers());
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Support',
    status: 'ACTIVE',
  });

  useEffect(() => {
    const refresh = () => setUsers(getPlatformUsers());
    window.addEventListener('mm-platform-db-updated', refresh);
    return () => window.removeEventListener('mm-platform-db-updated', refresh);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setError('');
    try {
      createPlatformUser(form);
      setOpen(false);
      setForm({ name: '', email: '', role: 'Support', status: 'ACTIVE' });
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
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-bold text-slate-100">{u.name}</td>
                <td className="text-slate-300">{u.email}</td>
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
                      onClick={() =>
                        updatePlatformUserStatus(
                          u.id,
                          u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                        )
                      }
                    >
                      {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              className="mm-pa-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="mm-pa-modal"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="mm-pa-modal__title">Add Platform User</h2>
                  <p className="mm-pa-modal__sub">Inserts into platform_users</p>
                </div>
                <button type="button" className="mm-pa-btn mm-pa-btn--ghost !px-2 !py-2" onClick={() => setOpen(false)}>
                  <X size={16} />
                </button>
              </div>
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
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
                  <button type="submit" className="mm-pa-btn mm-pa-btn--primary">Create User</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
