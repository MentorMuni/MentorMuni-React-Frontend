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
  const rows = asArray(await platformApi.get('/platform/organizations'), ['organizations']);
  return rows.map(normalizeOrganization).sort((a, b) => b.id - a.id);
}

export async function getOrganizationById(id) {
  const row = await platformApi.get(`/platform/organizations/${id}`);
  return normalizeOrganization(row);
}

export async function createOrganization(payload) {
  const row = await platformApi.post('/platform/organizations', {
    ...payload,
    code: String(payload.code || '').toUpperCase(),
    organization_type: apiOrgType(payload.organization_type),
    status: apiStatus(payload.status),
  });
  emitUpdate();
  return normalizeOrganization(row);
}

export async function updateOrganization(id, patch) {
  const body = {
    ...patch,
    ...(patch.code != null ? { code: String(patch.code).toUpperCase() } : {}),
    ...(patch.organization_type ? { organization_type: apiOrgType(patch.organization_type) } : {}),
    ...(patch.status ? { status: apiStatus(patch.status) } : {}),
  };
  const row = await platformApi.put(`/platform/organizations/${id}`, body);
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

function normalizeTpo(row, organizationId, orgName) {
  if (!row || typeof row !== 'object') return null;
  const orgId = row.organization_id ?? row.org_id ?? organizationId;
  const status =
    row.activation_status ||
    row.status ||
    (row.activation_token ? 'PENDING' : 'ACTIVE');
  const nameParts = String(row.name || '').trim().split(/\s+/).filter(Boolean);

  return {
    id: row.id ?? `org-${orgId}-tpo`,
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

export async function getOrgAdmins() {
  const payload = await platformApi.get('/platform/tpo');
  const rows = asArray(payload, ['tpos', 'users', 'org_admins', 'items', 'data']);
  let orgById = {};
  try {
    const orgs = await getOrganizations();
    orgById = Object.fromEntries(orgs.map((o) => [String(o.id), o]));
  } catch {
    // list still usable without org name enrichment
  }

  return rows
    .map((row) => {
      const normalized = normalizeTpo(row);
      if (!normalized) return null;
      const org = orgById[String(normalized.organization_id)];
      return {
        ...normalized,
        organization_name: normalized.organization_name || org?.name || '',
        organization_code: normalized.organization_code || org?.code || '',
      };
    })
    .filter(Boolean)
    .sort((a, b) => Number(b.organization_id) - Number(a.organization_id));
}

export async function getOrganizationTpo(organizationId) {
  try {
    const row = await platformApi.get(`/platform/organizations/${organizationId}/tpo`);
    if (!row || typeof row !== 'object') return null;
    if (!row.id && !row.email && !row.username && !row.first_name) return null;
    return normalizeTpo(row, organizationId);
  } catch (err) {
    const message = String(err?.message || '');
    if (/404|not found|no tpo|does not have|no org_admin/i.test(message)) {
      return null;
    }
    throw err;
  }
}

export async function createTpo(organizationId, payload) {
  const row = await platformApi.post(`/platform/organizations/${organizationId}/tpo`, payload);
  emitUpdate();
  return normalizeTpo({ ...payload, ...row }, organizationId) || row;
}

export async function updateTpo(organizationId, payload) {
  const row = await platformApi.put(`/platform/organizations/${organizationId}/tpo`, payload);
  emitUpdate();
  return normalizeTpo({ ...payload, ...row }, organizationId) || row;
}

export async function reinviteTpo(organizationId) {
  const row = await platformApi.post(`/platform/organizations/${organizationId}/tpo/reinvite`);
  emitUpdate();
  return normalizeTpo(row, organizationId) || row;
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
  const organizationsList = await getOrganizations();
  const orgCount =
    typeof data?.organizations === 'number'
      ? data.organizations
      : organizationsList.length;
  const totalOrgs = orgCount || 1;

  const featureUsageRaw = asArray(data?.feature_usage, ['items', 'data', 'features']);
  const featureUsage = featureUsageRaw.map((f) => ({
    feature_name: f.feature_name || f.name || f.feature_code || 'Feature',
    feature_code: f.feature_code || f.code || String(f.feature_id || f.id || ''),
    orgs_enabled: f.enabled_org_count || f.orgs_enabled || 0,
    pct: Math.round(((f.enabled_org_count || f.orgs_enabled || 0) / totalOrgs) * 100),
  }));

  const recentFromDashboard = asArray(data?.recent_organizations || data?.recent_orgs, [
    'organizations',
  ]).map(normalizeOrganization);

  return {
    organizations: orgCount,
    studentsPurchased: data?.students_purchased || 0,
    studentsRegistered: data?.students_registered || 0,
    activePlans: data?.active_plans || 0,
    expiringThisMonth: data?.expiring_this_month || 0,
    featureUsage,
    recentOrgs: (recentFromDashboard.length ? recentFromDashboard : organizationsList).slice(0, 5),
  };
}
