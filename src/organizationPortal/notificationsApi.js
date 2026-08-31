/**
 * TPO campus notifications (events / workshops / announcements).
 * API-first. Local fallback only for demo sessions.
 *
 * POST/GET/DELETE /organizations/notifications
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

function parseDepartmentIds(row = {}) {
  const meta = row.metadata || row.metadata_json || row.raw?.metadata || {};
  const fromMeta = Array.isArray(meta.department_ids) ? meta.department_ids : [];
  const fromField = Array.isArray(row.department_ids)
    ? row.department_ids
    : Array.isArray(row.departmentIds)
      ? row.departmentIds
      : [];
  const merged = [...fromField, ...fromMeta];
  if (merged.length) {
    return [...new Set(merged.map((id) => String(id)).filter(Boolean))];
  }
  const single = row.department_id ?? row.departmentId;
  return single != null && single !== '' ? [String(single)] : [];
}

/** Normalize API / local row to UI shape. */
export function normalizeNotification(row = {}) {
  if (!row || typeof row !== 'object') return null;
  const kind = String(row.kind || 'event').toLowerCase();
  const audience = String(row.audience || 'all').toLowerCase();
  const title = String(row.title || row.company || '').trim();
  const departmentIds = parseDepartmentIds(row);

  return {
    id: row.id,
    kind: ['event', 'workshop', 'announcement'].includes(kind) ? kind : 'event',
    title,
    company: title, // legacy field for older metrics/UI
    message: String(row.message || row.body || '').trim(),
    date: row.date || row.event_date || '',
    audience: ['all', 'department', 'hods'].includes(audience) ? audience : 'all',
    departmentId: departmentIds[0] || '',
    departmentIds,
    deliveryStatus: String(row.delivery_status || row.deliveryStatus || row.status || 'scheduled').toLowerCase(),
    recipientsEstimated:
      row.recipients_estimated ?? row.recipientsEstimated ?? null,
    createdAt: row.created_at || row.createdAt || row.notifiedAt || '',
    createdBy: row.created_by || row.createdBy || null,
    status: row.status || 'scheduled',
    raw: row,
  };
}

function toApiBody(input) {
  const audience = String(input.audience || 'all').toLowerCase();
  const departmentIds = (input.departmentIds || input.department_ids || [])
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0);
  const legacyId = Number(input.departmentId || input.department_id) || null;
  const ids =
    audience === 'department'
      ? departmentIds.length
        ? departmentIds
        : legacyId
          ? [legacyId]
          : []
      : [];

  return {
    kind: String(input.kind || 'event').toLowerCase(),
    title: String(input.title || input.company || '').trim(),
    message: String(input.message || '').trim(),
    date: input.date || null,
    audience,
    department_id: ids[0] || null,
    department_ids: ids.length ? ids : undefined,
  };
}

function extractList(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  for (const key of ['items', 'notifications', 'data', 'results', 'drives']) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

export async function fetchNotifications() {
  if (allowLocalFallback()) {
    const list = (local.listDrives() || []).map(normalizeNotification).filter(Boolean);
    return withSource({ ok: true, notifications: list }, 'local');
  }

  try {
    const data = await orgApi.get('/organizations/notifications');
    const list = extractList(data).map(normalizeNotification).filter(Boolean);
    return withSource({ ok: true, notifications: list }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return {
        ok: false,
        error: err.message || 'Failed to load notifications.',
        notifications: [],
        source: 'error',
      };
    }
    return {
      ok: false,
      error: 'Notifications API is unavailable.',
      notifications: [],
      source: 'unavailable',
    };
  }
}

export async function createNotification(input) {
  const body = toApiBody(input);
  if (!body.title) {
    return { ok: false, error: 'Title is required.' };
  }
  if (!body.message) {
    return { ok: false, error: 'Message is required.' };
  }
  if (body.audience === 'department' && !(body.department_ids || []).length) {
    return { ok: false, error: 'Select at least one department.' };
  }
  if (body.date) {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (String(body.date).slice(0, 10) < today) {
      return { ok: false, error: 'Pick today or a future date.' };
    }
  }

  if (allowLocalFallback()) {
    local.createDrive({
      kind: body.kind,
      title: body.title,
      message: body.message,
      date: body.date || '',
      audience: body.audience,
      departmentId: body.department_id ? String(body.department_id) : '',
      departmentIds: (body.department_ids || []).map(String),
    });
    const latest = normalizeNotification(local.listDrives()[0]);
    return withSource(
      {
        ok: true,
        notification: latest,
        deliveryStatus: 'queued',
        recipientsEstimated: null,
        message: 'Demo notification saved locally (not emailed).',
      },
      'local'
    );
  }

  try {
    const row = await orgApi.post('/organizations/notifications', body);
    const notification = normalizeNotification({
      ...body,
      ...row,
      department_id: body.department_id,
      department_ids: body.department_ids,
    });
    return withSource(
      {
        ok: true,
        notification,
        deliveryStatus: row?.delivery_status || notification.deliveryStatus,
        recipientsEstimated: row?.recipients_estimated ?? notification.recipientsEstimated,
        message: row?.message || 'Notification queued.',
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to send notification.', status: err.status };
    }
    return {
      ok: false,
      error: 'Notifications API is unavailable. Deploy the campus notifications build, then retry.',
      source: 'unavailable',
    };
  }
}

export async function deleteNotification(id) {
  if (id == null || id === '') {
    return { ok: false, error: 'Missing notification id.' };
  }

  if (allowLocalFallback()) {
    local.removeDrive(id);
    return withSource({ ok: true }, 'local');
  }

  try {
    await orgApi.delete(`/organizations/notifications/${id}`);
    return withSource({ ok: true }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to delete notification.', status: err.status };
    }
    return {
      ok: false,
      error: 'Notifications API is unavailable.',
      source: 'unavailable',
    };
  }
}
