/**
 * College list for Organization login.
 * GET /organizations/colleges (X-API-Key) — ACTIVE orgs only.
 * Never invent fake colleges when the API fails; DEMO only for offline/demo login.
 */

import { orgApi } from './orgApi';

const COLLEGE_STORAGE_KEY = 'mm-org-college-code';

/** Demo college only — used when API is offline so demo credentials still work. */
export const SAMPLE_COLLEGES = [
  {
    id: 'demo-org',
    name: 'MentorMuni Demo College',
    code: 'DEMO',
    city: 'Bengaluru',
    state: 'Karnataka',
    status: 'ACTIVE',
    organization_type: 'COLLEGE',
  },
];

function asItems(data) {
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.colleges)) return data.colleges;
  if (Array.isArray(data?.organizations)) return data.organizations;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}

export function normalizeCollege(row) {
  if (!row) return null;
  const code = String(row.code || row.organization_code || '').trim().toUpperCase();
  const name = String(row.name || row.organization_name || code || 'College').trim();
  return {
    id: row.id,
    name,
    code,
    city: row.city || '',
    state: row.state || '',
    status: String(row.status || '').toUpperCase(),
    organization_type: String(row.organization_type || '').toUpperCase(),
    label: code ? `${name} (${code})` : name,
  };
}

function toSortedList(rows) {
  return rows
    .map(normalizeCollege)
    .filter((c) => c?.code)
    // ACTIVE COLLEGE tenants only (contract: no plan/features required)
    .filter((c) => !c.status || c.status === 'ACTIVE')
    .filter((c) => {
      const t = c.organization_type;
      return !t || t === 'COLLEGE' || t === 'DEMO' || c.code === 'DEMO';
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function demoOnlyList() {
  return toSortedList(SAMPLE_COLLEGES);
}

/**
 * List colleges for login picker.
 * - API success → real ACTIVE colleges (+ DEMO if missing, for demo credentials)
 * - API empty → empty list with warning (not fake tenants)
 * - API failure → DEMO-only + warning so demo login still works
 */
export async function fetchLoginColleges() {
  const ensureDemo = (list) => {
    const hasDemo = list.some((c) => c.code === 'DEMO');
    if (hasDemo) return list;
    const demo = normalizeCollege(SAMPLE_COLLEGES[0]);
    return demo ? toSortedList([demo, ...list]) : list;
  };

  try {
    const data = await orgApi.get('/organizations/colleges', { auth: false });
    const list = toSortedList(asItems(data));
    if (list.length) {
      return {
        ok: true,
        colleges: ensureDemo(list),
        source: 'api',
        warning: '',
      };
    }
    return {
      ok: true,
      colleges: ensureDemo([]),
      source: 'api',
      warning:
        'No active colleges returned. If your organization was just created, confirm it is ACTIVE, then refresh.',
    };
  } catch (err) {
    return {
      ok: true,
      colleges: demoOnlyList(),
      source: 'offline',
      warning:
        err?.message ||
        'Could not load colleges from the server. Only the Demo college is available until the API responds.',
    };
  }
}

export function getSavedCollegeCode() {
  try {
    return String(localStorage.getItem(COLLEGE_STORAGE_KEY) || '').trim().toUpperCase();
  } catch {
    return '';
  }
}

export function saveCollegeCode(code) {
  try {
    const v = String(code || '').trim().toUpperCase();
    if (v) localStorage.setItem(COLLEGE_STORAGE_KEY, v);
  } catch {
    // ignore
  }
}

/**
 * Resolve initial college from URL (?code= / ?college= / ?org=) or saved code.
 */
export function pickInitialCollege(colleges, searchParams, { allowSaved = false } = {}) {
  const list = Array.isArray(colleges) ? colleges : [];
  const fromUrl = String(
    searchParams?.get?.('code') ||
      searchParams?.get?.('college') ||
      searchParams?.get?.('org') ||
      ''
  )
    .trim()
    .toUpperCase();

  const code = fromUrl || (allowSaved ? getSavedCollegeCode() : '');
  if (!code) return null;
  return list.find((c) => c.code === code || c.name.toUpperCase() === code) || null;
}
