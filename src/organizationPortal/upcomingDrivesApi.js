/**
 * Upcoming placement drives — Org Admin (TPO/Dean/Director) manage; HOD can list.
 *
 * GET    /organizations/upcoming-drives
 * POST   /organizations/upcoming-drives
 * PUT    /organizations/upcoming-drives/{id}
 * DELETE /organizations/upcoming-drives/{id}
 */

import { orgApi, OrgApiError } from '../orgPortal/orgApi';
import { getOrgSession } from '../orgPortal/auth';
import { isDemoSession } from './demoAuth';

const LOCAL_KEY = 'mm-org-upcoming-drives-v1';

export function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Today or future (YYYY-MM-DD). */
export function isUpcomingDate(iso) {
  if (!iso) return false;
  return String(iso).slice(0, 10) >= todayISO();
}

function allowLocalFallback() {
  const session = getOrgSession();
  if (isDemoSession(session)) return true;
  try {
    return String(orgApi.getToken?.() || '').startsWith('demo.');
  } catch {
    return false;
  }
}

function storageKey() {
  const s = getOrgSession();
  const org = s?.organization_id || s?.organization_code || 'org';
  return String(org);
}

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const db = raw ? JSON.parse(raw) : {};
    const list = db[storageKey()];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeLocal(items) {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const db = raw ? JSON.parse(raw) : {};
    db[storageKey()] = items;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(db));
  } catch {
    /* ignore */
  }
}

export function normalizeDrive(row = {}) {
  if (!row || typeof row !== 'object') return null;
  return {
    id: row.id,
    companyName: String(row.company_name || row.companyName || '').trim(),
    eligibilityCriteria: String(
      row.eligibility_criteria || row.eligibilityCriteria || ''
    ).trim(),
    driveDate: row.drive_date || row.driveDate || '',
    remark: String(row.remark || '').trim(),
    createdBy: row.created_by ?? row.createdBy ?? null,
    createdAt: row.created_at || row.createdAt || '',
    updatedAt: row.updated_at || row.updatedAt || '',
    raw: row,
  };
}

function toApiBody(input = {}) {
  const body = {};
  if (input.companyName !== undefined || input.company_name !== undefined) {
    body.company_name = String(input.companyName || input.company_name || '').trim();
  }
  if (
    input.eligibilityCriteria !== undefined ||
    input.eligibility_criteria !== undefined
  ) {
    body.eligibility_criteria = String(
      input.eligibilityCriteria || input.eligibility_criteria || ''
    ).trim();
  }
  if (input.driveDate !== undefined || input.drive_date !== undefined) {
    body.drive_date = input.driveDate || input.drive_date || null;
  }
  if (input.remark !== undefined) {
    const r = String(input.remark || '').trim();
    body.remark = r || null;
  }
  return body;
}

function extractList(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  for (const key of ['items', 'drives', 'data', 'results']) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

function sortDrives(list) {
  return (list || [])
    .slice()
    .sort((a, b) => {
      const da = a.driveDate || '';
      const db = b.driveDate || '';
      if (da !== db) return da.localeCompare(db);
      return String(b.id).localeCompare(String(a.id));
    });
}

function onlyUpcoming(list) {
  return sortDrives((list || []).filter((d) => isUpcomingDate(d?.driveDate)));
}

function withSource(result, source) {
  return { ...result, source };
}

function rejectPastDate(driveDate) {
  if (!driveDate) return 'Drive date is required.';
  if (!isUpcomingDate(driveDate)) {
    return 'Pick today or a future date for the drive.';
  }
  return null;
}

export async function fetchUpcomingDrives() {
  if (allowLocalFallback()) {
    return withSource(
      {
        ok: true,
        items: onlyUpcoming(readLocal().map(normalizeDrive).filter(Boolean)),
      },
      'local'
    );
  }

  try {
    const data = await orgApi.get('/organizations/upcoming-drives');
    const items = onlyUpcoming(
      extractList(data).map(normalizeDrive).filter(Boolean)
    );
    return withSource({ ok: true, items }, 'api');
  } catch (err) {
    const raw = String(err?.message || err || '').trim();
    const network =
      raw === 'Failed to fetch' ||
      raw === 'NetworkError when attempting to fetch resource.' ||
      err?.name === 'TypeError';
    if (err instanceof OrgApiError && (err.status === 403 || err.status === 401)) {
      return {
        ok: false,
        error: err.message || 'Not allowed.',
        items: [],
        source: 'error',
      };
    }
    return {
      ok: false,
      error: network
        ? 'Could not reach the server. If this keeps happening, ask your TPO to confirm the campus API is up to date.'
        : raw ||
          'Upcoming drives API is unavailable. Deploy backend routes, then retry.',
      items: [],
      source: 'unavailable',
    };
  }
}

export async function createUpcomingDrive(input) {
  const companyName = String(input?.companyName || '').trim();
  const eligibilityCriteria = String(input?.eligibilityCriteria || '').trim();
  const driveDate = input?.driveDate || '';
  if (!companyName) return { ok: false, error: 'Company name is required.' };
  if (!eligibilityCriteria) {
    return { ok: false, error: 'Eligibility criteria is required.' };
  }
  const dateErr = rejectPastDate(driveDate);
  if (dateErr) return { ok: false, error: dateErr };

  if (allowLocalFallback()) {
    const now = new Date().toISOString();
    const item = normalizeDrive({
      id: `ud_${Date.now().toString(36)}`,
      company_name: companyName,
      eligibility_criteria: eligibilityCriteria,
      drive_date: driveDate,
      remark: String(input?.remark || '').trim() || null,
      created_at: now,
      updated_at: now,
    });
    writeLocal([item, ...readLocal()]);
    return withSource({ ok: true, item }, 'local');
  }

  try {
    const body = toApiBody({
      companyName,
      eligibilityCriteria,
      driveDate,
      remark: input?.remark,
    });
    const row = await orgApi.post('/organizations/upcoming-drives', body);
    return withSource(
      { ok: true, item: normalizeDrive({ ...body, ...row }) },
      'api'
    );
  } catch (err) {
    return { ok: false, error: err.message || 'Unable to save drive.', status: err.status };
  }
}

export async function updateUpcomingDrive(id, patch) {
  if (id == null || id === '') return { ok: false, error: 'Missing drive id.' };

  if (patch?.driveDate !== undefined) {
    const dateErr = rejectPastDate(patch.driveDate);
    if (dateErr) return { ok: false, error: dateErr };
  }

  if (allowLocalFallback()) {
    const next = readLocal().map((row) => {
      const n = normalizeDrive(row);
      if (String(n.id) !== String(id)) return row;
      return {
        ...n,
        companyName:
          patch.companyName !== undefined ? String(patch.companyName).trim() : n.companyName,
        eligibilityCriteria:
          patch.eligibilityCriteria !== undefined
            ? String(patch.eligibilityCriteria).trim()
            : n.eligibilityCriteria,
        driveDate: patch.driveDate !== undefined ? patch.driveDate : n.driveDate,
        remark: patch.remark !== undefined ? String(patch.remark || '').trim() : n.remark,
        updatedAt: new Date().toISOString(),
      };
    });
    writeLocal(next);
    const item = next.map(normalizeDrive).find((x) => String(x.id) === String(id));
    return withSource({ ok: true, item }, 'local');
  }

  try {
    const body = toApiBody(patch);
    const row = await orgApi.put(`/organizations/upcoming-drives/${id}`, body);
    return withSource(
      { ok: true, item: normalizeDrive({ id, ...body, ...row }) },
      'api'
    );
  } catch (err) {
    return { ok: false, error: err.message || 'Unable to update.', status: err.status };
  }
}

export async function deleteUpcomingDrive(id) {
  if (id == null || id === '') return { ok: false, error: 'Missing drive id.' };

  if (allowLocalFallback()) {
    writeLocal(readLocal().filter((row) => String(normalizeDrive(row).id) !== String(id)));
    return withSource({ ok: true }, 'local');
  }

  try {
    await orgApi.delete(`/organizations/upcoming-drives/${id}`);
    return withSource({ ok: true }, 'api');
  } catch (err) {
    return { ok: false, error: err.message || 'Unable to remove.', status: err.status };
  }
}
