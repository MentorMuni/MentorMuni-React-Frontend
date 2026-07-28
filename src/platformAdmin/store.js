import { platformApi } from './platformApi';

export const PLATFORM_ROLES = ['PLATFORM_ADMIN', 'SUPPORT', 'SALES', 'OPERATIONS'];

export const PLANS = [
  { id: 1, name: 'Starter', defaultLimit: 200 },
  { id: 2, name: 'Growth', defaultLimit: 800 },
  { id: 3, name: 'Enterprise', defaultLimit: 1500 },
];

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

  for (const key of ['items', 'data', 'results', 'rows', 'organizations', 'subscriptions', 'users', 'features', 'plans']) {
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
  return v === 'SUSPENDED' ? 'Suspended' : 'Active';
}

function apiStatus(value) {
  return String(value || '').toUpperCase() === 'SUSPENDED' || value === 'Suspended'
    ? 'SUSPENDED'
    : 'ACTIVE';
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
  const row = await platformApi.put(`/platform/organizations/${id}`, {
    ...patch,
    ...(patch.organization_type ? { organization_type: apiOrgType(patch.organization_type) } : {}),
    ...(patch.status ? { status: apiStatus(patch.status) } : {}),
  });
  emitUpdate();
  return normalizeOrganization(row);
}

export async function getSubscriptionPlans() {
  const rows = asArray(await platformApi.get('/subscription-plans', { auth: false }), ['plans']);
  return rows.map((p) => ({
    id: p.id,
    name: p.name || p.plan_name,
    defaultLimit: p.default_student_limit || p.student_limit || 100,
    plan_type: p.plan_type,
  }));
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

export async function assignSubscription(payload) {
  let planId = payload.plan_id;
  if (!planId && payload.plan_name) {
    const plans = await getSubscriptionPlans();
    const matched = plans.find((p) => p.name === payload.plan_name);
    if (matched) planId = matched.id;
  }
  if (!planId) throw new Error('Unable to resolve plan_id for subscription.');

  const row = await platformApi.post('/platform/subscriptions', {
    organization_id: Number(payload.organization_id),
    plan_id: Number(planId),
    student_limit: Number(payload.student_limit),
    start_date: payload.start_date,
    end_date: payload.end_date,
    status: payload.status || 'ACTIVE',
  });
  emitUpdate();
  return row;
}

export async function updateSubscription(id, patch) {
  const row = await platformApi.put(`/platform/subscriptions/${id}`, patch);
  emitUpdate();
  return row;
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

export async function getOrgAdmins() {
  // Backend does not expose org users list in current checklist.
  // Return empty until endpoint is available.
  return [];
}

export async function createTpo(organizationId, payload) {
  const row = await platformApi.post(`/platform/organizations/${organizationId}/tpo`, payload);
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
  const row = await platformApi.put(`/platform/users/${id}`, payload);
  emitUpdate();
  return row;
}

export async function updatePlatformUserStatus(id, status) {
  return updatePlatformUser(id, { status });
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
