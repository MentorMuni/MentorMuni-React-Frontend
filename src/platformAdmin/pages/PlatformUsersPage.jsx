import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import {
  getPlatformUsers,
  createPlatformUser,
  updatePlatformUser,
  updatePlatformUserStatus,
  deletePlatformUser,
  PLATFORM_ROLES,
} from '../store';
import Modal from '../Modal';
import { useTableQuery } from '../../hooks/useTableQuery';
import { TableToolbar } from '../../components/table/TableToolbar';
import { SortableTh } from '../../components/table/SortableTh';

/** Must match API `_PROTECTED_PLATFORM_ADMIN_EMAILS` (seed + production primary). */
const PROTECTED_PLATFORM_ADMIN_EMAILS = new Set([
  'admin@mentormuni.com',
  'mentormuniteam@gmail.com',
]);

function isProtectedPlatformAdmin(email) {
  return PROTECTED_PLATFORM_ADMIN_EMAILS.has(String(email || '').trim().toLowerCase());
}

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'SUPPORT',
  status: 'ACTIVE',
};

export default function PlatformUsersPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const usersTable = useTableQuery(users, {
    searchKeys: ['name', 'email', 'role', 'status'],
    getSortValue: (row, key) => {
      if (key === 'name') return (row.name || '').toLowerCase();
      if (key === 'email') return (row.email || '').toLowerCase();
      if (key === 'role') return row.role || '';
      if (key === 'status') return row.status || '';
      if (key === 'created') return row.created_at || '';
      return row[key];
    },
  });

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

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setOpen(true);
  };

  const openEdit = (user) => {
    setEditingId(user.id);
    const status = String(user.status || 'ACTIVE').toUpperCase();
    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'SUPPORT',
      status: status === 'SUSPENDED' ? 'INACTIVE' : status,
    });
    setError('');
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        const payload = {
          name: form.name,
          email: form.email,
          role: form.role,
          status: form.status,
        };
        if (form.password.trim()) payload.password = form.password.trim();
        await updatePlatformUser(editingId, payload);
      } else {
        await createPlatformUser(form);
      }
      setOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button type="button" className="mm-pa-btn mm-pa-btn--primary" onClick={openCreate}>
          <Plus size={15} /> Add Platform User
        </button>
      </div>

      <div className="mm-pa-panel overflow-x-auto">
        {error && !open && <div className="mm-pa-inline-toast mm-pa-inline-toast--error">{error}</div>}
        <p className="mb-4 text-sm text-slate-400">
          MentorMuni employees only. Separate from organization users. Roles: Platform Admin, Support, Sales, Operations.
        </p>
        {!loading ? (
          <TableToolbar
            variant="pa"
            query={usersTable.query}
            onQueryChange={usersTable.setQuery}
            placeholder="Search name, email, role…"
            count={usersTable.count}
            total={usersTable.total}
          />
        ) : null}
        <table className="mm-pa-table min-w-[760px]">
          <thead>
            <tr>
              <SortableTh label="Name" sortKey="name" sort={usersTable.sort} onSort={usersTable.toggleSort} />
              <SortableTh label="Email" sortKey="email" sort={usersTable.sort} onSort={usersTable.toggleSort} />
              <SortableTh label="Role" sortKey="role" sort={usersTable.sort} onSort={usersTable.toggleSort} />
              <SortableTh label="Status" sortKey="status" sort={usersTable.sort} onSort={usersTable.toggleSort} />
              <SortableTh label="Created" sortKey="created" sort={usersTable.sort} onSort={usersTable.toggleSort} />
              <th />
            </tr>
          </thead>
          <tbody>
            {(loading ? Array.from({ length: 5 }, (_, i) => ({ id: `loading-user-${i}` })) : usersTable.rows).map((u) => (
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
                        {u.status === 'SUSPENDED' ? 'INACTIVE' : u.status}
                      </span>
                    </td>
                    <td className="text-slate-400">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs"
                          onClick={() => openEdit(u)}
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        {!isProtectedPlatformAdmin(u.email) && (
                          <>
                            <button
                              type="button"
                              className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs"
                              onClick={async () => {
                                try {
                                  await updatePlatformUserStatus(
                                    u.id,
                                    u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                                  );
                                } catch (err) {
                                  setError(err.message || 'Failed to update platform user status.');
                                }
                              }}
                            >
                              {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              type="button"
                              className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs"
                              onClick={async () => {
                                if (!window.confirm(`Deactivate ${u.name || u.email}?`)) return;
                                try {
                                  await deletePlatformUser(u.id);
                                } catch (err) {
                                  setError(err.message || 'Failed to delete platform user.');
                                }
                              }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
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
        onClose={() => {
          setOpen(false);
          setEditingId(null);
        }}
        title={editingId ? 'Edit Platform User' : 'Add Platform User'}
        sub={
          editingId
            ? 'Updates platform employee via PUT /platform/users/:id.'
            : 'Creates a MentorMuni employee account for the platform portal.'
        }
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
          {editingId ? (
            <div>
              <label className="mm-pa-label">Status</label>
              <select className="mm-pa-select" value={form.status === 'SUSPENDED' ? 'INACTIVE' : form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          ) : null}
          <div>
            <label className="mm-pa-label">{editingId ? 'New password (optional)' : 'Password *'}</label>
            <input
              type="password"
              className="mm-pa-input"
              required={!editingId}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {editingId ? (
              <p className="mt-1 text-xs text-slate-500">
                Setting a password marks must_change_password on the next login.
              </p>
            ) : null}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="mm-pa-btn mm-pa-btn--ghost"
              onClick={() => {
                setOpen(false);
                setEditingId(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="mm-pa-btn mm-pa-btn--primary">
              {editingId ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
