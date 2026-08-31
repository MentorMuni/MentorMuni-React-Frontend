/**
 * Campus programs / assessment assignments.
 * API-first: POST/GET/DELETE /organizations/programs
 * Demo sessions keep using local store.
 */

import { orgApi, OrgApiError } from '../orgPortal/orgApi';
import { getOrgSession } from '../orgPortal/auth';
import { isDemoSession } from './demoAuth';
import * as local from './store';

function isMissingApi(err) {
  if (!(err instanceof OrgApiError)) return true;
  return err.status === 404 || err.status === 501 || err.status === 0;
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

function withSource(result, source) {
  return { ...result, source };
}

const LIVE_API_UNAVAILABLE =
  'Programs API is not available on the server yet. Deploy the latest MentorMuniAPI build, then sign out and sign in again.';

export function normalizeProgram(row = {}) {
  if (!row || typeof row !== 'object') return null;
  const audience = String(row.audience || 'all').toLowerCase();
  const meta = row.metadata || row.metadata_json || row.raw?.metadata || {};
  const fromMeta = Array.isArray(meta.department_ids) ? meta.department_ids : [];
  const fromField = Array.isArray(row.department_ids)
    ? row.department_ids
    : Array.isArray(row.departmentIds)
      ? row.departmentIds
      : [];
  const departmentIds = [...new Set(
    [...fromField, ...fromMeta].map((id) => String(id)).filter(Boolean)
  )];
  const legacyDept = row.department_id ?? row.departmentId;
  if (!departmentIds.length && legacyDept != null && legacyDept !== '') {
    departmentIds.push(String(legacyDept));
  }
  const studentIds = Array.isArray(row.student_ids)
    ? row.student_ids
    : Array.isArray(row.studentIds)
      ? row.studentIds
      : [];

  return {
    id: row.id,
    title: String(row.title || '').trim(),
    type: String(row.type || row.program_type || 'custom'),
    audience: ['all', 'department', 'student'].includes(audience) ? audience : 'all',
    departmentId: departmentIds[0] || '',
    departmentIds,
    studentIds: studentIds.map((id) => String(id)),
    dueInDays: Number(row.due_in_days ?? row.dueInDays ?? 7) || 7,
    dueDate: row.due_date || row.dueDate || null,
    status: String(row.status || 'active').toLowerCase(),
    deliveryStatus: String(row.delivery_status || row.deliveryStatus || 'queued').toLowerCase(),
    recipientsEstimated: row.recipients_estimated ?? row.recipientsEstimated ?? null,
    message: String(row.message || ''),
    createdAt: row.created_at || row.createdAt || '',
    createdBy: row.created_by ?? row.createdBy ?? null,
    raw: row,
  };
}

function extractList(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  for (const key of ['items', 'programs', 'data', 'results']) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

export async function fetchPrograms() {
  if (allowLocalFallback()) {
    const list = (local.listPrograms() || []).map(normalizeProgram).filter(Boolean);
    return withSource({ ok: true, programs: list }, 'local');
  }

  try {
    const data = await orgApi.get('/organizations/programs');
    const list = extractList(data).map(normalizeProgram).filter(Boolean);
    return withSource({ ok: true, programs: list }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return {
        ok: false,
        error: err.message || 'Failed to load programs.',
        programs: [],
        source: 'error',
      };
    }
    return {
      ok: false,
      error: LIVE_API_UNAVAILABLE,
      programs: [],
      source: 'unavailable',
    };
  }
}

export async function createProgramApi(input) {
  const title = String(input.title || '').trim();
  if (!title) return { ok: false, error: 'Program title is required.' };

  const audience = String(input.audience || 'all').toLowerCase();
  const departmentIds = (input.departmentIds || input.department_ids || [])
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0);
  const legacyDept = Number(input.departmentId || input.department_id) || null;
  const scopedDeptIds =
    audience === 'department'
      ? departmentIds.length
        ? departmentIds
        : legacyDept
          ? [legacyDept]
          : []
      : audience === 'student' && legacyDept
        ? [legacyDept]
        : [];
  const studentIds = (input.studentIds || input.student_ids || [])
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0);

  if (audience === 'department' && !scopedDeptIds.length) {
    return { ok: false, error: 'Select at least one department.' };
  }
  if (audience === 'student' && !studentIds.length) {
    return { ok: false, error: 'Select at least one student.' };
  }

  const localPayload = {
    title,
    type: input.type || 'custom',
    audience,
    departmentId: scopedDeptIds[0] ? String(scopedDeptIds[0]) : '',
    departmentIds: scopedDeptIds.map(String),
    studentIds: studentIds.map(String),
    dueInDays: Number(input.dueInDays ?? input.due_in_days ?? 7) || 7,
  };

  if (allowLocalFallback()) {
    local.createProgram(localPayload);
    const latest = normalizeProgram(local.listPrograms()[0]);
    return withSource(
      {
        ok: true,
        program: latest,
        message: 'Demo program saved in this browser (not delivered to students).',
      },
      'local'
    );
  }

  const body = {
    title,
    type: localPayload.type,
    audience,
    department_id: scopedDeptIds[0] || null,
    department_ids: audience === 'department' ? scopedDeptIds : undefined,
    student_ids: audience === 'student' ? studentIds : [],
    due_in_days: localPayload.dueInDays,
    message: input.message || null,
  };

  try {
    const row = await orgApi.post('/organizations/programs', body);
    const program = normalizeProgram(row?.program || row);
    return withSource(
      {
        ok: true,
        program,
        message: row?.message || 'Program assigned.',
        recipientsEstimated: program?.recipientsEstimated ?? row?.program?.recipients_estimated,
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to assign program.', status: err.status };
    }
    return { ok: false, error: LIVE_API_UNAVAILABLE, source: 'unavailable' };
  }
}

export async function deleteProgramApi(id) {
  if (id == null || id === '') return { ok: false, error: 'Missing program id.' };

  if (allowLocalFallback()) {
    local.removeProgram(id);
    return withSource({ ok: true }, 'local');
  }

  try {
    await orgApi.delete(`/organizations/programs/${encodeURIComponent(id)}`);
    return withSource({ ok: true }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to remove program.', status: err.status };
    }
    return { ok: false, error: LIVE_API_UNAVAILABLE, source: 'unavailable' };
  }
}
