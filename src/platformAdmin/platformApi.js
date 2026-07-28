const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  '';

const API_KEY = import.meta.env.VITE_API_KEY || '';
const TOKEN_KEY = 'mm-platform-admin-token';

function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token) {
  try {
    if (!token) localStorage.removeItem(TOKEN_KEY);
    else localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore storage issues
  }
}

function buildHeaders(includeAuth = true) {
  const token = getToken();
  return {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
    ...(includeAuth && token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseResponse(res) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.detail || data?.message || text || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

async function request(method, path, { body, auth = true } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: buildHeaders(auth),
    body: body ? JSON.stringify(body) : undefined,
  });
  return parseResponse(res);
}

export const platformApi = {
  baseUrl: BASE_URL,
  key: API_KEY,
  getToken,
  setToken,
  clearToken: () => setToken(null),
  get: (path, opts) => request('GET', path, opts),
  post: (path, body, opts = {}) => request('POST', path, { ...opts, body }),
  put: (path, body, opts = {}) => request('PUT', path, { ...opts, body }),
};

