import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Building2,
  UserPlus,
  UserCheck,
  CreditCard,
  ToggleLeft,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  assignSubscription,
  cancelSubscription,
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

function orgToForm(org) {
  if (!org) return emptyOrg;
  return {
    name: org.name || '',
    code: org.code || '',
    organization_type: org.organization_type || 'College',
    status: isActiveStatus(org.status) ? 'Active' : 'Inactive',
    contact_person: org.contact_person || '',
    contact_email: org.contact_email || '',
    contact_phone: org.contact_phone || '',
    address: org.address || '',
    city: org.city || '',
    state: org.state || '',
    country: org.country || 'India',
  };
}

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState([]);
  const [plans, setPlans] = useState([]);
  const [featureCatalog, setFeatureCatalog] = useState([]);
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editingOrgId, setEditingOrgId] = useState(null);
  const [form, setForm] = useState(emptyOrg);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selected, setSelected] = useState(null);
  const [subOpen, setSubOpen] = useState(false);
  const [activeSubId, setActiveSubId] = useState(null);
  const [featOpen, setFeatOpen] = useState(false);
  const [tpoOpen, setTpoOpen] = useState(false);
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [statusBusy, setStatusBusy] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [subForm, setSubForm] = useState({
    plan_id: '',
    plan_code: '',
    plan_name: '',
    student_limit: 100,
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
  const [resetPasswordOnEdit, setResetPasswordOnEdit] = useState(true);
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

  const tpoActivationLink = (info) => {
    if (!info) return '';
    if (info.activation_url) return info.activation_url;
    if (!info.activation_token || typeof window === 'undefined') return '';
    return `${window.location.origin}/activate-tpo?token=${encodeURIComponent(info.activation_token)}`;
  };

  const copyText = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setSuccess('Copied to clipboard.');
    } catch {
      setApiToast('Unable to copy. Select and copy manually.');
    }
  };

  const tpoEmailBanner = (info) => {
    if (!info) return null;
    if (info.email_sent === true) {
      return (
        <div className="mm-pa-success">
          {info.message || 'Activation email sent. TPO can open the link and set their password.'}
        </div>
      );
    }
    if (info.email_skipped) {
      return (
        <div className="mm-pa-callout mm-pa-callout--amber">
          Email skipped (disabled in environment). Share the activation link manually below.
          {info.email_detail ? ` ${info.email_detail}` : ''}
        </div>
      );
    }
    if (info.email_sent === false) {
      return (
        <div className="mm-pa-callout mm-pa-callout--amber">
          Email failed{info.email_detail ? `: ${info.email_detail}` : '.'} Share the activation link or token manually.
        </div>
      );
    }
    if (tpoJustCreated || info.activation_token) {
      return (
        <div className="mm-pa-success">
          {info.message || 'TPO saved. If email was sent, they can activate from the invite link.'}
        </div>
      );
    }
    return null;
  };

  const closeTpoModal = () => {
    setTpoOpen(false);
    setError('');
    setTpoMode('create');
    setTpoJustCreated(false);
    setResetPasswordOnEdit(true);
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
          getSubscriptionPlans().catch((e) => {
            setApiToast(e.message || 'Failed to load subscription plans.');
            return [];
          }),
          getFeatureCatalog().catch(() => []),
        ]);
        if (!mounted) return;
        setPlans(plansResult || []);
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
    setEditingOrgId(null);
    setForm(emptyOrg);
    setError('');
    setSuccess('');
    setCreateOpen(true);
  };

  const openEditOrg = (org) => {
    setEditingOrgId(org.id);
    setForm(orgToForm(org));
    setError('');
    setSuccess('');
    setCreateOpen(true);
  };

  const submitOrg = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingOrgId) {
        const row = await updateOrganization(editingOrgId, form);
        setSuccess(`Organization updated · ${row.name} (${row.code})`);
      } else {
        const row = await createOrganization(form);
        setSuccess(`Organization created · ID ${row.id} · Code ${row.code}`);
        setSelected(row);
      }
      setCreateOpen(false);
      setEditingOrgId(null);
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to save organization.');
      setApiToast(err.message || 'Failed to save organization.');
    }
  };

  const openSubscription = async (org) => {
    try {
      if (!plans.length) {
        setApiToast('Subscription plans are unavailable. Reload or check the plans API.');
        return;
      }
      setSelected(org);
      const existing = await getSubscriptionForOrg(org.id);
      setActiveSubId(existing?.id || null);
      const plan =
        plans.find((p) => Number(p.id) === Number(existing?.plan_id)) ||
        plans.find(
          (p) =>
            p.plan_code &&
            p.plan_code === String(existing?.plan_code || '').toUpperCase()
        ) ||
        plans.find((p) => p.name === existing?.plan_name) ||
        plans[0];
      setSubForm({
        plan_id: plan.id,
        plan_code: plan.plan_code || '',
        plan_name: plan.name,
        student_limit: existing?.student_limit || plan.defaultLimit,
        start_date: existing?.start_date || new Date().toISOString().slice(0, 10),
        end_date: existing?.end_date || `${new Date().getFullYear()}-12-31`,
        status: existing?.status || 'ACTIVE',
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
      if (!plans.length) {
        throw new Error('No subscription plans available from the API.');
      }
      await assignSubscription({
        ...subForm,
        organization_id: selected.id,
        ...(activeSubId ? { subscription_id: activeSubId } : {}),
      });
      setSuccess(
        activeSubId
          ? `Subscription renewed for ${selected.name}`
          : `Subscription assigned to ${selected.name}`
      );
      setSubOpen(false);
      setActiveSubId(null);
      await refresh();
    } catch (err) {
      setError(err.message);
      setApiToast(err.message || 'Failed to save subscription.');
    }
  };

  const onCancelSubscription = async () => {
    if (!activeSubId || !selected) return;
    try {
      await cancelSubscription(activeSubId, 'CANCELLED');
      setSuccess(`Subscription cancelled for ${selected.name}`);
      setSubOpen(false);
      setActiveSubId(null);
      await refresh();
    } catch (err) {
      setApiToast(err.message || 'Failed to cancel subscription.');
    }
  };

  const openDeleteOrg = (org) => {
    const type = String(org.organization_type || '').toUpperCase();
    if (type === 'PUBLIC' || org.organization_type === 'Public') {
      setApiToast('PUBLIC organizations cannot be deleted. Suspend via status instead.');
      return;
    }
    setDeleteTarget(org);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteOrg = async () => {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    try {
      await deleteOrganization(deleteTarget.id);
      setSuccess(
        `${deleteTarget.name} soft-deleted (SUSPENDED). Active subscriptions were cancelled.`
      );
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
      await refresh();
    } catch (err) {
      setApiToast(err.message || 'Failed to soft-delete organization.');
    } finally {
      setDeleteBusy(false);
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
    setResetPasswordOnEdit(true);
    setTpoMode('edit');
  };

  const cancelEditTpo = () => {
    setError('');
    setTpoForm(fillTpoForm(activationInfo, selected));
    setResetPasswordOnEdit(true);
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
      if (user.email_sent === true) {
        setSuccess(`Activation email sent to ${user.email}.`);
      } else if (user.email_sent === false || user.email_skipped) {
        setSuccess(`TPO created for ${user.email}. Share the activation link manually.`);
      } else {
        setSuccess(user.message || `TPO profile created for ${user.email}.`);
      }
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
        ...(resetPasswordOnEdit
          ? { reset_password: true, activation_hours: 72 }
          : { reset_password: false }),
      });
      setActivationInfo(user);
      setTpoByOrg((prev) => ({ ...prev, [orgKey]: user }));
      setTpoJustCreated(Boolean(resetPasswordOnEdit));
      setTpoMode('view');
      if (resetPasswordOnEdit) {
        if (user.email_sent === true) {
          setSuccess(`TPO updated. Old password cleared. Activation email sent to ${user.email}.`);
        } else if (user.email_sent === false || user.email_skipped) {
          setSuccess('TPO updated. Old password cleared. Share the activation link manually.');
        } else {
          setSuccess(user.message || `TPO updated for ${user.email || selected.name}. Password reset — new person must activate.`);
        }
      } else {
        setSuccess(`TPO details updated for ${user.email || selected.name}. Password unchanged.`);
      }
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
      setTpoJustCreated(true);
      setTpoMode('view');
      setTpoByOrg((prev) => ({ ...prev, [orgKey]: merged }));
      if (merged.email_sent === true) {
        setSuccess(`Fresh activation email sent to ${merged.email || selected.name}.`);
      } else if (merged.email_sent === false || merged.email_skipped) {
        setSuccess('Reinvite created. Share the activation link manually.');
      } else {
        setSuccess(`Fresh activation link queued for ${merged.email || selected.name}.`);
      }
    } catch (err) {
      const message = err.message || 'Failed to reinvite TPO.';
      setError(message);
      setApiToast(message);
    } finally {
      setTpoBusy(false);
    }
  };

  const openStatusConfirm = (org) => {
    setStatusTarget(org);
    setStatusConfirmOpen(true);
  };

  const closeStatusConfirm = () => {
    if (statusBusy) return;
    setStatusConfirmOpen(false);
    setStatusTarget(null);
  };

  const confirmStatusChange = async () => {
    if (!statusTarget) return;
    const makingInactive = isActiveStatus(statusTarget.status);
    setStatusBusy(true);
    try {
      await updateOrganization(statusTarget.id, {
        status: makingInactive ? 'INACTIVE' : 'ACTIVE',
      });
      setSuccess(
        makingInactive
          ? `${statusTarget.name} is now SUSPENDED. TPO/HOD/students cannot log in, existing sessions fail on the next API call, and college registration is blocked.`
          : `${statusTarget.name} is now ACTIVE. Organization portal access and registration are restored.`
      );
      setStatusConfirmOpen(false);
      setStatusTarget(null);
      await refresh();
    } catch (err) {
      setApiToast(err.message || 'Failed to update organization status.');
    } finally {
      setStatusBusy(false);
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
                    <button type="button" onClick={() => openStatusConfirm(org)} title="Change organization status">
                      <span className={`mm-pa-badge ${isActiveStatus(org.status) ? 'mm-pa-badge--active' : 'mm-pa-badge--suspended'}`}>
                        {statusLabel(org.status)}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs"
                        onClick={() => openEditOrg(org)}
                        title="Edit organization"
                      >
                        <Pencil size={13} /> Edit
                      </button>
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
                      <button
                        type="button"
                        className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs"
                        onClick={() => openDeleteOrg(org)}
                        title="Delete organization"
                      >
                        <Trash2 size={13} />
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

      {/* Create / Edit Organization */}
      <Modal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setEditingOrgId(null);
        }}
        title={editingOrgId ? 'Edit Organization' : 'Create Organization'}
        sub={
          editingOrgId
            ? 'Updates organization profile fields via PUT /platform/organizations/:id.'
            : 'Populates the organizations table and returns Organization ID + Code.'
        }
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
                disabled={Boolean(editingOrgId)}
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
            <button
              type="button"
              className="mm-pa-btn mm-pa-btn--ghost"
              onClick={() => {
                setCreateOpen(false);
                setEditingOrgId(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="mm-pa-btn mm-pa-btn--primary">
              {editingOrgId ? 'Save Changes' : 'Save Organization'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign / Renew Subscription */}
      <Modal
        open={subOpen}
        onClose={() => {
          setSubOpen(false);
          setActiveSubId(null);
        }}
        title={activeSubId ? 'Renew Subscription' : 'Assign Subscription'}
        sub={selected ? `Plan for ${selected.name} (${selected.code})` : ''}
      >
        <form onSubmit={submitSub} className="space-y-3">
          {!plans.length ? (
            <div className="mm-pa-error">No plans loaded from GET /subscription-plans. Cannot assign.</div>
          ) : null}
          <div className="mm-pa-grid-2">
            <div>
              <label className="mm-pa-label">Plan</label>
              <select
                className="mm-pa-select"
                value={String(subForm.plan_id || '')}
                onChange={(e) => {
                  const plan = plans.find((p) => String(p.id) === e.target.value);
                  setSubForm({
                    ...subForm,
                    plan_id: plan?.id || '',
                    plan_code: plan?.plan_code || '',
                    plan_name: plan?.name || '',
                    student_limit: plan?.defaultLimit || subForm.student_limit,
                  });
                }}
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.plan_code ? `${p.plan_code} — ${p.name}` : p.name}
                  </option>
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
                <option value="CANCELLED">CANCELLED</option>
                <option value="EXPIRED">EXPIRED</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            {activeSubId ? (
              <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={onCancelSubscription}>
                Cancel subscription
              </button>
            ) : null}
            <button
              type="button"
              className="mm-pa-btn mm-pa-btn--ghost"
              onClick={() => {
                setSubOpen(false);
                setActiveSubId(null);
              }}
            >
              Close
            </button>
            <button type="submit" className="mm-pa-btn mm-pa-btn--primary" disabled={!plans.length}>
              {activeSubId ? 'Save renewal' : 'Assign Subscription'}
            </button>
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
              : `Same ORG_ADMIN account for ${selected.name} — org dashboards stay unchanged`
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
            <div className="mm-pa-callout mm-pa-callout--amber">
              Edits the same ORG_ADMIN row in place. Organization, HODs, students, plans, and dashboards stay unchanged.
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

            <label className="mm-pa-feature-row" style={{ cursor: 'pointer' }}>
              <div>
                <p className="mm-pa-feature-row__title">Reset password &amp; send activation (TPO handover)</p>
                <p className="mm-pa-feature-row__desc">
                  Clears the old password immediately. Status becomes INVITED until the new person sets a password via the activation link.
                  Leave off only if you are fixing name/contact details for the same person and they should keep their password.
                </p>
              </div>
              <input
                type="checkbox"
                checked={resetPasswordOnEdit}
                onChange={(e) => setResetPasswordOnEdit(e.target.checked)}
                aria-label="Reset password and send activation"
              />
            </label>

            {resetPasswordOnEdit ? (
              <div className="mm-pa-callout mm-pa-callout--amber">
                Old TPO login stops working now. New email receives the activation link (72 hours). Same flow as first-time invite: open link → set password → /login.
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={cancelEditTpo}>Cancel</button>
              <button type="submit" className="mm-pa-btn mm-pa-btn--primary" disabled={tpoBusy}>
                {tpoBusy ? 'Saving…' : resetPasswordOnEdit ? 'Save & Send Activation' : 'Save Details'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {error && <div className="mm-pa-error">{error}</div>}
            {tpoEmailBanner(activationInfo)}
            <div className="mm-pa-detail-card">
              <p><span className="mm-pa-detail-card__label">User:</span> {[activationInfo?.first_name, activationInfo?.last_name].filter(Boolean).join(' ') || '—'}</p>
              <p className="mt-1"><span className="mm-pa-detail-card__label">Email:</span> {activationInfo?.email || '—'}</p>
              <p className="mt-1"><span className="mm-pa-detail-card__label">Username:</span> {activationInfo?.username || '—'}</p>
              <p className="mt-1"><span className="mm-pa-detail-card__label">Mobile:</span> {activationInfo?.mobile || '—'}</p>
              <p className="mt-1"><span className="mm-pa-detail-card__label">Role:</span> ORG_ADMIN</p>
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
              {activationInfo?.activation_expires_at ? (
                <p className="mt-1">
                  <span className="mm-pa-detail-card__label">Link expires:</span>{' '}
                  {new Date(activationInfo.activation_expires_at).toLocaleString('en-IN')}
                </p>
              ) : null}
              {activationInfo?.email_sent === true ? (
                <p className="mt-1"><span className="mm-pa-detail-card__label">Email:</span> Sent</p>
              ) : null}
              {activationInfo?.email_sent === false ? (
                <p className="mt-1"><span className="mm-pa-detail-card__label">Email:</span> Failed{activationInfo.email_detail ? ` — ${activationInfo.email_detail}` : ''}</p>
              ) : null}
              {activationInfo?.email_skipped ? (
                <p className="mt-1"><span className="mm-pa-detail-card__label">Email:</span> Skipped</p>
              ) : null}
            </div>

            {(activationInfo?.email_sent === false || activationInfo?.email_skipped || (tpoJustCreated && (activationInfo?.activation_token || activationInfo?.activation_url))) && (activationInfo?.activation_token || activationInfo?.activation_url) ? (
              <div className="mm-pa-detail-card">
                <p className="font-semibold">Share manually</p>
                <p className="mt-1 text-sm">If email did not go out, copy the activation link or token and share with the TPO.</p>
                {tpoActivationLink(activationInfo) ? (
                  <p className="mt-2 break-all text-xs">
                    <span className="mm-pa-detail-card__label">Link:</span>{' '}
                    {tpoActivationLink(activationInfo)}
                  </p>
                ) : null}
                {activationInfo.activation_token ? (
                  <p className="mt-1 break-all text-xs">
                    <span className="mm-pa-detail-card__label">Token:</span> {activationInfo.activation_token}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {tpoActivationLink(activationInfo) ? (
                    <button
                      type="button"
                      className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs"
                      onClick={() => copyText(tpoActivationLink(activationInfo))}
                    >
                      Copy link
                    </button>
                  ) : null}
                  {activationInfo.activation_token ? (
                    <button
                      type="button"
                      className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs"
                      onClick={() => copyText(activationInfo.activation_token)}
                    >
                      Copy token
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="mm-pa-callout mm-pa-callout--amber">
              <strong>Edit</strong> = change person/details (same account id; use reset password for handover).{' '}
              <strong>Reinvite</strong> = same person forgot password only.
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

      {/* Confirm Active / Inactive */}
      <Modal
        open={statusConfirmOpen}
        onClose={closeStatusConfirm}
        title={
          statusTarget && isActiveStatus(statusTarget.status)
            ? 'Make organization INACTIVE?'
            : 'Make organization ACTIVE?'
        }
        sub={statusTarget ? statusTarget.name : ''}
      >
        {statusTarget && (
          <div className="space-y-4">
            {isActiveStatus(statusTarget.status) ? (
              <>
                <div className="mm-pa-callout mm-pa-callout--amber">
                  This suspends the college tenant. TPO, HOD, and students will be blocked from logging in, and existing sessions fail on the next API call. New student registration into this college is disabled. Public / individual users and other colleges are not affected.
                </div>
                <div className="mm-pa-detail-card">
                  <p className="font-semibold">If you continue, for <span className="mm-pa-strong">{statusTarget.name}</span>:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    <li>Student login returns: “Your organization&apos;s access has ended. Please contact your TPO.”</li>
                    <li>TPO / HOD login returns: “This organization is suspended. Contact MentorMuni support.”</li>
                    <li>In-session users are logged out on the next authenticated API call (403)</li>
                    <li>College registration / signup into this org is blocked</li>
                    <li>You can reverse this later by setting status back to ACTIVE</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="mm-pa-callout mm-pa-callout--amber">
                  Activating restores Organization Portal access for this tenant.
                </div>
                <div className="mm-pa-detail-card">
                  <p className="font-semibold">If you continue, for <span className="mm-pa-strong">{statusTarget.name}</span>:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    <li>TPO / HOD / students can sign in again</li>
                    <li>Authenticated org APIs accept sessions again</li>
                    <li>Student registration into this college is allowed again</li>
                    <li>Status will change from SUSPENDED / INACTIVE → ACTIVE</li>
                  </ul>
                </div>
              </>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="mm-pa-btn mm-pa-btn--ghost"
                onClick={closeStatusConfirm}
                disabled={statusBusy}
              >
                No, cancel
              </button>
              <button
                type="button"
                className={`mm-pa-btn ${isActiveStatus(statusTarget.status) ? 'mm-pa-btn--danger' : 'mm-pa-btn--primary'}`}
                onClick={confirmStatusChange}
                disabled={statusBusy}
              >
                {statusBusy
                  ? 'Updating…'
                  : isActiveStatus(statusTarget.status)
                    ? 'Yes, make INACTIVE'
                    : 'Yes, make ACTIVE'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={deleteConfirmOpen}
        onClose={() => {
          if (deleteBusy) return;
          setDeleteConfirmOpen(false);
          setDeleteTarget(null);
        }}
        title="Soft-delete organization?"
        sub={deleteTarget ? deleteTarget.name : ''}
      >
        {deleteTarget ? (
          <div className="space-y-4">
            <div className="mm-pa-callout mm-pa-callout--amber">
              Soft delete only via <code className="mm-pa-code">DELETE /platform/organizations/{deleteTarget.id}</code>.
              Organization becomes <strong>SUSPENDED</strong>; any ACTIVE subscriptions become{' '}
              <strong>CANCELLED</strong>. No hard wipe. PUBLIC tenants are blocked by the API.
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="mm-pa-btn mm-pa-btn--ghost"
                disabled={deleteBusy}
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeleteTarget(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="mm-pa-btn mm-pa-btn--danger"
                disabled={deleteBusy}
                onClick={confirmDeleteOrg}
              >
                {deleteBusy ? 'Deleting…' : 'Yes, soft-delete'}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
