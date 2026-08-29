/**
 * College tenant from hostname (medicaps.mentormuni.com → Medicaps).
 * Apex / www / reserved → null (individual + marketing).
 */

import { API_BASE } from '../config';

const API_KEY = import.meta.env.VITE_API_KEY || '';

export const RESERVED_SUBDOMAINS = new Set([
  'www',
  'app',
  'api',
  'admin',
  'platform',
  'mail',
  'ftp',
  'staging',
  'cdn',
  'static',
  'assets',
  'mentormuni',
  'public',
  'individual',
  'student',
  'students',
  'org',
  'organization',
  'tpo',
  'hod',
  'help',
  'status',
  'docs',
]);

const CACHE_KEY = 'mm-tenant-v1';

function normalizeSlug(raw) {
  const s = String(raw || '')
    .trim()
    .toLowerCase();
  if (!s || RESERVED_SUBDOMAINS.has(s)) return null;
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(s)) return null;
  return s;
}

/**
 * @returns {string|null} subdomain slug or null on apex
 */
export function hostnamePortalSlug(hostname = typeof window !== 'undefined' ? window.location.hostname : '') {
  const host = String(hostname || '')
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, '') // Strip port (e.g., medicaps.localhost:5173 → medicaps.localhost)
    .replace(/\.$/, '');
  if (!host) return null;

  // Local / IP — no tenant from host alone
  if (host === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(host)) return null;

  // *.mentormuni.com
  const mm = host.match(/^([a-z0-9-]+)\.mentormuni\.com$/i);
  if (mm) return normalizeSlug(mm[1]);

  // Local multi-tenant testing: medicaps.localhost
  const local = host.match(/^([a-z0-9-]+)\.localhost$/i);
  if (local) return normalizeSlug(local[1]);

  return null;
}

/**
 * Active college portal slug: hostname first; on local/dev allow ?slug= / ?portal= or VITE_DEV_PORTAL_SLUG.
 */
export function activePortalSlug() {
  const fromHost = hostnamePortalSlug();
  if (fromHost) return fromHost;

  if (typeof window === 'undefined') return null;

  const host = String(window.location.hostname || '').toLowerCase();
  const isLocal =
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    /^\d+\.\d+\.\d+\.\d+$/.test(host);

  if (!isLocal && !import.meta.env.DEV) return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const q = normalizeSlug(params.get('slug') || params.get('portal') || '');
    if (q) return q;
  } catch {
    /* ignore */
  }

  return normalizeSlug(import.meta.env.VITE_DEV_PORTAL_SLUG || '');
}

export function isCollegeTenantHost() {
  return Boolean(activePortalSlug());
}

export function apexOrigin() {
  if (typeof window === 'undefined') return 'https://www.mentormuni.com';
  const { protocol, hostname, port } = window.location;
  if (hostname.endsWith('mentormuni.com')) {
    return `${protocol}//www.mentormuni.com`;
  }
  if (hostname.endsWith('.localhost') || hostname === 'localhost') {
    const p = port ? `:${port}` : '';
    return `${protocol}//localhost${p}`;
  }
  return window.location.origin;
}

export function collegePortalOrigin(slug) {
  const s = String(slug || '')
    .trim()
    .toLowerCase();
  if (!s) return apexOrigin();
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    if (hostname.endsWith('mentormuni.com') || hostname.endsWith('.localhost') || hostname === 'localhost') {
      const base = hostname.endsWith('mentormuni.com') ? 'mentormuni.com' : 'localhost';
      const p = port && base === 'localhost' ? `:${port}` : '';
      return `${protocol}//${s}.${base}${p}`;
    }
  }
  return `https://${s}.mentormuni.com`;
}

export function readTenantCache(slug) {
  if (!slug) return null;
  try {
    const raw = sessionStorage.getItem(`${CACHE_KEY}:${slug}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readCache(slug) {
  return readTenantCache(slug);
}

function writeCache(slug, data) {
  try {
    sessionStorage.setItem(`${CACHE_KEY}:${slug}`, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

/**
 * @returns {Promise<null|{id:number,name:string,code:string,portal_slug:string,portal_url?:string,status:string}>}
 */
export async function resolveTenantFromHostname({ force = false } = {}) {
  const slug = activePortalSlug();
  if (!slug) return null;

  const cached = readCache(slug);
  if (!force && cached?.code && cached?.name) return cached;

  const res = await fetch(
    `${API_BASE}/organizations/colleges/by-slug/${encodeURIComponent(slug)}`,
    {
      headers: {
        'X-API-Key': API_KEY,
        Accept: 'application/json',
      },
    }
  );
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = String(body?.detail || body?.message || '').trim();
    } catch {
      /* ignore */
    }
    const err = new Error(
      detail ||
        (res.status === 404
          ? 'This college portal was not found.'
          : 'Could not load college portal.')
    );
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const tenant = {
    id: data.id,
    name: data.name,
    code: data.code,
    portal_slug: data.portal_slug || slug,
    portal_url: data.portal_url || collegePortalOrigin(slug),
    status: data.status || 'ACTIVE',
  };
  writeCache(slug, tenant);
  return tenant;
}

/** Path on current host (preserves college subdomain). */
export function tenantPortalPath(path) {
  const p = String(path || '').trim();
  if (!p) return '/';
  const normalized = p.startsWith('/') ? p : `/${p}`;
  if (typeof window === 'undefined') return normalized;
  return `${window.location.origin}${normalized}`;
}

/** Apex → college subdomain (full navigation). */
export function redirectToCollegePortal(slug, path = '/') {
  const target = `${collegePortalOrigin(slug)}${path.startsWith('/') ? path : `/${path}`}`;
  if (typeof window !== 'undefined') {
    window.location.assign(target);
  }
  return target;
}
