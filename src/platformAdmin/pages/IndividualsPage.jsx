import { useCallback, useEffect, useState } from 'react';
import { Copy, Mail, Plus, RefreshCw, Ban } from 'lucide-react';
import {
  getIndividuals,
  createIndividual,
  reinviteIndividual,
  blockIndividual,
} from '../store';
import Modal from '../Modal';

const emptyForm = {
  first_name: '',
  last_name: '',
  email: '',
  mobile: '',
  username: '',
  college_name: '',
  course_or_branch: '',
  batch_year: '',
  roll_number: '',
};

export default function IndividualsPage() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [inviteResult, setInviteResult] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getIndividuals({ q: query });
      setRows(data.items || []);
      setTotal(data.total || 0);
      setError('');
    } catch (e) {
      setError(e.message || 'Failed to load individuals.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    refresh().catch(() => {});
    window.addEventListener('mm-platform-db-updated', refresh);
    return () => window.removeEventListener('mm-platform-db-updated', refresh);
  }, [refresh]);

  useEffect(() => {
    if (!error) return undefined;
    const timer = window.setTimeout(() => setError(''), 4000);
    return () => window.clearTimeout(timer);
  }, [error]);

  const openCreate = () => {
    setForm(emptyForm);
    setInviteResult(null);
    setError('');
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim() || null,
        username: form.username.trim() || null,
        college_name: form.college_name.trim() || null,
        course_or_branch: form.course_or_branch.trim() || null,
        roll_number: form.roll_number.trim() || null,
        batch_year: form.batch_year ? Number(form.batch_year) : null,
      };
      const result = await createIndividual(payload);
      setInviteResult(result);
      setOpen(false);
      setForm(emptyForm);
      await refresh();
    } catch (err) {
      setError(err.message || 'Could not create individual.');
    }
  };

  const onReinvite = async (id) => {
    const row = rows.find((r) => r.id === id);
    if (row?.status === 'ACTIVE') {
      const ok = window.confirm(
        'This student is already active. Reinvite will clear their current password and force them to set a new one. Continue?'
      );
      if (!ok) return;
    }
    setBusyId(id);
    setError('');
    try {
      const result = await reinviteIndividual(id);
      setInviteResult(result);
      await refresh();
    } catch (err) {
      setError(err.message || 'Reinvite failed.');
    } finally {
      setBusyId(null);
    }
  };

  const onBlock = async (id) => {
    if (!window.confirm('Block this individual student? They will not be able to log in.')) return;
    setBusyId(id);
    setError('');
    try {
      await blockIndividual(id);
      await refresh();
    } catch (err) {
      setError(err.message || 'Block failed.');
    } finally {
      setBusyId(null);
    }
  };

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url || '');
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400 max-w-xl">
          MentorMuni staff only. Create an individual student account, capture personal / college
          details, and email a set-password link. No TPO, HOD, or campus roster. Payment / website
          checkout comes later.
        </p>
        <button type="button" className="mm-pa-btn mm-pa-btn--primary" onClick={openCreate}>
          <Plus size={15} /> Invite Individual
        </button>
      </div>

      {inviteResult ? (
        <div className="mm-pa-panel space-y-2 border border-emerald-500/30">
          <p className="text-sm text-emerald-300">{inviteResult.message}</p>
          {inviteResult.activation_url ? (
            <div className="flex flex-wrap items-center gap-2">
              <code className="text-xs text-slate-300 break-all flex-1">
                {inviteResult.activation_url}
              </code>
              <button
                type="button"
                className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs"
                onClick={() => copyLink(inviteResult.activation_url)}
              >
                <Copy size={14} /> Copy link
              </button>
            </div>
          ) : null}
          {inviteResult.email_detail && !inviteResult.email_sent ? (
            <p className="text-xs text-amber-300">{inviteResult.email_detail}</p>
          ) : null}
          <button
            type="button"
            className="mm-pa-btn mm-pa-btn--ghost !px-2 !py-1 text-xs"
            onClick={() => setInviteResult(null)}
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <input
          className="mm-pa-input max-w-xs"
          placeholder="Search name, email, college…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') refresh();
          }}
        />
        <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={refresh}>
          <RefreshCw size={14} /> Search
        </button>
      </div>

      <div className="mm-pa-panel overflow-x-auto">
        {error && !open ? (
          <div className="mm-pa-inline-toast mm-pa-inline-toast--error">{error}</div>
        ) : null}
        <p className="mb-3 text-xs text-slate-500">{total} individual student(s)</p>
        <table className="mm-pa-table min-w-[900px]">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email / Username</th>
              <th>College / Course</th>
              <th>Status</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(loading
              ? Array.from({ length: 4 }, (_, i) => ({ id: `loading-${i}` }))
              : rows
            ).map((row) => (
              <tr key={row.id}>
                {loading ? (
                  <>
                    <td><div className="mm-pa-skeleton h-5 w-32" /></td>
                    <td><div className="mm-pa-skeleton h-5 w-48" /></td>
                    <td><div className="mm-pa-skeleton h-5 w-40" /></td>
                    <td><div className="mm-pa-skeleton h-6 w-20" /></td>
                    <td><div className="mm-pa-skeleton h-5 w-24" /></td>
                    <td><div className="mm-pa-skeleton h-8 w-28" /></td>
                  </>
                ) : (
                  <>
                    <td className="mm-pa-table__title">
                      {row.first_name} {row.last_name}
                    </td>
                    <td className="mm-pa-table__meta">
                      <div>{row.email}</div>
                      <div className="text-xs text-slate-500">{row.username}</div>
                    </td>
                    <td className="mm-pa-table__meta">
                      <div>{row.college_name || '—'}</div>
                      <div className="text-xs text-slate-500">
                        {[row.course_or_branch, row.batch_year].filter(Boolean).join(' · ') || '—'}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`mm-pa-badge ${
                          row.status === 'ACTIVE'
                            ? 'mm-pa-badge--active'
                            : row.status === 'INVITED'
                              ? 'mm-pa-badge--neutral'
                              : 'mm-pa-badge--suspended'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="text-slate-400">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleDateString('en-IN')
                        : '—'}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs"
                          disabled={busyId === row.id || row.status === 'BLOCKED'}
                          onClick={() => onReinvite(row.id)}
                        >
                          <Mail size={13} /> Reinvite
                        </button>
                        {row.status !== 'BLOCKED' ? (
                          <button
                            type="button"
                            className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs"
                            disabled={busyId === row.id}
                            onClick={() => onBlock(row.id)}
                          >
                            <Ban size={13} /> Block
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {!loading && rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-slate-500 py-8 text-center">
                  No individual students yet. Invite one to get started.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Invite individual student"
        sub="They get an email to set password and open the Student Portal."
      >
        <form className="space-y-4" onSubmit={submit}>
          {error ? <div className="mm-pa-inline-toast mm-pa-inline-toast--error">{error}</div> : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="mm-pa-field">
              <span>First name</span>
              <input
                className="mm-pa-input"
                required
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />
            </label>
            <label className="mm-pa-field">
              <span>Last name</span>
              <input
                className="mm-pa-input"
                required
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />
            </label>
          </div>
          <label className="mm-pa-field">
            <span>Email</span>
            <input
              className="mm-pa-input"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="mm-pa-field">
              <span>Mobile (optional)</span>
              <input
                className="mm-pa-input"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
            </label>
            <label className="mm-pa-field">
              <span>Username (optional)</span>
              <input
                className="mm-pa-input"
                placeholder="Defaults from email"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </label>
          </div>
          <div className="border-t border-slate-700/50 pt-3">
            <p className="text-xs text-slate-500 mb-2">College details (optional — not a tenant)</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="mm-pa-field sm:col-span-2">
                <span>College name</span>
                <input
                  className="mm-pa-input"
                  value={form.college_name}
                  onChange={(e) => setForm({ ...form, college_name: e.target.value })}
                />
              </label>
              <label className="mm-pa-field">
                <span>Course / branch</span>
                <input
                  className="mm-pa-input"
                  value={form.course_or_branch}
                  onChange={(e) => setForm({ ...form, course_or_branch: e.target.value })}
                />
              </label>
              <label className="mm-pa-field">
                <span>Batch year</span>
                <input
                  className="mm-pa-input"
                  type="number"
                  min={1990}
                  max={2100}
                  value={form.batch_year}
                  onChange={(e) => setForm({ ...form, batch_year: e.target.value })}
                />
              </label>
              <label className="mm-pa-field">
                <span>Roll number</span>
                <input
                  className="mm-pa-input"
                  value={form.roll_number}
                  onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
                />
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="mm-pa-btn mm-pa-btn--primary">
              <Mail size={14} /> Create &amp; send invite
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
