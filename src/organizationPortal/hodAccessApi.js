import { orgApi } from '../orgPortal/orgApi';

const KEYS = [
  'canInviteStudents',
  'canViewAllScores',
  'canAssignPrograms',
  'canNotifyDepartment',
  'canRunMocks',
];

export function normalizeHodAccess(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const out = {};
  KEYS.forEach((key) => {
    const snake = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
    const val = src[key] ?? src[snake];
    out[key] = val !== false;
  });
  return out;
}

export function hodAccessToApi(patch) {
  const out = {};
  Object.entries(patch || {}).forEach(([key, value]) => {
    const snake = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
    out[snake] = Boolean(value);
  });
  return out;
}

export async function fetchHodAccess() {
  const data = await orgApi.get('/organizations/hod-access');
  return normalizeHodAccess(data);
}

export async function saveHodAccess(patch) {
  const data = await orgApi.put('/organizations/hod-access', hodAccessToApi(patch));
  return normalizeHodAccess(data);
}
