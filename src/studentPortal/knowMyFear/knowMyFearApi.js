import { studentApi, StudentApiError } from '../studentApi';

export { StudentApiError };

export async function fetchFearCatalog() {
  return studentApi.get('/student/know-my-fear/catalog');
}

/**
 * Private reflection — server does not persist to org/roadmap tables.
 * @param {{ fear_ids: { id: string, intensity?: number }[], free_text?: string }} body
 */
export async function reflectOnFears(body) {
  return studentApi.post('/student/know-my-fear/reflect', body || {});
}

const LOCAL_KEY = 'mm-know-my-fear-last';

/** Device-only cache so a refresh can show the last letter. Never sent to org APIs. */
export function saveLocalReflection(payload) {
  try {
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify({ savedAt: Date.now(), ...payload })
    );
  } catch {
    /* private / storage blocked */
  }
}

export function loadLocalReflection() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearLocalReflection() {
  try {
    localStorage.removeItem(LOCAL_KEY);
  } catch {
    /* ignore */
  }
}
