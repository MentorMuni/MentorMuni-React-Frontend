/**
 * College list for Organization login.
 * GET /organizations/colleges (X-API-Key) — same auth headers as other org APIs.
 * Falls back to SAMPLE_COLLEGES when the endpoint is unavailable.
 */

import { orgApi } from './orgApi';

const COLLEGE_STORAGE_KEY = 'mm-org-college-code';

/** Temporary sample list until GET /organizations/colleges is live. */
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
  {
    id: 1001,
    name: 'National Institute of Technology, Trichy',
    code: 'NITT',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    status: 'ACTIVE',
    organization_type: 'COLLEGE',
  },
  {
    id: 1002,
    name: 'Indian Institute of Technology Madras',
    code: 'IITM',
    city: 'Chennai',
    state: 'Tamil Nadu',
    status: 'ACTIVE',
    organization_type: 'COLLEGE',
  },
  {
    id: 1003,
    name: 'PSG College of Technology',
    code: 'PSGCT',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    status: 'ACTIVE',
    organization_type: 'COLLEGE',
  },
  {
    id: 1004,
    name: 'Vellore Institute of Technology',
    code: 'VIT',
    city: 'Vellore',
    state: 'Tamil Nadu',
    status: 'ACTIVE',
    organization_type: 'COLLEGE',
  },
  {
    id: 1005,
    name: 'College of Engineering, Pune',
    code: 'COEP',
    city: 'Pune',
    state: 'Maharashtra',
    status: 'ACTIVE',
    organization_type: 'COLLEGE',
  },
  {
    id: 1006,
    name: 'Birla Institute of Technology and Science, Pilani',
    code: 'BITS',
    city: 'Pilani',
    state: 'Rajasthan',
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
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * List colleges for login picker.
 * Uses GET /organizations/colleges with X-API-Key (auth: false — no Bearer yet).
 * On failure or empty response, returns SAMPLE_COLLEGES so the gate still works.
 */
export async function fetchLoginColleges() {
  const ensureDemo = (list) => {
    const hasDemo = list.some((c) => c.code === 'DEMO');
    if (hasDemo) return list;
    const demo = normalizeCollege(SAMPLE_COLLEGES.find((c) => c.code === 'DEMO'));
    return demo ? toSortedList([demo, ...list]) : list;
  };

  try {
    const data = await orgApi.get('/organizations/colleges', { auth: false });
    const list = toSortedList(asItems(data));
    if (list.length) {
      return { ok: true, colleges: ensureDemo(list), source: 'api' };
    }
  } catch {
    // Endpoint not ready / auth failure — use sample data below.
  }

  return {
    ok: true,
    colleges: toSortedList(SAMPLE_COLLEGES),
    source: 'sample',
  };
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
 * Resolve initial college from URL only (?code= / ?college= / ?org=).
 * Does not auto-pick from the list or localStorage — dropdown stays on placeholder.
 */
export function pickInitialCollege(colleges, searchParams) {
  const list = Array.isArray(colleges) ? colleges : [];
  const fromUrl = String(
    searchParams?.get?.('code') ||
      searchParams?.get?.('college') ||
      searchParams?.get?.('org') ||
      ''
  )
    .trim()
    .toUpperCase();

  if (!fromUrl) return null;
  return list.find((c) => c.code === fromUrl || c.name.toUpperCase() === fromUrl) || null;
}
