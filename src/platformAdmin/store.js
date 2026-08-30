import { platformApi } from './platformApi';

export const PLATFORM_ROLES = ['PLATFORM_ADMIN', 'SUPPORT', 'SALES', 'OPERATIONS'];

function emitUpdate() {
  window.dispatchEvent(new CustomEvent('mm-platform-db-updated'));
}

/** Backend list endpoints may return a bare array or a wrapped object. */
function asArray(payload, preferredKeys = []) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  for (const key of preferredKeys) {
    if (Array.isArray(payload[key])) return payload[key];
  }

  for (const key of ['items', 'data', 'results', 'rows', 'organizations', 'subscriptions', 'users', 'features', 'plans', 'tpos', 'org_admins']) {
    if (Array.isArray(payload[key])) return payload[key];
  }

  return [];
}

function uiOrgType(value) {
  return String(value || '').toUpperCase() === 'PUBLIC' ? 'Public' : 'College';
}

function apiOrgType(value) {
  return String(value || '').toUpperCase() === 'PUBLIC' || value === 'Public' ? 'PUBLIC' : 'COLLEGE';
}

function uiStatus(value) {
  const v = String(value || '').toUpperCase();
  return v === 'SUSPENDED' || v === 'INACTIVE' ? 'Inactive' : 'Active';
}

function apiStatus(value) {
  const v = String(value || '').toUpperCase();
  return v === 'SUSPENDED' || v === 'INACTIVE' || value === 'Suspended' || value === 'Inactive'
    ? 'SUSPENDED'
    : 'ACTIVE';
}

export function statusLabel(value) {
  const v = String(value || '').toUpperCase();
  return v === 'SUSPENDED' || v === 'INACTIVE' || value === 'Inactive' || value === 'Suspended'
    ? 'INACTIVE'
    : 'ACTIVE';
}

export function isActiveStatus(value) {
  return statusLabel(value) === 'ACTIVE';
}

function normalizeOrganization(row) {
  return {
    ...row,
    organization_type: uiOrgType(row.organization_type),
    status: uiStatus(row.status),
  };
}

export async function getOrganizations() {
  // Organizations tab is college-only. Individuals live under /platform/individuals.
  const rows = asArray(
    await platformApi.get('/platform/organizations?organization_type=COLLEGE'),
    ['organizations']
  );
  return rows
    .map(normalizeOrganization)
    .filter((o) => String(o.organization_type || '').toLowerCase() !== 'public')
    .sort((a, b) => b.id - a.id);
}

export async function getOrganizationById(id) {
  const row = await platformApi.get(`/platform/organizations/${id}`);
  return normalizeOrganization(row);
}

export async function createOrganization(payload) {
  const slug = String(payload.portal_slug || '').trim().toLowerCase();
  const row = await platformApi.post('/platform/organizations', {
    ...payload,
    code: String(payload.code || '').toUpperCase(),
    portal_slug: slug || undefined,
    // Organizations tab never creates PUBLIC — individuals use /platform/individuals.
    organization_type: 'COLLEGE',
    status: apiStatus(payload.status),
  });
  emitUpdate();
  return normalizeOrganization(row);
}

export async function updateOrganization(id, patch) {
  const body = {
    ...patch,
    ...(patch.code != null ? { code: String(patch.code).toUpperCase() } : {}),
    // Empty slug is omitted (backend ignores null and would silently keep old slug).
    ...(patch.portal_slug != null && String(patch.portal_slug).trim()
      ? { portal_slug: String(patch.portal_slug).trim().toLowerCase() }
      : patch.portal_slug != null
        ? {}
        : {}),
    ...(patch.organization_type ? { organization_type: apiOrgType(patch.organization_type) } : {}),
    ...(patch.status ? { status: apiStatus(patch.status) } : {}),
  };
  // Avoid sending blank portal_slug that previously became null and no-oped.
  if (Object.prototype.hasOwnProperty.call(body, 'portal_slug') && !body.portal_slug) {
    delete body.portal_slug;
  }
  const row = await platformApi.put(`/platform/organizations/${id}`, body);
  emitUpdate();
  return normalizeOrganization(row);
}

export async function uploadOrganizationLogo(id, file) {
  const row = await platformApi.upload(`/platform/organizations/${id}/logo`, file);
  emitUpdate();
  return normalizeOrganization(row);
}

export async function deleteOrganizationLogo(id) {
  const row = await platformApi.delete(`/platform/organizations/${id}/logo`);
  emitUpdate();
  return normalizeOrganization(row);
}

export async function getSubscriptionPlans() {
  // X-API-Key required; Bearer not required (auth: false still sends API key).
  const rows = asArray(await platformApi.get('/subscription-plans', { auth: false }), ['plans']);
  const plans = rows
    .map((p) => ({
      id: p.id,
      plan_code: String(p.plan_code || p.code || '').toUpperCase(),
      name: p.name || p.plan_name || p.plan_code || p.code || `Plan ${p.id}`,
      defaultLimit:
        p.default_student_limit || p.max_students || p.student_limit || 100,
      plan_type: p.plan_type,
    }))
    .filter((p) => p.id != null);
  if (!plans.length) {
    throw new Error('No subscription plans returned by the API.');
  }
  return plans;
}

export async function getSubscriptions(filters = {}) {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.set(k, String(v));
  });
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return asArray(await platformApi.get(`/platform/subscriptions${suffix}`), ['subscriptions']);
}

/**
 * One request for all ACTIVE subscriptions, keyed by organization_id.
 * Prefer the newest subscription id when an org has more than one ACTIVE row.
 */
export async function getActiveSubscriptionsByOrgId() {
  const rows = await getSubscriptions({ status: 'ACTIVE' });
  const map = {};
  for (const row of rows) {
    const orgId = row?.organization_id ?? row?.org_id;
    if (orgId == null) continue;
    const existing = map[orgId];
    if (!existing || Number(row.id) > Number(existing.id)) {
      map[orgId] = row;
    }
  }
  return map;
}

export async function getSubscriptionForOrg(organizationId) {
  const rows = await getSubscriptions({ organization_id: organizationId, status: 'ACTIVE' });
  return rows[0] || null;
}

function resolvePlanId(payload, plans) {
  if (payload.plan_id != null && payload.plan_id !== '') return Number(payload.plan_id);
  const code = String(payload.plan_code || '').toUpperCase();
  if (code) {
    const byCode = plans.find((p) => p.plan_code === code);
    if (byCode) return Number(byCode.id);
  }
  const name = String(payload.plan_name || '').trim();
  if (name) {
    const byName = plans.find(
      (p) => p.name === name || p.plan_code === name.toUpperCase()
    );
    if (byName) return Number(byName.id);
  }
  return null;
}

export async function assignSubscription(payload) {
  const plans = await getSubscriptionPlans();
  const planId = resolvePlanId(payload, plans);
  if (!planId) {
    throw new Error('Unable to resolve plan_id. Use a plan id/plan_code from GET /subscription-plans.');
  }

  const body = {
    organization_id: Number(payload.organization_id),
    plan_id: Number(planId),
    student_limit: Number(payload.student_limit),
    start_date: payload.start_date,
    end_date: payload.end_date,
    status: payload.status || 'ACTIVE',
  };

  // Renew in place when an ACTIVE subscription already exists.
  if (payload.subscription_id) {
    const row = await platformApi.put(`/platform/subscriptions/${payload.subscription_id}`, {
      plan_id: body.plan_id,
      student_limit: body.student_limit,
      start_date: body.start_date,
      end_date: body.end_date,
      status: body.status,
    });
    emitUpdate();
    return row;
  }

  const row = await platformApi.post('/platform/subscriptions', body);
  emitUpdate();
  return row;
}

export async function updateSubscription(id, patch) {
  const row = await platformApi.put(`/platform/subscriptions/${id}`, patch);
  emitUpdate();
  return row;
}

export async function cancelSubscription(id, status = 'CANCELLED') {
  return updateSubscription(id, { status });
}

export async function deleteOrganization(id) {
  // Soft delete only: backend sets org SUSPENDED and ACTIVE subscriptions → CANCELLED.
  // PUBLIC organizations are blocked by the API.
  await platformApi.delete(`/platform/organizations/${id}`);
  emitUpdate();
}

export async function getFeatureCatalog() {
  return asArray(await platformApi.get('/platform/feature-catalog'), ['features', 'catalog']);
}

export async function getOrgFeatures(organizationId) {
  const rows = asArray(
    await platformApi.get(`/platform/organizations/${organizationId}/features`),
    ['features', 'organization_features']
  );
  return rows.map((r) => ({
    ...r,
    enabled: Boolean(r.enabled),
  }));
}

export async function saveOrgFeatures(organizationId, enabledMap) {
  const features = Object.entries(enabledMap).map(([feature_id, enabled]) => ({
    feature_id: Number(feature_id),
    enabled: Boolean(enabled),
  }));
  const row = await platformApi.put(`/platform/organizations/${organizationId}/features`, {
    features,
  });
  emitUpdate();
  return row;
}

export const ORG_ADMIN_TITLES = [
  { value: 'TPO', label: 'TPO' },
  { value: 'DEAN', label: 'Dean' },
  { value: 'DIRECTOR', label: 'Director' },
];

export function orgAdminTitleLabel(title) {
  const key = String(title || 'TPO').toUpperCase();
  return ORG_ADMIN_TITLES.find((t) => t.value === key)?.label || key;
}

export function isLiveOrgAdmin(admin) {
  const status = String(admin?.activation_status || admin?.status || '').toUpperCase();
  return status === 'ACTIVE' || status === 'INVITED' || status === 'PENDING';
}

export function liveOrgAdmins(admins = []) {
  return (admins || []).filter(isLiveOrgAdmin);
}

export function takenOrgAdminTitles(admins = []) {
  return new Set(
    liveOrgAdmins(admins).map((a) => String(a.title || 'TPO').toUpperCase())
  );
}

export function availableOrgAdminTitles(admins = [], keepTitle = null) {
  const taken = takenOrgAdminTitles(admins);
  const keep = String(keepTitle || '').toUpperCase();
  if (keep) taken.delete(keep);
  return ORG_ADMIN_TITLES.filter((t) => !taken.has(t.value));
}

function normalizeTpo(row, organizationId, orgName) {
  if (!row || typeof row !== 'object') return null;
  const orgId = row.organization_id ?? row.org_id ?? organizationId;
  const status =
    row.activation_status ||
    row.status ||
    (row.activation_token ? 'PENDING' : 'ACTIVE');
  const nameParts = String(row.name || '').trim().split(/\s+/).filter(Boolean);
  const title = String(row.title || 'TPO').toUpperCase();
  const userId = row.user_id ?? row.id ?? null;

  return {
    id: userId ?? `org-${orgId}-tpo`,
    user_id: userId,
    organization_id: orgId,
    organization_name:
      row.organization_name ||
      row.organization?.name ||
      row.org_name ||
      orgName ||
      '',
    organization_code:
      row.organization_code ||
      row.organization?.code ||
      row.org_code ||
      '',
    first_name: row.first_name || nameParts[0] || '',
    last_name: row.last_name || nameParts.slice(1).join(' ') || '',
    email: row.email || '',
    username: row.username || '',
    mobile: row.mobile || row.phone || '',
    title,
    is_primary: Boolean(row.is_primary ?? title === 'TPO'),
    display_role: row.display_role || 'Org Admin',
    activation_status: String(status).toUpperCase(),
    activation_token: row.activation_token || '',
    activation_url: row.activation_url || '',
    activation_expires_at: row.activation_expires_at || '',
    email_sent: row.email_sent,
    email_skipped: Boolean(row.email_skipped),
    email_detail: row.email_detail || '',
    message: row.message || '',
  };
}

function extractOrgAdminRows(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (typeof payload !== 'object') return [];
  if (Array.isArray(payload.items)) return payload.items;
  // Legacy single-admin response
  if (payload.id || payload.email || payload.username || payload.first_name || payload.user_id) {
    return [payload];
  }
  return asArray(payload, ['tpos', 'users', 'org_admins', 'data']);
}

export async function getOrgAdmins() {
  const payload = await platformApi.get('/platform/tpo');
  const rows = asArray(payload, ['tpos', 'users', 'org_admins', 'items', 'data']);

  return rows
    .map((row) => {
      const normalized = normalizeTpo(row);
      if (!normalized) return null;
      return {
        ...normalized,
        organization_name: normalized.organization_name || '',
        organization_code: normalized.organization_code || '',
      };
    })
    .filter(Boolean)
    .sort((a, b) => Number(b.organization_id) - Number(a.organization_id));
}

/** List Org Admins for one org (up to 3 live titles). */
export async function getOrganizationAdmins(organizationId) {
  try {
    const payload = await platformApi.get(`/platform/organizations/${organizationId}/tpo`);
    return extractOrgAdminRows(payload)
      .map((row) => normalizeTpo(row, organizationId))
      .filter(Boolean);
  } catch (err) {
    const message = String(err?.message || '');
    if (/404|not found|no tpo|does not have|no org_admin/i.test(message)) {
      return [];
    }
    throw err;
  }
}

/** @deprecated Prefer getOrganizationAdmins — kept for single-admin callers. */
export async function getOrganizationTpo(organizationId) {
  const admins = await getOrganizationAdmins(organizationId);
  return admins[0] || null;
}

export async function createTpo(organizationId, payload) {
  const body = {
    ...payload,
    title: String(payload?.title || 'TPO').toUpperCase(),
  };
  const row = await platformApi.post(`/platform/organizations/${organizationId}/tpo`, body);
  emitUpdate();
  return normalizeTpo({ ...body, ...row }, organizationId) || row;
}

export async function updateTpo(organizationId, payload) {
  const body = { ...payload };
  if (body.title) body.title = String(body.title).toUpperCase();
  if (body.user_id == null && body.id != null) body.user_id = body.id;
  const row = await platformApi.put(`/platform/organizations/${organizationId}/tpo`, body);
  emitUpdate();
  return normalizeTpo({ ...body, ...row }, organizationId) || row;
}

export async function reinviteTpo(organizationId, userId) {
  const qs = userId != null ? `?user_id=${encodeURIComponent(userId)}` : '';
  const row = await platformApi.post(
    `/platform/organizations/${organizationId}/tpo/reinvite${qs}`
  );
  emitUpdate();
  return normalizeTpo(row, organizationId) || row;
}

export async function deactivateTpo(organizationId, userId) {
  const row = await platformApi.post(
    `/platform/organizations/${organizationId}/tpo/${userId}/deactivate`
  );
  emitUpdate();
  return normalizeTpo(row, organizationId) || row;
}

// ----- Individuals (PUBLIC students) -----

export async function getIndividuals({ q = '', status = '' } = {}) {
  const params = new URLSearchParams();
  if (q.trim()) params.set('q', q.trim());
  if (status.trim()) params.set('status', status.trim());
  const qs = params.toString();
  const payload = await platformApi.get(`/platform/individuals${qs ? `?${qs}` : ''}`);
  return {
    items: asArray(payload, ['items', 'individuals']),
    total: Number(payload?.total ?? 0),
  };
}

export async function createIndividual(payload) {
  const row = await platformApi.post('/platform/individuals', payload);
  emitUpdate();
  return row;
}

export async function reinviteIndividual(userId) {
  const row = await platformApi.post(`/platform/individuals/${userId}/reinvite`);
  emitUpdate();
  return row;
}

export async function blockIndividual(userId) {
  const row = await platformApi.post(`/platform/individuals/${userId}/block`);
  emitUpdate();
  return row;
}

export async function getPlatformUsers() {
  return asArray(await platformApi.get('/platform/users'), ['users', 'platform_users']);
}

export async function createPlatformUser(payload) {
  const row = await platformApi.post('/platform/users', payload);
  emitUpdate();
  return row;
}

export async function updatePlatformUser(id, payload) {
  const body = { ...payload };
  if (body.status) {
    const s = String(body.status).toUpperCase();
    body.status = s === 'SUSPENDED' || s === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
  }
  const row = await platformApi.put(`/platform/users/${id}`, body);
  emitUpdate();
  return row;
}

export async function updatePlatformUserStatus(id, status) {
  return updatePlatformUser(id, { status });
}

export async function deletePlatformUser(id) {
  const row = await platformApi.delete(`/platform/users/${id}`);
  emitUpdate();
  return row;
}

export async function getDashboardMetrics() {
  const data = await platformApi.get('/platform/dashboard');
  const orgCount = typeof data?.organizations === 'number' ? data.organizations : 0;
  const totalOrgs = orgCount;

  const featureUsageRaw = asArray(data?.feature_usage, ['items', 'data', 'features']);
  const featureUsage = featureUsageRaw.map((f) => ({
    feature_name: f.feature_name || f.name || f.feature_code || 'Feature',
    feature_code: f.feature_code || f.code || String(f.feature_id || f.id || ''),
    orgs_enabled: f.enabled_org_count || f.orgs_enabled || 0,
    pct:
      totalOrgs > 0
        ? Math.round(((f.enabled_org_count || f.orgs_enabled || 0) / totalOrgs) * 100)
        : 0,
  }));

  const recentOrgs = asArray(data?.recent_organizations || data?.recent_orgs, [
    'organizations',
  ])
    .map(normalizeOrganization)
    .filter(Boolean)
    .slice(0, 5);

  return {
    organizations: orgCount,
    studentsPurchased: data?.students_purchased || 0,
    studentsRegistered: data?.students_registered || 0,
    activePlans: data?.active_plans || 0,
    expiringThisMonth: data?.expiring_this_month || 0,
    featureUsage,
    recentOrgs,
  };
}
