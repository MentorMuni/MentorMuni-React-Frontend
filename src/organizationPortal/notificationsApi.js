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

/** Normalize API / local row to UI shape. */
export function normalizeNotification(row = {}) {
  if (!row || typeof row !== 'object') return null;
  const kind = String(row.kind || 'event').toLowerCase();
  const audience = String(row.audience || 'all').toLowerCase();
  const title = String(row.title || row.company || '').trim();
  const departmentId = row.department_id ?? row.departmentId ?? '';

  return {
    id: row.id,
    kind: ['event', 'workshop', 'announcement'].includes(kind) ? kind : 'event',
    title,
    company: title, // legacy field for older metrics/UI
    message: String(row.message || '').trim(),
    date: row.date || '',
    audience: ['all', 'department', 'hods'].includes(audience) ? audience : 'all',
    departmentId: departmentId === null || departmentId === undefined ? '' : String(departmentId),
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
  const departmentId =
    audience === 'department' ? Number(input.departmentId || input.department_id) || null : null;

  return {
    kind: String(input.kind || 'event').toLowerCase(),
    title: String(input.title || input.company || '').trim(),
    message: String(input.message || '').trim(),
    date: input.date || null,
    audience,
    department_id: departmentId,
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
  if (body.audience === 'department' && !body.department_id) {
    return { ok: false, error: 'Select a department.' };
  }

  if (allowLocalFallback()) {
    local.createDrive({
      kind: body.kind,
      title: body.title,
      message: body.message,
      date: body.date || '',
      audience: body.audience,
      departmentId: body.department_id ? String(body.department_id) : '',
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
