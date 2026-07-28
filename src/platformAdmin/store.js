/**
 * MentorMuni Platform Admin — local data store (tables)
 * Mirrors the SaaS tenant schema. Swap for API later.
 */

const STORE_KEY = 'mm-platform-admin-db-v1';

export const FEATURE_CATALOG_SEED = [
  { id: 1, feature_code: 'resume_ats', feature_name: 'Resume ATS', category: 'Tools', description: 'ATS resume scoring and keyword analysis', status: 'ACTIVE' },
  { id: 2, feature_code: 'skill_readiness', feature_name: 'Skill Readiness', category: 'Assessment', description: 'Skill gap and readiness scoring', status: 'ACTIVE' },
  { id: 3, feature_code: 'aptitude_readiness', feature_name: 'Aptitude Readiness', category: 'Assessment', description: 'Aptitude and speed benchmarks', status: 'ACTIVE' },
  { id: 4, feature_code: 'ai_mentor', feature_name: 'AI Mentor', category: 'AI', description: '24×7 AI placement mentor', status: 'ACTIVE' },
  { id: 5, feature_code: 'ai_mock', feature_name: 'AI Mock Interview', category: 'AI', description: 'Voice and text mock interviews', status: 'ACTIVE' },
  { id: 6, feature_code: 'coding', feature_name: 'Coding', category: 'Assessment', description: 'Coding round practice and scoring', status: 'ACTIVE' },
  { id: 7, feature_code: 'industry_interview', feature_name: 'Industry Interview', category: 'Mentorship', description: 'Industry mentor interview rounds', status: 'ACTIVE' },
  { id: 8, feature_code: 'assignments', feature_name: 'Assignments', category: 'Learning', description: 'Structured assignment workflows', status: 'ACTIVE' },
  { id: 9, feature_code: 'competitions', feature_name: 'Competitions', category: 'Engagement', description: 'Campus competitions and leaderboards', status: 'ACTIVE' },
];

export const PLANS = [
  { id: 'starter', name: 'Starter', defaultLimit: 200 },
  { id: 'growth', name: 'Growth', defaultLimit: 800 },
  { id: 'enterprise', name: 'Enterprise', defaultLimit: 1500 },
  { id: 'campus', name: 'Campus Unlimited', defaultLimit: 5000 },
];

export const PLATFORM_ROLES = ['Platform Admin', 'Support', 'Sales', 'Operations'];

function uid() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function nowIso() {
  return new Date().toISOString();
}

function defaultDb() {
  return {
    organizations: [
      {
        id: 101,
        name: 'Medicaps University',
        code: 'MEDICAPS',
        organization_type: 'College',
        status: 'Active',
        contact_person: 'Dr. Ananya Sharma',
        contact_email: 'tpo@medicaps.ac.in',
        contact_phone: '+91 98765 43210',
        address: 'A.B. Road',
        city: 'Indore',
        state: 'Madhya Pradesh',
        country: 'India',
        created_at: '2025-11-02T10:00:00.000Z',
        updated_at: '2025-11-02T10:00:00.000Z',
      },
      {
        id: 102,
        name: 'IIST Indore',
        code: 'IIST',
        organization_type: 'College',
        status: 'Active',
        contact_person: 'Prof. Rohit Mehta',
        contact_email: 'placement@iist.ac.in',
        contact_phone: '+91 91234 56780',
        address: 'Rau',
        city: 'Indore',
        state: 'Madhya Pradesh',
        country: 'India',
        created_at: '2025-12-14T08:30:00.000Z',
        updated_at: '2025-12-14T08:30:00.000Z',
      },
    ],
    subscriptions: [
      {
        id: 201,
        organization_id: 101,
        plan_name: 'Enterprise',
        student_limit: 1500,
        used_students: 1180,
        start_date: '2026-01-01',
        end_date: '2026-12-31',
        status: 'ACTIVE',
        created_at: '2025-11-02T10:05:00.000Z',
      },
      {
        id: 202,
        organization_id: 102,
        plan_name: 'Growth',
        student_limit: 800,
        used_students: 640,
        start_date: '2026-01-01',
        end_date: '2026-07-31',
        status: 'ACTIVE',
        created_at: '2025-12-14T08:35:00.000Z',
      },
    ],
    feature_catalog: FEATURE_CATALOG_SEED,
    organization_features: [
      { id: 301, organization_id: 101, feature_id: 1, enabled: true, configuration_json: {}, created_at: '2025-11-02T10:10:00.000Z' },
      { id: 302, organization_id: 101, feature_id: 2, enabled: true, configuration_json: {}, created_at: '2025-11-02T10:10:00.000Z' },
      { id: 303, organization_id: 101, feature_id: 4, enabled: true, configuration_json: {}, created_at: '2025-11-02T10:10:00.000Z' },
      { id: 304, organization_id: 101, feature_id: 5, enabled: true, configuration_json: {}, created_at: '2025-11-02T10:10:00.000Z' },
      { id: 305, organization_id: 101, feature_id: 6, enabled: false, configuration_json: {}, created_at: '2025-11-02T10:10:00.000Z' },
      { id: 306, organization_id: 101, feature_id: 8, enabled: true, configuration_json: {}, created_at: '2025-11-02T10:10:00.000Z' },
      { id: 307, organization_id: 102, feature_id: 1, enabled: true, configuration_json: {}, created_at: '2025-12-14T08:40:00.000Z' },
      { id: 308, organization_id: 102, feature_id: 4, enabled: true, configuration_json: {}, created_at: '2025-12-14T08:40:00.000Z' },
      { id: 309, organization_id: 102, feature_id: 5, enabled: true, configuration_json: {}, created_at: '2025-12-14T08:40:00.000Z' },
      { id: 310, organization_id: 102, feature_id: 6, enabled: false, configuration_json: {}, created_at: '2025-12-14T08:40:00.000Z' },
    ],
    users: [
      {
        id: 401,
        organization_id: 101,
        department_id: null,
        role_id: 'ORG_ADMIN',
        first_name: 'Ananya',
        last_name: 'Sharma',
        email: 'tpo@medicaps.ac.in',
        mobile: '+91 98765 43210',
        username: 'medicaps.tpo',
        password_hash: null,
        activation_token: 'mm-act-medicaps-demo',
        activation_status: 'PENDING',
        status: 'ACTIVE',
        approved_by: 1,
        approved_at: '2025-11-02T10:20:00.000Z',
        created_at: '2025-11-02T10:20:00.000Z',
        updated_at: '2025-11-02T10:20:00.000Z',
      },
    ],
    platform_users: [
      {
        id: 1,
        name: 'MentorMuni Super Admin',
        email: 'mentormuniteam@gmail.com',
        password_hash: 'MentorMuni@1234',
        role: 'Platform Admin',
        status: 'ACTIVE',
        created_at: '2025-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        name: 'Priya Kapoor',
        email: 'priya.support@mentormuni.com',
        password_hash: '••••••••',
        role: 'Support',
        status: 'ACTIVE',
        created_at: '2025-06-12T00:00:00.000Z',
      },
      {
        id: 3,
        name: 'Arjun Desai',
        email: 'arjun.sales@mentormuni.com',
        password_hash: '••••••••',
        role: 'Sales',
        status: 'ACTIVE',
        created_at: '2025-08-01T00:00:00.000Z',
      },
    ],
  };
}

function readDb() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      const seed = defaultDb();
      localStorage.setItem(STORE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.feature_catalog?.length) parsed.feature_catalog = FEATURE_CATALOG_SEED;
    return parsed;
  } catch {
    const seed = defaultDb();
    localStorage.setItem(STORE_KEY, JSON.stringify(seed));
    return seed;
  }
}

function writeDb(db) {
  localStorage.setItem(STORE_KEY, JSON.stringify(db));
  window.dispatchEvent(new CustomEvent('mm-platform-db-updated'));
  return db;
}

export function getDb() {
  return readDb();
}

export function resetPlatformDb() {
  const seed = defaultDb();
  writeDb(seed);
  return seed;
}

export function getOrganizations() {
  return [...readDb().organizations].sort((a, b) => b.id - a.id);
}

export function getOrganizationById(id) {
  return readDb().organizations.find((o) => o.id === Number(id)) || null;
}

export function createOrganization(payload) {
  const db = readDb();
  const code = String(payload.code || '').trim().toUpperCase();
  if (db.organizations.some((o) => o.code === code)) {
    throw new Error(`Organization code "${code}" already exists.`);
  }
  const row = {
    id: uid(),
    name: payload.name.trim(),
    code,
    organization_type: payload.organization_type,
    status: payload.status || 'Active',
    contact_person: payload.contact_person?.trim() || '',
    contact_email: payload.contact_email?.trim() || '',
    contact_phone: payload.contact_phone?.trim() || '',
    address: payload.address?.trim() || '',
    city: payload.city?.trim() || '',
    state: payload.state?.trim() || '',
    country: payload.country?.trim() || 'India',
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  db.organizations.push(row);
  writeDb(db);
  return row;
}

export function updateOrganization(id, patch) {
  const db = readDb();
  const idx = db.organizations.findIndex((o) => o.id === Number(id));
  if (idx < 0) throw new Error('Organization not found.');
  db.organizations[idx] = {
    ...db.organizations[idx],
    ...patch,
    updated_at: nowIso(),
  };
  writeDb(db);
  return db.organizations[idx];
}

export function getSubscriptions() {
  return [...readDb().subscriptions].sort((a, b) => b.id - a.id);
}

export function getSubscriptionForOrg(organizationId) {
  return (
    readDb().subscriptions.find(
      (s) => s.organization_id === Number(organizationId) && s.status === 'ACTIVE'
    ) || null
  );
}

export function assignSubscription(payload) {
  const db = readDb();
  const existing = db.subscriptions.find(
    (s) => s.organization_id === Number(payload.organization_id) && s.status === 'ACTIVE'
  );
  if (existing) existing.status = 'REPLACED';

  const row = {
    id: uid(),
    organization_id: Number(payload.organization_id),
    plan_name: payload.plan_name,
    student_limit: Number(payload.student_limit),
    used_students: Number(payload.used_students || 0),
    start_date: payload.start_date,
    end_date: payload.end_date,
    status: payload.status || 'ACTIVE',
    created_at: nowIso(),
  };
  db.subscriptions.push(row);
  writeDb(db);
  return row;
}

export function getFeatureCatalog() {
  return readDb().feature_catalog;
}

export function getOrgFeatures(organizationId) {
  const db = readDb();
  const orgId = Number(organizationId);
  return db.feature_catalog.map((feature) => {
    const link = db.organization_features.find(
      (f) => f.organization_id === orgId && f.feature_id === feature.id
    );
    return {
      ...feature,
      enabled: Boolean(link?.enabled),
      link_id: link?.id || null,
      configuration_json: link?.configuration_json || {},
    };
  });
}

export function saveOrgFeatures(organizationId, enabledMap) {
  const db = readDb();
  const orgId = Number(organizationId);
  db.feature_catalog.forEach((feature) => {
    const enabled = Boolean(enabledMap[feature.id]);
    const idx = db.organization_features.findIndex(
      (f) => f.organization_id === orgId && f.feature_id === feature.id
    );
    if (idx >= 0) {
      db.organization_features[idx].enabled = enabled;
    } else {
      db.organization_features.push({
        id: uid(),
        organization_id: orgId,
        feature_id: feature.id,
        enabled,
        configuration_json: {},
        created_at: nowIso(),
      });
    }
  });
  writeDb(db);
  return getOrgFeatures(orgId);
}

export function getOrgAdmins() {
  return readDb().users.filter((u) => u.role_id === 'ORG_ADMIN');
}

export function createTpo(payload) {
  const db = readDb();
  const email = payload.email.trim().toLowerCase();
  if (db.users.some((u) => u.email === email)) {
    throw new Error('A user with this email already exists.');
  }
  const token = `mm-act-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
  const row = {
    id: uid(),
    organization_id: Number(payload.organization_id),
    department_id: null,
    role_id: 'ORG_ADMIN',
    first_name: payload.first_name.trim(),
    last_name: payload.last_name.trim(),
    email,
    mobile: payload.mobile?.trim() || '',
    username: payload.username.trim(),
    password_hash: null,
    activation_token: token,
    activation_status: 'PENDING',
    status: 'ACTIVE',
    approved_by: 1,
    approved_at: nowIso(),
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  db.users.push(row);
  writeDb(db);
  return row;
}

export function getPlatformUsers() {
  return [...readDb().platform_users].sort((a, b) => a.id - b.id);
}

export function createPlatformUser(payload) {
  const db = readDb();
  const email = payload.email.trim().toLowerCase();
  if (db.platform_users.some((u) => u.email === email)) {
    throw new Error('Platform user email already exists.');
  }
  const row = {
    id: uid(),
    name: payload.name.trim(),
    email,
    password_hash: '••••••••',
    role: payload.role,
    status: payload.status || 'ACTIVE',
    created_at: nowIso(),
  };
  db.platform_users.push(row);
  writeDb(db);
  return row;
}

export function updatePlatformUserStatus(id, status) {
  const db = readDb();
  const idx = db.platform_users.findIndex((u) => u.id === Number(id));
  if (idx < 0) throw new Error('User not found.');
  db.platform_users[idx].status = status;
  writeDb(db);
  return db.platform_users[idx];
}

export function getDashboardMetrics() {
  const db = readDb();
  const orgs = db.organizations;
  const subs = db.subscriptions.filter((s) => s.status === 'ACTIVE');
  const studentsPurchased = subs.reduce((sum, s) => sum + Number(s.student_limit || 0), 0);
  const studentsRegistered = subs.reduce((sum, s) => sum + Number(s.used_students || 0), 0);

  const now = new Date();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const expiringThisMonth = subs.filter((s) => {
    const end = new Date(s.end_date);
    return end >= now && end <= monthEnd;
  }).length;

  const featureUsage = db.feature_catalog.map((f) => {
    const enabledCount = db.organization_features.filter(
      (of) => of.feature_id === f.id && of.enabled
    ).length;
    return {
      feature_name: f.feature_name,
      feature_code: f.feature_code,
      orgs_enabled: enabledCount,
      pct: orgs.length ? Math.round((enabledCount / orgs.length) * 100) : 0,
    };
  });

  return {
    organizations: orgs.length,
    studentsPurchased,
    studentsRegistered,
    activePlans: subs.length,
    expiringThisMonth,
    featureUsage,
    recentOrgs: [...orgs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
  };
}
