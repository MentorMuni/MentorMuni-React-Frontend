/**
 * Personal workspace (todos / notes / reminders) — API-first.
 * Scoped to the authenticated user (tenant JWT). Demo sessions stay local.
 *
 * GET    /organizations/workspace/items
 * POST   /organizations/workspace/items
 * PUT    /organizations/workspace/items/{id}
 * DELETE /organizations/workspace/items/{id}
 */

import { orgApi, OrgApiError } from '../orgPortal/orgApi';
import { getOrgSession } from '../orgPortal/auth';
import { isDemoSession } from './demoAuth';
import * as local from './workspaceStore';

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

export function normalizeWorkspaceItem(row = {}) {
  if (!row || typeof row !== 'object') return null;
  const kind = String(row.kind || 'todo').toLowerCase();
  return {
    id: row.id,
    text: String(row.text || row.body || row.content || '').trim(),
    dueDate: row.due_date || row.dueDate || '',
    kind: ['todo', 'note', 'reminder'].includes(kind) ? kind : 'todo',
    done: Boolean(row.done ?? row.is_done ?? row.completed),
    createdAt: row.created_at || row.createdAt || '',
    updatedAt: row.updated_at || row.updatedAt || '',
    raw: row,
  };
}

function toApiBody(input = {}) {
  const body = {};
  if (input.text !== undefined) body.text = String(input.text || '').trim();
  if (input.dueDate !== undefined || input.due_date !== undefined) {
    body.due_date = input.dueDate || input.due_date || null;
  }
  if (input.kind !== undefined) body.kind = String(input.kind || 'todo').toLowerCase();
  if (input.done !== undefined) body.done = Boolean(input.done);
  return body;
}

function extractList(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  for (const key of ['items', 'workspace_items', 'data', 'results']) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

function sortItems(list) {
  return (list || [])
    .slice()
    .sort((a, b) => {
      if (Boolean(a.done) !== Boolean(b.done)) return a.done ? 1 : -1;
      const da = a.dueDate || '';
      const db = b.dueDate || '';
      if (da && db && da !== db) return da.localeCompare(db);
      if (da && !db) return -1;
      if (!da && db) return 1;
      return String(b.updatedAt || b.createdAt || '').localeCompare(
        String(a.updatedAt || a.createdAt || '')
      );
    });
}

export async function fetchWorkspaceItems() {
  if (allowLocalFallback()) {
    return withSource(
      { ok: true, items: sortItems(local.listWorkspaceItems()) },
      'local'
    );
  }

  try {
    const data = await orgApi.get('/organizations/workspace/items');
    const items = sortItems(
      extractList(data).map(normalizeWorkspaceItem).filter(Boolean)
    );
    return withSource({ ok: true, items }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return {
        ok: false,
        error: err.message || 'Failed to load workspace.',
        items: [],
        source: 'error',
      };
    }
    return {
      ok: false,
      error:
        'Workspace API is unavailable. Ask backend to deploy personal workspace routes, then retry.',
      items: [],
      source: 'unavailable',
    };
  }
}

export async function createWorkspaceItemApi(input) {
  const text = String(input?.text || '').trim();
  if (!text) return { ok: false, error: 'Write something first.' };

  if (allowLocalFallback()) {
    try {
      const item = local.createWorkspaceItem(input);
      return withSource({ ok: true, item: normalizeWorkspaceItem(item) }, 'local');
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to save.' };
    }
  }

  try {
    const body = toApiBody({
      text,
      dueDate: input.dueDate || '',
      kind: input.dueDate ? 'reminder' : input.kind || 'todo',
      done: false,
    });
    const row = await orgApi.post('/organizations/workspace/items', body);
    return withSource(
      { ok: true, item: normalizeWorkspaceItem({ ...body, ...row }) },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to save.', status: err.status };
    }
    return {
      ok: false,
      error: 'Workspace API is unavailable.',
      source: 'unavailable',
    };
  }
}

export async function updateWorkspaceItemApi(id, patch) {
  if (id == null || id === '') return { ok: false, error: 'Missing item id.' };

  if (allowLocalFallback()) {
    try {
      const item = local.updateWorkspaceItem(id, patch);
      return withSource({ ok: true, item: normalizeWorkspaceItem(item) }, 'local');
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to update.' };
    }
  }

  try {
    const body = toApiBody(patch);
    const row = await orgApi.put(`/organizations/workspace/items/${id}`, body);
    return withSource(
      { ok: true, item: normalizeWorkspaceItem({ id, ...body, ...row }) },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to update.', status: err.status };
    }
    return {
      ok: false,
      error: 'Workspace API is unavailable.',
      source: 'unavailable',
    };
  }
}

export async function toggleWorkspaceItemApi(id, done) {
  return updateWorkspaceItemApi(id, { done: Boolean(done) });
}

export async function deleteWorkspaceItemApi(id) {
  if (id == null || id === '') return { ok: false, error: 'Missing item id.' };

  if (allowLocalFallback()) {
    local.removeWorkspaceItem(id);
    return withSource({ ok: true }, 'local');
  }

  try {
    await orgApi.delete(`/organizations/workspace/items/${id}`);
    return withSource({ ok: true }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to remove.', status: err.status };
    }
    return {
      ok: false,
      error: 'Workspace API is unavailable.',
      source: 'unavailable',
    };
  }
}
