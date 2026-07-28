import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Building2, UserPlus, CreditCard, ToggleLeft } from 'lucide-react';
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  assignSubscription,
  getSubscriptionForOrg,
  getOrgFeatures,
  saveOrgFeatures,
  createTpo,
  getFeatureCatalog,
  getSubscriptionPlans,
  PLANS,
} from '../store';
import Modal from '../Modal';

const emptyOrg = {
  name: '',
  code: '',
  organization_type: 'College',
  status: 'Active',
  contact_person: '',
  contact_email: '',
  contact_phone: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
};

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState([]);
  const [plans, setPlans] = useState(PLANS);
  const [featureCatalog, setFeatureCatalog] = useState([]);
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(emptyOrg);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selected, setSelected] = useState(null);
  const [subOpen, setSubOpen] = useState(false);
  const [featOpen, setFeatOpen] = useState(false);
  const [tpoOpen, setTpoOpen] = useState(false);
  const [subForm, setSubForm] = useState({
    plan_name: 'Enterprise',
    student_limit: 1500,
    start_date: '',
    end_date: '',
    status: 'ACTIVE',
  });
  const [featureMap, setFeatureMap] = useState({});
  const [tpoForm, setTpoForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    username: '',
  });
  const [activationInfo, setActivationInfo] = useState(null);
  const [subsByOrg, setSubsByOrg] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiToast, setApiToast] = useState('');

  const refresh = async () => {
    try {
      setLoading(true);
      const rows = await getOrganizations();
      setOrgs(rows);
      const subPairs = await Promise.all(
        rows.map(async (o) => [o.id, await getSubscriptionForOrg(o.id)])
      );
      setSubsByOrg(Object.fromEntries(subPairs));
      setApiToast('');
    } catch (e) {
      setApiToast(e.message || 'Failed to fetch organizations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const boot = async () => {
      try {
        const [plansResult, featureResult] = await Promise.all([
          getSubscriptionPlans().catch(() => PLANS),
          getFeatureCatalog().catch(() => []),
        ]);
        if (!mounted) return;
        setPlans(plansResult?.length ? plansResult : PLANS);
        setFeatureCatalog(featureResult || []);
        await refresh();
      } catch (e) {
        setError(e.message || 'Failed to load organizations.');
        setApiToast(e.message || 'Failed to load organizations.');
      }
    };
    boot();
    const onUpdate = async () => refresh();
    window.addEventListener('mm-platform-db-updated', onUpdate);
    return () => {
      mounted = false;
      window.removeEventListener('mm-platform-db-updated', onUpdate);
    };
  }, []);

  useEffect(() => {
    if (!apiToast) return undefined;
    const timer = window.setTimeout(() => setApiToast(''), 3500);
    return () => window.clearTimeout(timer);
  }, [apiToast]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orgs;
    return orgs.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.code.toLowerCase().includes(q) ||
        o.city?.toLowerCase().includes(q)
    );
  }, [orgs, query]);

  const openCreate = () => {
    setForm(emptyOrg);
    setError('');
    setSuccess('');
    setCreateOpen(true);
  };

  const submitOrg = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const row = await createOrganization(form);
      setSuccess(`Organization created · ID ${row.id} · Code ${row.code}`);
      setCreateOpen(false);
      setSelected(row);
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to create organization.');
      setApiToast(err.message || 'Failed to create organization.');
    }
  };

  const openSubscription = async (org) => {
    try {
      setSelected(org);
      const existing = await getSubscriptionForOrg(org.id);
      const plan = plans.find((p) => p.name === existing?.plan_name) || plans[0] || PLANS[0];
      setSubForm({
        plan_name: existing?.plan_name || plan.name,
        student_limit: existing?.student_limit || plan.defaultLimit,
        start_date: existing?.start_date || new Date().toISOString().slice(0, 10),
        end_date: existing?.end_date || `${new Date().getFullYear()}-12-31`,
        status: 'ACTIVE',
      });
      setError('');
      setSubOpen(true);
    } catch (err) {
      setApiToast(err.message || 'Failed to load subscription data.');
    }
  };

  const submitSub = async (e) => {
    e.preventDefault();
    try {
      await assignSubscription({ ...subForm, organization_id: selected.id });
      setSuccess(`Subscription assigned to ${selected.name}`);
      setSubOpen(false);
      await refresh();
    } catch (err) {
      setError(err.message);
      setApiToast(err.message || 'Failed to assign subscription.');
    }
  };

  const openFeatures = async (org) => {
    try {
      setSelected(org);
      const rows = await getOrgFeatures(org.id);
      const map = {};
      rows.forEach((r) => {
        map[r.feature_id ?? r.id] = r.enabled;
      });
      setFeatureMap(map);
      setFeatOpen(true);
    } catch (err) {
      setApiToast(err.message || 'Failed to load feature data.');
    }
  };

  const submitFeatures = async () => {
    try {
      await saveOrgFeatures(selected.id, featureMap);
      setSuccess(`Features updated for ${selected.name}`);
      setFeatOpen(false);
    } catch (err) {
      setApiToast(err.message || 'Failed to save features.');
    }
  };

  const openTpo = (org) => {
    setSelected(org);
    setTpoForm({
      first_name: '',
      last_name: '',
      email: org.contact_email || '',
      mobile: org.contact_phone || '',
      username: `${org.code.toLowerCase()}.tpo`,
    });
    setActivationInfo(null);
    setError('');
    setTpoOpen(true);
  };

  const submitTpo = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await createTpo(selected.id, tpoForm);
      setActivationInfo(user);
      setSuccess(`TPO profile created. Activation email queued for ${user.email}.`);
    } catch (err) {
      setError(err.message);
      setApiToast(err.message || 'Failed to create TPO.');
    }
  };

  const toggleStatus = async (org) => {
    try {
      await updateOrganization(org.id, {
        status: String(org.status || '').toUpperCase() === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
      });
      await refresh();
    } catch (err) {
      setApiToast(err.message || 'Failed to update organization status.');
    }
  };

  return (
    <div className="space-y-5">
      {success && <div className="mm-pa-success">{success}</div>}
      {apiToast && <div className="mm-pa-inline-toast mm-pa-inline-toast--error">{apiToast}</div>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="mm-pa-input pl-9"
            placeholder="Search by name, code, or city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="button" className="mm-pa-btn mm-pa-btn--primary" onClick={openCreate}>
          <Plus size={16} /> Create Organization
        </button>
      </div>

      <div className="mm-pa-panel overflow-x-auto">
        <table className="mm-pa-table min-w-[880px]">
          <thead>
            <tr>
              <th>Organization</th>
              <th>Type</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(loading ? Array.from({ length: 5 }, (_, i) => ({ id: `loading-org-${i}` })) : filtered).map((org) => {
              if (loading) {
                return (
                  <tr key={org.id}>
                    <td><div className="mm-pa-skeleton h-10 w-56" /></td>
                    <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                    <td><div className="mm-pa-skeleton h-10 w-44" /></td>
                    <td><div className="mm-pa-skeleton h-6 w-28" /></td>
                    <td><div className="mm-pa-skeleton h-6 w-24" /></td>
                    <td><div className="mm-pa-skeleton h-8 w-44" /></td>
                  </tr>
                );
              }
              const sub = subsByOrg[org.id];
              return (
                <tr key={org.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="mm-pa-table__avatar">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <p className="mm-pa-table__title">{org.name}</p>
                        <p className="mm-pa-table__meta">
                          {org.code} · ID {org.id}
                          {sub ? ` · ${sub.plan_name}` : ' · No plan'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="mm-pa-badge mm-pa-badge--neutral">{String(org.organization_type || '').toUpperCase()}</span>
                  </td>
                  <td>
                    <p className="mm-pa-table__title">{org.contact_person || '—'}</p>
                    <p className="mm-pa-table__meta">{org.contact_email || '—'}</p>
                  </td>
                  <td className="mm-pa-table__meta">
                    {[org.city, org.state].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td>
                    <button type="button" onClick={() => toggleStatus(org)}>
                      <span className={`mm-pa-badge ${String(org.status || '').toUpperCase() === 'ACTIVE' ? 'mm-pa-badge--active' : 'mm-pa-badge--suspended'}`}>
                        {String(org.status || '').toUpperCase()}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs" onClick={() => openSubscription(org)}>
                        <CreditCard size={13} /> Plan
                      </button>
                      <button type="button" className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs" onClick={() => openFeatures(org)}>
                        <ToggleLeft size={13} /> Features
                      </button>
                      <button type="button" className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs" onClick={() => openTpo(org)}>
                        <UserPlus size={13} /> TPO
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && !filtered.length && <div className="mm-pa-empty">No organizations found.</div>}
      </div>

      {/* Create Organization */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Organization"
        sub="Populates the organizations table and returns Organization ID + Code."
        wide
      >
        <form onSubmit={submitOrg} className="space-y-1">
          {error && <div className="mm-pa-error">{error}</div>}
          <p className="mm-pa-section-label">Basic Details</p>
          <div className="mm-pa-grid-2">
            <div>
              <label className="mm-pa-label">Organization Name *</label>
              <input className="mm-pa-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="mm-pa-label">Organization Code *</label>
              <input
                className="mm-pa-input uppercase"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="MEDICAPS"
              />
            </div>
            <div>
              <label className="mm-pa-label">Organization Type</label>
              <select className="mm-pa-select" value={form.organization_type} onChange={(e) => setForm({ ...form, organization_type: e.target.value })}>
                <option value="College">College</option>
                <option value="Public">Public (Individual Students)</option>
              </select>
            </div>
            <div>
              <label className="mm-pa-label">Status</label>
              <select className="mm-pa-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <p className="mm-pa-section-label">Contact Details</p>
          <div className="mm-pa-grid-3">
            <div>
              <label className="mm-pa-label">Contact Person</label>
              <input className="mm-pa-input" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
            </div>
            <div>
              <label className="mm-pa-label">Email</label>
              <input type="email" className="mm-pa-input" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
            </div>
            <div>
              <label className="mm-pa-label">Phone</label>
              <input className="mm-pa-input" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
            </div>
          </div>

          <p className="mm-pa-section-label">Address</p>
          <div className="mm-pa-grid-2">
            <div className="sm:col-span-2">
              <label className="mm-pa-label">Address</label>
              <input className="mm-pa-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <label className="mm-pa-label">City</label>
              <input className="mm-pa-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className="mm-pa-label">State</label>
              <input className="mm-pa-input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
            <div>
              <label className="mm-pa-label">Country</label>
              <input className="mm-pa-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={() => setCreateOpen(false)}>Cancel</button>
            <button type="submit" className="mm-pa-btn mm-pa-btn--primary">Save Organization</button>
          </div>
        </form>
      </Modal>

      {/* Assign Subscription */}
      <Modal
        open={subOpen}
        onClose={() => setSubOpen(false)}
        title="Assign Subscription"
        sub={selected ? `Plan for ${selected.name} (${selected.code})` : ''}
      >
        <form onSubmit={submitSub} className="space-y-3">
          <div className="mm-pa-grid-2">
            <div>
              <label className="mm-pa-label">Plan</label>
              <select
                className="mm-pa-select"
                value={subForm.plan_name}
                onChange={(e) => {
                  const plan = plans.find((p) => p.name === e.target.value);
                  setSubForm({
                    ...subForm,
                    plan_name: e.target.value,
                    student_limit: plan?.defaultLimit || subForm.student_limit,
                  });
                }}
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mm-pa-label">Seat Limit</label>
              <input
                type="number"
                min="1"
                className="mm-pa-input"
                required
                value={subForm.student_limit}
                onChange={(e) => setSubForm({ ...subForm, student_limit: e.target.value })}
              />
            </div>
            <div>
              <label className="mm-pa-label">Start Date</label>
              <input type="date" className="mm-pa-input" required value={subForm.start_date} onChange={(e) => setSubForm({ ...subForm, start_date: e.target.value })} />
            </div>
            <div>
              <label className="mm-pa-label">End Date</label>
              <input type="date" className="mm-pa-input" required value={subForm.end_date} onChange={(e) => setSubForm({ ...subForm, end_date: e.target.value })} />
            </div>
            <div>
              <label className="mm-pa-label">Status</label>
              <select className="mm-pa-select" value={subForm.status} onChange={(e) => setSubForm({ ...subForm, status: e.target.value })}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={() => setSubOpen(false)}>Cancel</button>
            <button type="submit" className="mm-pa-btn mm-pa-btn--primary">Assign Subscription</button>
          </div>
        </form>
      </Modal>

      {/* Features */}
      <Modal
        open={featOpen}
        onClose={() => setFeatOpen(false)}
        title="Feature Management"
        sub={selected ? `Enable capabilities for ${selected.name}` : ''}
      >
        <div className="space-y-2">
          {featureCatalog.map((feature) => (
            <div key={feature.id} className="mm-pa-feature-row">
              <div>
                <p className="text-sm font-bold text-slate-100">{feature.feature_name}</p>
                <p className="text-[11px] text-slate-500">{feature.feature_code} · {feature.category}</p>
              </div>
              <button
                type="button"
                className={`mm-pa-toggle ${featureMap[feature.id] ? 'mm-pa-toggle--on' : ''}`}
                aria-pressed={Boolean(featureMap[feature.id])}
                onClick={() => setFeatureMap((m) => ({ ...m, [feature.id]: !m[feature.id] }))}
              >
                <span className="mm-pa-toggle__knob" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={() => setFeatOpen(false)}>Cancel</button>
          <button type="button" className="mm-pa-btn mm-pa-btn--primary" onClick={submitFeatures}>Save Features</button>
        </div>
      </Modal>

      {/* Create TPO */}
      <Modal
        open={tpoOpen}
        onClose={() => setTpoOpen(false)}
        title="Create TPO (ORG_ADMIN)"
        sub={selected ? `First organization admin for ${selected.name}` : ''}
      >
        {!activationInfo ? (
          <form onSubmit={submitTpo} className="space-y-3">
            {error && <div className="mm-pa-error">{error}</div>}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-3 text-xs text-amber-100">
              No temporary password. Backend generates a one-time activation token and emails the TPO to set their own password.
            </div>
            <div className="mm-pa-grid-2">
              <div>
                <label className="mm-pa-label">First Name *</label>
                <input className="mm-pa-input" required value={tpoForm.first_name} onChange={(e) => setTpoForm({ ...tpoForm, first_name: e.target.value })} />
              </div>
              <div>
                <label className="mm-pa-label">Last Name *</label>
                <input className="mm-pa-input" required value={tpoForm.last_name} onChange={(e) => setTpoForm({ ...tpoForm, last_name: e.target.value })} />
              </div>
              <div>
                <label className="mm-pa-label">Email *</label>
                <input type="email" className="mm-pa-input" required value={tpoForm.email} onChange={(e) => setTpoForm({ ...tpoForm, email: e.target.value })} />
              </div>
              <div>
                <label className="mm-pa-label">Mobile</label>
                <input className="mm-pa-input" value={tpoForm.mobile} onChange={(e) => setTpoForm({ ...tpoForm, mobile: e.target.value })} />
              </div>
              <div>
                <label className="mm-pa-label">Username *</label>
                <input className="mm-pa-input" required value={tpoForm.username} onChange={(e) => setTpoForm({ ...tpoForm, username: e.target.value })} />
              </div>
              <div>
                <label className="mm-pa-label">Role</label>
                <input className="mm-pa-input" value="ORG_ADMIN" disabled />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={() => setTpoOpen(false)}>Cancel</button>
              <button type="submit" className="mm-pa-btn mm-pa-btn--primary">Create & Send Activation</button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="mm-pa-success">
              TPO created. Activation token generated. Credentials are not shared — TPO sets password on first login.
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
              <p><span className="text-slate-500">User:</span> {activationInfo.first_name} {activationInfo.last_name}</p>
              <p className="mt-1"><span className="text-slate-500">Email:</span> {activationInfo.email}</p>
              <p className="mt-1"><span className="text-slate-500">Username:</span> {activationInfo.username}</p>
              <p className="mt-1"><span className="text-slate-500">Role:</span> ORG_ADMIN</p>
              <p className="mt-1 break-all"><span className="text-slate-500">Activation token:</span> {activationInfo.activation_token}</p>
              <p className="mt-1"><span className="text-slate-500">Status:</span> {activationInfo.activation_status}</p>
            </div>
            <div className="flex justify-end">
              <button type="button" className="mm-pa-btn mm-pa-btn--primary" onClick={() => setTpoOpen(false)}>Done</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
