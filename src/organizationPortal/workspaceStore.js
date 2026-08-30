/**
 * Personal TPO workspace (todos / notes / reminders).
 * Stored per user in localStorage — private to this browser/account until a sync API exists.
 */

import { getOrgSession } from '../orgPortal';

const DB_KEY = 'mm-org-personal-workspace-v1';
const EVENT = 'mm-org-workspace-updated';

function uid() {
  return `ws_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function storageKey() {
  const s = getOrgSession();
  const org = s?.organization_id || s?.organization_code || 'org';
  const user = s?.id || s?.email || s?.username || 'anon';
  return `${org}:${user}`;
}

function readAll() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  window.dispatchEvent(new CustomEvent(EVENT));
}

function getItems() {
  const db = readAll();
  const list = db[storageKey()];
  return Array.isArray(list) ? list : [];
}

function setItems(items) {
  const db = readAll();
  db[storageKey()] = items;
  writeAll(db);
  return items;
}

export function listWorkspaceItems() {
  return getItems()
    .slice()
    .sort((a, b) => {
      if (Boolean(a.done) !== Boolean(b.done)) return a.done ? 1 : -1;
      const da = a.dueDate || '';
      const db_ = b.dueDate || '';
      if (da && db_ && da !== db_) return da.localeCompare(db_);
      if (da && !db_) return -1;
      if (!da && db_) return 1;
      return String(b.updatedAt || b.createdAt || '').localeCompare(
        String(a.updatedAt || a.createdAt || '')
      );
    });
}

export function createWorkspaceItem({ text, dueDate = '', kind = 'note' } = {}) {
  const body = String(text || '').trim();
  if (!body) throw new Error('Write something first.');
  const now = new Date().toISOString();
  const item = {
    id: uid(),
    text: body,
    dueDate: dueDate || '',
    kind: ['todo', 'note', 'reminder'].includes(kind) ? kind : 'todo',
    done: false,
    createdAt: now,
    updatedAt: now,
  };
  setItems([item, ...getItems()]);
  return item;
}

export function updateWorkspaceItem(id, patch = {}) {
  if (id == null || id === '') throw new Error('Missing item id.');
  const target = String(id);
  let found = null;
  const next = getItems().map((item) => {
    if (String(item.id) !== target) return item;
    const text =
      patch.text !== undefined ? String(patch.text).trim() : item.text;
    if (!text) throw new Error('Text cannot be empty.');
    found = {
      ...item,
      text,
      dueDate: patch.dueDate !== undefined ? patch.dueDate || '' : item.dueDate,
      kind: patch.kind || item.kind,
      done: patch.done !== undefined ? Boolean(patch.done) : item.done,
      updatedAt: new Date().toISOString(),
    };
    return found;
  });
  if (!found) throw new Error('Item not found.');
  setItems(next);
  return found;
}

export function toggleWorkspaceItem(id) {
  const item = getItems().find((x) => x.id === id);
  if (!item) return null;
  return updateWorkspaceItem(id, { done: !item.done });
}

export function removeWorkspaceItem(id) {
  if (id == null || id === '') return false;
  const target = String(id);
  setItems(getItems().filter((item) => String(item.id) !== target));
  return true;
}

export function subscribeWorkspace(cb) {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
