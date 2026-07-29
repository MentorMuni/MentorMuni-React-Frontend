import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Building2, UserPlus, UserCheck, CreditCard, ToggleLeft } from 'lucide-react';
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  assignSubscription,
  getSubscriptionForOrg,
  getOrgFeatures,
  saveOrgFeatures,
  createTpo,
  updateTpo,
  getOrganizationTpo,
  getOrgAdmins,
  reinviteTpo,
  getFeatureCatalog,
  getSubscriptionPlans,
  PLANS,
  statusLabel,
  isActiveStatus,
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
  const [tpoMode, setTpoMode] = useState('create'); // create | view | edit
  const [tpoLoading, setTpoLoading] = useState(false);
  const [tpoBusy, setTpoBusy] = useState(false);
  const [tpoJustCreated, setTpoJustCreated] = useState(false);
  const [subsByOrg, setSubsByOrg] = useState({});
  const [tpoByOrg, setTpoByOrg] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiToast, setApiToast] = useState('');

  const fillTpoForm = (tpo, org) => ({
    first_name: tpo?.first_name || '',
    last_name: tpo?.last_name || '',
    email: tpo?.email || org?.contact_email || '',
    mobile: tpo?.mobile || org?.contact_phone || '',
    username: tpo?.username || `${String(org?.code || '').toLowerCase()}.tpo`,
  });

  const closeTpoModal = () => {
    setTpoOpen(false);
    setError('');
    setTpoMode('create');
    setTpoJustCreated(false);
    // Keep tpoByOrg intact so View TPO stays View TPO after close/cancel.
  };

  const refresh = async () => {
    try {
      setLoading(true);
      const [rows, tpos] = await Promise.all([
        getOrganizations(),
        getOrgAdmins().catch(() => []),
      ]);
      setOrgs(rows);
      setTpoByOrg(
        Object.fromEntries(
          (tpos || [])
            .filter((t) => t?.organization_id != null)
            .map((t) => [String(t.organization_id), t])
        )
      );
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

  const openTpo = async (org) => {
    const orgKey = String(org.id);
    const known = tpoByOrg[orgKey] || null;
    setSelected(org);
    setError('');
    setTpoJustCreated(false);
    setTpoOpen(true);

    if (known) {
      setActivationInfo(known);
      setTpoForm(fillTpoForm(known, org));
      setTpoMode('view');
      setTpoLoading(true);
    } else {
      setActivationInfo(null);
      setTpoForm(fillTpoForm(null, org));
      setTpoMode('create');
      setTpoLoading(true);
    }

    try {
      const existing = await getOrganizationTpo(org.id);
      if (existing) {
        setActivationInfo(existing);
        setTpoForm(fillTpoForm(existing, org));
        setTpoMode('view');
        setTpoByOrg((prev) => ({ ...prev, [orgKey]: existing }));
      } else if (known) {
        // List API said TPO exists; keep view mode even if detail GET is empty/404.
        setActivationInfo(known);
        setTpoForm(fillTpoForm(known, org));
        setTpoMode('view');
      } else {
        setActivationInfo(null);
        setTpoForm(fillTpoForm(null, org));
        setTpoMode('create');
      }
    } catch (err) {
      if (known) {
        setActivationInfo(known);
        setTpoForm(fillTpoForm(known, org));
        setTpoMode('view');
      } else {
        setError(err.message || 'Failed to load TPO for this organization.');
      }
    } finally {
      setTpoLoading(false);
    }
  };

  const startEditTpo = () => {
    if (!activationInfo) return;
    setError('');
    setTpoForm(fillTpoForm(activationInfo, selected));
    setTpoMode('edit');
  };

  const cancelEditTpo = () => {
    setError('');
    setTpoForm(fillTpoForm(activationInfo, selected));
    setTpoMode('view');
  };

  const submitTpo = async (e) => {
    e.preventDefault();
    const orgKey = String(selected?.id);
    if (tpoByOrg[orgKey] || activationInfo) {
      setError('This organization already has an ORG_ADMIN (TPO). Open View TPO to manage it.');
      setTpoMode('view');
      return;
    }
    setError('');
    setTpoBusy(true);
    try {
      const user = await createTpo(selected.id, tpoForm);
      setActivationInfo(user);
      setTpoJustCreated(true);
      setTpoMode('view');
      setTpoByOrg((prev) => ({ ...prev, [orgKey]: user }));
      setSuccess(`TPO profile created. Activation email queued for ${user.email}.`);
    } catch (err) {
      const message = err.message || 'Failed to create TPO.';
      setError(message);
      setApiToast(message);
      if (/already has an ORG_ADMIN/i.test(message)) {
        try {
          const existing = await getOrganizationTpo(selected.id);
          if (existing) {
            setActivationInfo(existing);
            setTpoForm(fillTpoForm(existing, selected));
            setTpoJustCreated(false);
            setTpoMode('view');
            setTpoByOrg((prev) => ({ ...prev, [orgKey]: existing }));
          }
        } catch {
          // keep create error visible
        }
      }
    } finally {
      setTpoBusy(false);
    }
  };

  const submitEditTpo = async (e) => {
    e.preventDefault();
    if (!selected) return;
    const orgKey = String(selected.id);
    setError('');
    setTpoBusy(true);
    try {
      const user = await updateTpo(selected.id, {
        first_name: tpoForm.first_name,
        last_name: tpoForm.last_name,
        email: tpoForm.email,
        mobile: tpoForm.mobile,
        username: tpoForm.username,
      });
      setActivationInfo(user);
      setTpoByOrg((prev) => ({ ...prev, [orgKey]: user }));
      setTpoMode('view');
      setSuccess(`TPO details updated for ${user.email || selected.name}.`);
    } catch (err) {
      setError(err.message || 'Failed to update TPO.');
    } finally {
      setTpoBusy(false);
    }
  };

  const submitReinvite = async () => {
    if (!selected) return;
    const orgKey = String(selected.id);
    setError('');
    setTpoBusy(true);
    try {
      const user = await reinviteTpo(selected.id);
      const merged = {
        ...(activationInfo || {}),
        ...user,
        email: user.email || activationInfo?.email,
        username: user.username || activationInfo?.username,
        first_name: user.first_name || activationInfo?.first_name,
        last_name: user.last_name || activationInfo?.last_name,
      };
      setActivationInfo(merged);
      setTpoJustCreated(false);
      setTpoMode('view');
      setTpoByOrg((prev) => ({ ...prev, [orgKey]: merged }));
      setSuccess(`Fresh activation link queued for ${merged.email || selected.name}.`);
    } catch (err) {
      const message = err.message || 'Failed to reinvite TPO.';
      setError(message);
      setApiToast(message);
    } finally {
      setTpoBusy(false);
    }
  };

  const toggleStatus = async (org) => {
    try {
      await updateOrganization(org.id, {
        status: isActiveStatus(org.status) ? 'INACTIVE' : 'ACTIVE',
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
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="mm-pa-input mm-pa-input--icon-left"
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
              const hasTpo = Boolean(tpoByOrg[String(org.id)]);
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
                          {hasTpo ? ' · TPO assigned' : ''}
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
                      <span className={`mm-pa-badge ${isActiveStatus(org.status) ? 'mm-pa-badge--active' : 'mm-pa-badge--suspended'}`}>
                        {statusLabel(org.status)}
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
                      <button
                        type="button"
                        className={`mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs ${hasTpo ? 'mm-pa-btn--tpo-assigned' : ''}`}
                        onClick={() => openTpo(org)}
                        title={hasTpo ? 'View existing TPO / reinvite' : 'Create TPO'}
                      >
                        {hasTpo ? <UserCheck size={13} /> : <UserPlus size={13} />}
                        {hasTpo ? 'View TPO' : 'Add TPO'}
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
                <option value="Inactive">Inactive</option>
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
                <p className="mm-pa-feature-row__title">{feature.feature_name}</p>
                <p className="mm-pa-feature-row__meta">{feature.feature_code} · {feature.category}</p>
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

      {/* Create / view / edit TPO */}
      <Modal
        open={tpoOpen}
        onClose={closeTpoModal}
        title={
          tpoMode === 'view'
            ? 'View TPO'
            : tpoMode === 'edit'
              ? 'Edit TPO'
              : 'Add TPO (ORG_ADMIN)'
        }
        sub={
          selected
            ? tpoMode === 'create'
              ? `First organization admin for ${selected.name}`
              : `ORG_ADMIN for ${selected.name}`
            : ''
        }
      >
        {tpoLoading ? (
          <div className="space-y-3 py-2">
            <div className="mm-pa-skeleton h-10 w-full" />
            <div className="mm-pa-skeleton h-24 w-full" />
            <div className="mm-pa-skeleton ml-auto h-10 w-40" />
          </div>
        ) : tpoMode === 'create' ? (
          <form onSubmit={submitTpo} className="space-y-3">
            {error && <div className="mm-pa-error">{error}</div>}
            <div className="mm-pa-callout mm-pa-callout--amber">
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
              <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={closeTpoModal}>Cancel</button>
              <button type="submit" className="mm-pa-btn mm-pa-btn--primary" disabled={tpoBusy}>
                {tpoBusy ? 'Creating…' : 'Create & Send Activation'}
              </button>
            </div>
          </form>
        ) : tpoMode === 'edit' ? (
          <form onSubmit={submitEditTpo} className="space-y-3">
            {error && <div className="mm-pa-error">{error}</div>}
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
                <label className="mm-pa-label">Username</label>
                <input className="mm-pa-input" value={tpoForm.username} disabled />
              </div>
              <div>
                <label className="mm-pa-label">Role</label>
                <input className="mm-pa-input" value="ORG_ADMIN" disabled />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={cancelEditTpo}>Cancel</button>
              <button type="submit" className="mm-pa-btn mm-pa-btn--primary" disabled={tpoBusy}>
                {tpoBusy ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {error && <div className="mm-pa-error">{error}</div>}
            {tpoJustCreated && (
              <div className="mm-pa-success">
                TPO created. Activation token generated. Credentials are not shared — TPO sets password on first login.
              </div>
            )}
            <div className="mm-pa-detail-card">
              <p><span className="mm-pa-detail-card__label">User:</span> {[activationInfo?.first_name, activationInfo?.last_name].filter(Boolean).join(' ') || '—'}</p>
              <p className="mt-1"><span className="mm-pa-detail-card__label">Email:</span> {activationInfo?.email || '—'}</p>
              <p className="mt-1"><span className="mm-pa-detail-card__label">Username:</span> {activationInfo?.username || '—'}</p>
              <p className="mt-1"><span className="mm-pa-detail-card__label">Mobile:</span> {activationInfo?.mobile || '—'}</p>
              <p className="mt-1"><span className="mm-pa-detail-card__label">Role:</span> ORG_ADMIN</p>
              {activationInfo?.activation_token ? (
                <p className="mt-1 break-all"><span className="mm-pa-detail-card__label">Activation token:</span> {activationInfo.activation_token}</p>
              ) : null}
              <p className="mt-1">
                <span className="mm-pa-detail-card__label">Status:</span>{' '}
                <span className={`mm-pa-badge ${
                  activationInfo?.activation_status === 'PENDING' || activationInfo?.activation_status === 'INVITED'
                    ? 'mm-pa-badge--pending'
                    : 'mm-pa-badge--active'
                }`}>
                  {activationInfo?.activation_status || 'ACTIVE'}
                </span>
              </p>
            </div>
            <div className="mm-pa-callout mm-pa-callout--amber">
              One ORG_ADMIN per organization. Use Edit to update details, or Reinvite to send a fresh activation link.
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={closeTpoModal}>Close</button>
              <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={startEditTpo}>Edit</button>
              <button type="button" className="mm-pa-btn mm-pa-btn--primary" onClick={submitReinvite} disabled={tpoBusy}>
                {tpoBusy ? 'Sending…' : 'Reinvite'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
