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
  uploadOrganizationLogo,
  deleteOrganizationLogo,
  assignSubscription,
  cancelSubscription,
  getSubscriptionForOrg,
  getActiveSubscriptionsByOrgId,
  getOrgFeatures,
  saveOrgFeatures,
  createTpo,
  updateTpo,
  getOrganizationAdmins,
  getOrgAdmins,
  reinviteTpo,
  deactivateTpo,
  getFeatureCatalog,
  getSubscriptionPlans,
  statusLabel,
  isActiveStatus,
  orgAdminTitleLabel,
  liveOrgAdmins,
  availableOrgAdminTitles,
} from '../store';
import Modal from '../Modal';
import { collegePortalOrigin } from '../../tenant/resolveTenant';
import { organizationLogoUrl } from '../../tenant/orgLogo';

function collegePortalDisplay(orgOrSlug) {
  if (orgOrSlug && typeof orgOrSlug === 'object') {
    if (orgOrSlug.portal_url) return String(orgOrSlug.portal_url).replace(/^https?:\/\//, '');
    if (orgOrSlug.portal_slug) {
      return collegePortalOrigin(orgOrSlug.portal_slug).replace(/^https?:\/\//, '');
    }
    return '';
  }
  const slug = String(orgOrSlug || '').trim().toLowerCase();
  if (!slug) return '';
  return collegePortalOrigin(slug).replace(/^https?:\/\//, '');
}

function defaultUsername(org, title = 'TPO') {
  const code = String(org?.code || '').toLowerCase() || 'org';
  const suffix = String(title || 'TPO').toLowerCase();
  return `${code}.${suffix}`;
}

function groupAdminsByOrg(admins) {
  const map = {};
  for (const admin of admins || []) {
    if (admin?.organization_id == null) continue;
    const key = String(admin.organization_id);
    if (!map[key]) map[key] = [];
    map[key].push(admin);
  }
  return map;
}

function upsertAdminInList(list, admin) {
  if (!admin) return list || [];
  const id = String(admin.user_id ?? admin.id);
  const next = [...(list || [])];
  const idx = next.findIndex((a) => String(a.user_id ?? a.id) === id);
  if (idx >= 0) next[idx] = { ...next[idx], ...admin };
  else next.push(admin);
  return next;
}

const emptyOrg = {
  name: '',
  code: '',
  portal_slug: '',
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
    portal_slug: org.portal_slug || '',
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
  const [logoBusy, setLogoBusy] = useState(false);
  const [logoPreviewOrg, setLogoPreviewOrg] = useState(null);
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
    title: 'TPO',
  });
  const [activationInfo, setActivationInfo] = useState(null);
  const [orgAdmins, setOrgAdmins] = useState([]);
  const [tpoMode, setTpoMode] = useState('list'); // list | create | view | edit
  const [tpoLoading, setTpoLoading] = useState(false);
  const [tpoBusy, setTpoBusy] = useState(false);
  const [tpoJustCreated, setTpoJustCreated] = useState(false);
  const [resetPasswordOnEdit, setResetPasswordOnEdit] = useState(true);
  const [subsByOrg, setSubsByOrg] = useState({});
  const [tpoByOrg, setTpoByOrg] = useState({});
  const [loading, setLoading] = useState(true);
  const [enriching, setEnriching] = useState(false);
  const [apiToast, setApiToast] = useState('');

  const fillTpoForm = (tpo, org, titleOverride) => {
    const title = String(titleOverride || tpo?.title || 'TPO').toUpperCase();
    return {
      first_name: tpo?.first_name || '',
      last_name: tpo?.last_name || '',
      email: tpo?.email || org?.contact_email || '',
      mobile: tpo?.mobile || org?.contact_phone || '',
      username: tpo?.username || defaultUsername(org, title),
      title,
    };
  };

  const syncOrgAdminsCache = (orgId, admins) => {
    const key = String(orgId);
    setOrgAdmins(admins || []);
    setTpoByOrg((prev) => ({ ...prev, [key]: admins || [] }));
  };

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
          {info.message || 'Activation email sent. Org Admin can open the link and set their password.'}
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
          {info.message || 'Org Admin saved. If email was sent, they can activate from the invite link.'}
        </div>
      );
    }
    return null;
  };

  const closeTpoModal = () => {
    setTpoOpen(false);
    setError('');
    setTpoMode('list');
    setTpoJustCreated(false);
    setResetPasswordOnEdit(true);
    setActivationInfo(null);
    setOrgAdmins([]);
  };

  const refresh = async () => {
    try {
      setLoading(true);
      setEnriching(true);
      const orgPromise = getOrganizations();
      const tpoPromise = getOrgAdmins().catch(() => []);
      const subPromise = getActiveSubscriptionsByOrgId().catch(() => ({}));

      // Paint the org table as soon as the list arrives — do not wait on
      // subscription enrichment (that used to be N+1 per org).
      const rows = await orgPromise;
      setOrgs(rows);
      setLoading(false);
      setApiToast('');

      const [tpos, subsMap] = await Promise.all([tpoPromise, subPromise]);
      setTpoByOrg(groupAdminsByOrg(tpos));
      setSubsByOrg(subsMap || {});
    } catch (e) {
      setApiToast(e.message || 'Failed to fetch organizations.');
      setLoading(false);
    } finally {
      setEnriching(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const boot = async () => {
      // Plans/features are only needed for modals — load in parallel, never
      // block the organizations table.
      getSubscriptionPlans()
        .then((plansResult) => {
          if (mounted) setPlans(plansResult || []);
        })
        .catch((e) => {
          if (mounted) setApiToast(e.message || 'Failed to load subscription plans.');
        });
      getFeatureCatalog()
        .then((featureResult) => {
          if (mounted) setFeatureCatalog(featureResult || []);
        })
        .catch(() => {
          if (mounted) setFeatureCatalog([]);
        });

      try {
        await refresh();
      } catch (e) {
        if (!mounted) return;
        setError(e.message || 'Failed to load organizations.');
        setApiToast(e.message || 'Failed to load organizations.');
      }
    };
    boot();
    const onUpdate = () => {
      refresh();
    };
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

  useEffect(() => {
    if (!success) return undefined;
    const timer = window.setTimeout(() => setSuccess(''), 4000);
    return () => window.clearTimeout(timer);
  }, [success]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orgs;
    return orgs.filter(
      (o) =>
        String(o.name || '')
          .toLowerCase()
          .includes(q) ||
        String(o.code || '')
          .toLowerCase()
          .includes(q) ||
        String(o.city || '')
          .toLowerCase()
          .includes(q)
    );
  }, [orgs, query]);

  const openCreate = () => {
    setEditingOrgId(null);
    setForm(emptyOrg);
    setLogoPreviewOrg(null);
    setError('');
    setSuccess('');
    setCreateOpen(true);
  };

  const openEditOrg = (org) => {
    setEditingOrgId(org.id);
    setForm(orgToForm(org));
    setLogoPreviewOrg(org);
    setError('');
    setSuccess('');
    setCreateOpen(true);
  };

  const onLogoFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editingOrgId) return;
    setLogoBusy(true);
    setError('');
    try {
      const row = await uploadOrganizationLogo(editingOrgId, file);
      setLogoPreviewOrg(row);
      setOrgs((prev) => prev.map((o) => (o.id === row.id ? { ...o, ...row } : o)));
      setSuccess('College logo updated.');
    } catch (err) {
      setError(err.message || 'Logo upload failed.');
    } finally {
      setLogoBusy(false);
    }
  };

  const onClearLogo = async () => {
    if (!editingOrgId) return;
    setLogoBusy(true);
    setError('');
    try {
      const row = await deleteOrganizationLogo(editingOrgId);
      setLogoPreviewOrg(row);
      setOrgs((prev) => prev.map((o) => (o.id === row.id ? { ...o, ...row } : o)));
      setSuccess('College logo removed.');
    } catch (err) {
      setError(err.message || 'Could not remove logo.');
    } finally {
      setLogoBusy(false);
    }
  };

  const submitOrg = async (e) => {
    e.preventDefault();
    setError('');
    const slug = String(form.portal_slug || form.code || '')
      .trim()
      .toLowerCase();
    if (slug && (slug.length < 3 || slug.length > 32)) {
      setError('Portal slug must be 3–32 characters (letters, numbers, hyphens).');
      return;
    }
    try {
      if (editingOrgId) {
        const row = await updateOrganization(editingOrgId, {
          ...form,
          portal_slug: slug || form.portal_slug,
        });
        setSuccess(`Organization updated · ${row.name} (${row.code})`);
      } else {
        const row = await createOrganization({
          ...form,
          portal_slug: slug || undefined,
        });
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
    const known = tpoByOrg[orgKey] || [];
    setSelected(org);
    setError('');
    setTpoJustCreated(false);
    setActivationInfo(null);
    setOrgAdmins(known);
    setTpoOpen(true);
    setTpoMode(liveOrgAdmins(known).length ? 'list' : 'create');
    setTpoForm(fillTpoForm(null, org, availableOrgAdminTitles(known)[0]?.value || 'TPO'));
    setTpoLoading(true);

    try {
      const admins = await getOrganizationAdmins(org.id);
      syncOrgAdminsCache(org.id, admins);
      const live = liveOrgAdmins(admins);
      if (live.length) {
        setTpoMode('list');
      } else {
        setTpoMode('create');
        setTpoForm(fillTpoForm(null, org, availableOrgAdminTitles(admins)[0]?.value || 'TPO'));
      }
    } catch (err) {
      if (known.length) {
        setTpoMode('list');
      } else {
        setError(err.message || 'Failed to load Org Admins for this organization.');
      }
    } finally {
      setTpoLoading(false);
    }
  };

  const startCreateAdmin = () => {
    const free = availableOrgAdminTitles(orgAdmins);
    if (!free.length) {
      setError('All three Org Admin titles are already assigned. Deactivate one to free a slot.');
      return;
    }
    setError('');
    setActivationInfo(null);
    setTpoJustCreated(false);
    setTpoForm(fillTpoForm(null, selected, free[0].value));
    setTpoMode('create');
  };

  const openAdminDetail = (admin) => {
    setError('');
    setTpoJustCreated(false);
    setActivationInfo(admin);
    setTpoForm(fillTpoForm(admin, selected));
    setTpoMode('view');
  };

  const backToAdminList = () => {
    setError('');
    setTpoJustCreated(false);
    setActivationInfo(null);
    setResetPasswordOnEdit(true);
    setTpoMode(liveOrgAdmins(orgAdmins).length ? 'list' : 'create');
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
    const free = availableOrgAdminTitles(orgAdmins);
    const title = String(tpoForm.title || 'TPO').toUpperCase();
    if (!free.some((t) => t.value === title)) {
      setError(`${orgAdminTitleLabel(title)} is already assigned. Pick a free title or deactivate the current holder.`);
      return;
    }
    setError('');
    setTpoBusy(true);
    try {
      const user = await createTpo(selected.id, tpoForm);
      const next = upsertAdminInList(orgAdmins, user);
      syncOrgAdminsCache(selected.id, next);
      setActivationInfo(user);
      setTpoJustCreated(true);
      setTpoMode('view');
      if (user.email_sent === true) {
        setSuccess(`Activation email sent to ${user.email}.`);
      } else if (user.email_sent === false || user.email_skipped) {
        setSuccess(`Org Admin created for ${user.email}. Share the activation link manually.`);
      } else {
        setSuccess(user.message || `Org Admin created for ${user.email}.`);
      }
    } catch (err) {
      const message = err.message || 'Failed to create Org Admin.';
      setError(message);
      setApiToast(message);
      try {
        const admins = await getOrganizationAdmins(selected.id);
        syncOrgAdminsCache(selected.id, admins);
      } catch {
        // keep create error visible
      }
    } finally {
      setTpoBusy(false);
    }
  };

  const submitEditTpo = async (e) => {
    e.preventDefault();
    if (!selected || !activationInfo) return;
    const userId = activationInfo.user_id ?? activationInfo.id;
    setError('');
    setTpoBusy(true);
    try {
      const user = await updateTpo(selected.id, {
        user_id: userId,
        first_name: tpoForm.first_name,
        last_name: tpoForm.last_name,
        email: tpoForm.email,
        mobile: tpoForm.mobile,
        username: tpoForm.username,
        title: tpoForm.title,
        ...(resetPasswordOnEdit
          ? { reset_password: true, activation_hours: 72 }
          : { reset_password: false }),
      });
      const next = upsertAdminInList(orgAdmins, user);
      syncOrgAdminsCache(selected.id, next);
      setActivationInfo(user);
      setTpoJustCreated(Boolean(resetPasswordOnEdit));
      setTpoMode('view');
      if (resetPasswordOnEdit) {
        if (user.email_sent === true) {
          setSuccess(`Org Admin updated. Old password cleared. Activation email sent to ${user.email}.`);
        } else if (user.email_sent === false || user.email_skipped) {
          setSuccess('Org Admin updated. Old password cleared. Share the activation link manually.');
        } else {
          setSuccess(user.message || `Org Admin updated for ${user.email || selected.name}. Password reset — new person must activate.`);
        }
      } else {
        setSuccess(`Org Admin details updated for ${user.email || selected.name}. Password unchanged.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to update Org Admin.');
    } finally {
      setTpoBusy(false);
    }
  };

  const submitReinvite = async () => {
    if (!selected || !activationInfo) return;
    const userId = activationInfo.user_id ?? activationInfo.id;
    setError('');
    setTpoBusy(true);
    try {
      const user = await reinviteTpo(selected.id, userId);
      const merged = {
        ...(activationInfo || {}),
        ...user,
        email: user.email || activationInfo?.email,
        username: user.username || activationInfo?.username,
        first_name: user.first_name || activationInfo?.first_name,
        last_name: user.last_name || activationInfo?.last_name,
        title: user.title || activationInfo?.title,
        user_id: user.user_id ?? user.id ?? userId,
      };
      const next = upsertAdminInList(orgAdmins, merged);
      syncOrgAdminsCache(selected.id, next);
      setActivationInfo(merged);
      setTpoJustCreated(true);
      setTpoMode('view');
      if (merged.email_sent === true) {
        setSuccess(`Fresh activation email sent to ${merged.email || selected.name}.`);
      } else if (merged.email_sent === false || merged.email_skipped) {
        setSuccess('Reinvite created. Share the activation link manually.');
      } else {
        setSuccess(`Fresh activation link queued for ${merged.email || selected.name}.`);
      }
    } catch (err) {
      const message = err.message || 'Failed to reinvite Org Admin.';
      setError(message);
      setApiToast(message);
    } finally {
      setTpoBusy(false);
    }
  };

  const submitDeactivate = async () => {
    if (!selected || !activationInfo) return;
    const userId = activationInfo.user_id ?? activationInfo.id;
    const label = orgAdminTitleLabel(activationInfo.title);
    if (!window.confirm(`Deactivate ${label} (${activationInfo.email || activationInfo.username})? This frees the title slot without affecting other Org Admins.`)) {
      return;
    }
    setError('');
    setTpoBusy(true);
    try {
      const user = await deactivateTpo(selected.id, userId);
      const merged = {
        ...activationInfo,
        ...user,
        activation_status: user?.activation_status || 'BLOCKED',
        user_id: user?.user_id ?? user?.id ?? userId,
      };
      const next = upsertAdminInList(orgAdmins, merged);
      syncOrgAdminsCache(selected.id, next);
      setActivationInfo(null);
      setTpoJustCreated(false);
      setSuccess(`${label} deactivated. That title slot is free again.`);
      setTpoMode(liveOrgAdmins(next).length ? 'list' : 'create');
      if (!liveOrgAdmins(next).length) {
        setTpoForm(fillTpoForm(null, selected, 'TPO'));
      }
    } catch (err) {
      const message = err.message || 'Failed to deactivate Org Admin.';
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
              const orgAdminsForRow = tpoByOrg[String(org.id)] || [];
              const liveCount = liveOrgAdmins(orgAdminsForRow).length;
              const hasAdmins = liveCount > 0;
              return (
                <tr key={org.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="mm-pa-table__avatar">
                        {org.has_logo ? (
                          <img
                            src={organizationLogoUrl(org.id, {
                              updatedAt: org.logo_updated_at,
                            })}
                            alt=""
                            width={32}
                            height={32}
                          />
                        ) : (
                          <Building2 size={16} />
                        )}
                      </div>
                      <div>
                        <p className="mm-pa-table__title">{org.name}</p>
                        <p className="mm-pa-table__meta">
                          {org.code} · ID {org.id}
                          {org.portal_slug ? ` · ${collegePortalDisplay(org)}` : ''}
                          {sub
                            ? ` · ${sub.plan_name}`
                            : enriching
                              ? ''
                              : ' · No plan'}
                          {hasAdmins ? ` · ${liveCount}/3 Org Admins` : ''}
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
                        className={`mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs ${hasAdmins ? 'mm-pa-btn--tpo-assigned' : ''}`}
                        onClick={() => openTpo(org)}
                        title={hasAdmins ? 'View Org Admins' : 'Add Org Admin'}
                      >
                        {hasAdmins ? <UserCheck size={13} /> : <UserPlus size={13} />}
                        {hasAdmins ? 'View Org Admins' : 'Add Org Admin'}
                      </button>
                      <button
                        type="button"
                        className="mm-pa-btn mm-pa-btn--ghost !px-2.5 !py-1.5 text-xs"
                        onClick={() => openDeleteOrg(org)}
                        title="Soft-delete: suspend org and cancel active plans"
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
              <label className="mm-pa-label">Portal slug</label>
              <input
                className="mm-pa-input lowercase"
                value={form.portal_slug}
                onChange={(e) =>
                  setForm({
                    ...form,
                    portal_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                  })
                }
                placeholder="medicaps"
              />
              <p className="mm-pa-hint" style={{ marginTop: 4 }}>
                College portal:{' '}
                {form.portal_slug
                  ? collegePortalDisplay(form.portal_slug)
                  : form.code
                    ? `${collegePortalDisplay(String(form.code).toLowerCase())} (default from code)`
                    : '{slug}.mentormuni.com / {slug}.localhost'}
              </p>
            </div>
            <div>
              <label className="mm-pa-label">Organization Type</label>
              <select className="mm-pa-select" value={form.organization_type} onChange={(e) => setForm({ ...form, organization_type: e.target.value })}>
                <option value="College">College</option>
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

          {editingOrgId ? (
            <>
              <p className="mm-pa-section-label">Campus logo</p>
              <div className="mm-pa-logo-row">
                <div className="mm-pa-logo-preview">
                  {logoPreviewOrg?.has_logo ? (
                    <img
                      src={organizationLogoUrl(logoPreviewOrg.id, {
                        updatedAt: logoPreviewOrg.logo_updated_at,
                      })}
                      alt=""
                    />
                  ) : (
                    <Building2 size={22} />
                  )}
                </div>
                <div className="mm-pa-logo-actions">
                  <label className="mm-pa-btn mm-pa-btn--ghost mm-pa-logo-file">
                    {logoBusy ? 'Uploading…' : 'Upload logo'}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      disabled={logoBusy}
                      onChange={onLogoFile}
                    />
                  </label>
                  {logoPreviewOrg?.has_logo ? (
                    <button
                      type="button"
                      className="mm-pa-btn mm-pa-btn--ghost"
                      disabled={logoBusy}
                      onClick={onClearLogo}
                    >
                      Remove
                    </button>
                  ) : null}
                  <p className="mm-pa-hint">
                    PNG, JPEG, WebP, or SVG · max 512 KB. Shown on the campus portal (not student photos).
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="mm-pa-hint" style={{ marginTop: 12 }}>
              Save the organization first, then edit it to upload a campus logo.
            </p>
          )}

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

      {/* Create / view / edit Org Admins (TPO / Dean / Director) */}
      <Modal
        open={tpoOpen}
        onClose={closeTpoModal}
        title={
          tpoMode === 'list'
            ? 'Org Admins'
            : tpoMode === 'view'
              ? 'View Org Admin'
              : tpoMode === 'edit'
                ? 'Edit Org Admin'
                : 'Add Org Admin'
        }
        sub={
          selected
            ? tpoMode === 'list'
              ? `Up to 3 Org Admins for ${selected.name} (TPO, Dean, Director)`
              : tpoMode === 'create'
                ? `Invite an Org Admin for ${selected.name}`
                : `${orgAdminTitleLabel(activationInfo?.title || tpoForm.title)} · ${selected.name}`
            : ''
        }
      >
        {tpoLoading ? (
          <div className="space-y-3 py-2">
            <div className="mm-pa-skeleton h-10 w-full" />
            <div className="mm-pa-skeleton h-24 w-full" />
            <div className="mm-pa-skeleton ml-auto h-10 w-40" />
          </div>
        ) : tpoMode === 'list' ? (
          <div className="space-y-4">
            {error && <div className="mm-pa-error">{error}</div>}
            <p className="text-sm text-[var(--pa-muted)]">
              Same access for all titles. Primary is TPO. Deactivating one frees that title without affecting the others.
            </p>
            <div className="space-y-2">
              {liveOrgAdmins(orgAdmins).map((admin) => {
                const name = [admin.first_name, admin.last_name].filter(Boolean).join(' ') || admin.email || '—';
                return (
                  <button
                    key={admin.user_id ?? admin.id}
                    type="button"
                    className="mm-pa-list-row w-full text-left"
                    onClick={() => openAdminDetail(admin)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="mm-pa-table__title">
                        Org Admin
                        {admin.is_primary ? (
                          <span className="mm-pa-badge mm-pa-badge--neutral ml-2 !text-[10px]">Primary</span>
                        ) : null}
                      </p>
                      <p className="mm-pa-list-row__meta">
                        {orgAdminTitleLabel(admin.title)} · {name} · {admin.email || admin.username || '—'}
                      </p>
                    </div>
                    <span
                      className={`mm-pa-badge ${
                        admin.activation_status === 'PENDING' || admin.activation_status === 'INVITED'
                          ? 'mm-pa-badge--pending'
                          : 'mm-pa-badge--active'
                      }`}
                    >
                      {admin.activation_status || 'ACTIVE'}
                    </span>
                  </button>
                );
              })}
              {!liveOrgAdmins(orgAdmins).length ? (
                <div className="mm-pa-empty">No live Org Admins yet.</div>
              ) : null}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={closeTpoModal}>
                Close
              </button>
              {availableOrgAdminTitles(orgAdmins).length ? (
                <button type="button" className="mm-pa-btn mm-pa-btn--primary" onClick={startCreateAdmin}>
                  <UserPlus size={14} /> Add Org Admin
                </button>
              ) : null}
            </div>
          </div>
        ) : tpoMode === 'create' ? (
          <form onSubmit={submitTpo} className="space-y-3">
            {error && <div className="mm-pa-error">{error}</div>}
            <div className="mm-pa-callout mm-pa-callout--info">
              <p className="mm-pa-callout__title">How activation works</p>
              <p className="mm-pa-callout__body">
                We email the Org Admin a secure link to set their own password. No temporary password is shared here.
                Sending the email can take a few seconds — please wait until the button finishes.
              </p>
            </div>
            <div className="mm-pa-grid-2">
              <div>
                <label className="mm-pa-label">Title *</label>
                <select
                  className="mm-pa-select"
                  required
                  value={tpoForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setTpoForm((prev) => ({
                      ...prev,
                      title,
                      username: prev.username?.includes('.')
                        ? defaultUsername(selected, title)
                        : prev.username,
                    }));
                  }}
                >
                  {availableOrgAdminTitles(orgAdmins).map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}{t.value === 'TPO' ? ' (Primary)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mm-pa-label">Role</label>
                <input className="mm-pa-input" value="Org Admin" disabled />
              </div>
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
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="mm-pa-btn mm-pa-btn--ghost"
                onClick={() => (liveOrgAdmins(orgAdmins).length ? backToAdminList() : closeTpoModal())}
              >
                {liveOrgAdmins(orgAdmins).length ? 'Back' : 'Cancel'}
              </button>
              <button type="submit" className="mm-pa-btn mm-pa-btn--primary" disabled={tpoBusy || !availableOrgAdminTitles(orgAdmins).length}>
                {tpoBusy ? 'Creating & sending email…' : 'Create & Send Activation'}
              </button>
            </div>
          </form>
        ) : tpoMode === 'edit' ? (
          <form onSubmit={submitEditTpo} className="space-y-3">
            {error && <div className="mm-pa-error">{error}</div>}
            <div className="mm-pa-callout mm-pa-callout--info">
              <p className="mm-pa-callout__title">Editing this Org Admin</p>
              <p className="mm-pa-callout__body">
                Updates apply to the same college admin account. Students, departments, plans, and dashboards are not affected.
              </p>
            </div>
            <div className="mm-pa-grid-2">
              <div>
                <label className="mm-pa-label">Title *</label>
                <select
                  className="mm-pa-select"
                  required
                  value={tpoForm.title}
                  onChange={(e) => setTpoForm({ ...tpoForm, title: e.target.value })}
                >
                  {availableOrgAdminTitles(orgAdmins, activationInfo?.title).map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}{t.value === 'TPO' ? ' (Primary)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mm-pa-label">Role</label>
                <input className="mm-pa-input" value="Org Admin" disabled />
              </div>
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
            </div>

            <label className="mm-pa-feature-row" style={{ cursor: 'pointer' }}>
              <div>
                <p className="mm-pa-feature-row__title">Reset password &amp; send activation (handover)</p>
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
                Old login stops working now. New email receives the activation link (72 hours). Same flow as first-time invite: open link → set password → /login.
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
              <p>
                <span className="mm-pa-detail-card__label">Role:</span> Org Admin
                <span className="mm-pa-table__meta block mt-0.5">{orgAdminTitleLabel(activationInfo?.title)}</span>
              </p>
              <p className="mt-1"><span className="mm-pa-detail-card__label">User:</span> {[activationInfo?.first_name, activationInfo?.last_name].filter(Boolean).join(' ') || '—'}</p>
              <p className="mt-1"><span className="mm-pa-detail-card__label">Email:</span> {activationInfo?.email || '—'}</p>
              <p className="mt-1"><span className="mm-pa-detail-card__label">Username:</span> {activationInfo?.username || '—'}</p>
              <p className="mt-1"><span className="mm-pa-detail-card__label">Mobile:</span> {activationInfo?.mobile || '—'}</p>
              {activationInfo?.is_primary ? (
                <p className="mt-1"><span className="mm-pa-detail-card__label">Primary:</span> Yes (TPO)</p>
              ) : null}
              <p className="mt-1">
                <span className="mm-pa-detail-card__label">Status:</span>{' '}
                <span className={`mm-pa-badge ${
                  activationInfo?.activation_status === 'PENDING' || activationInfo?.activation_status === 'INVITED'
                    ? 'mm-pa-badge--pending'
                    : activationInfo?.activation_status === 'BLOCKED'
                      ? 'mm-pa-badge--suspended'
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
                <p className="mt-1 text-sm">If email did not go out, copy the activation link or token and share with the Org Admin.</p>
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
              <strong>Reinvite</strong> = same person forgot password only.{' '}
              <strong>Deactivate</strong> = free this title slot; other Org Admins stay active.
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={backToAdminList}>Back</button>
              <button type="button" className="mm-pa-btn mm-pa-btn--ghost" onClick={submitDeactivate} disabled={tpoBusy}>
                Deactivate
              </button>
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
              Different from <strong>Make Inactive</strong> (status badge): soft-delete also{' '}
              <strong>cancels ACTIVE subscriptions</strong>. Organization status becomes{' '}
              <strong>SUSPENDED</strong>. No hard wipe. PUBLIC tenants are blocked by the API.
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
