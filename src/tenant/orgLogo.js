import { API_BASE } from '../config';

/**
 * Public college logo URL (no API key — safe for <img src>).
 * @param {number|string|null|undefined} organizationId
 * @param {{ updatedAt?: string|null }} [opts]
 */
export function organizationLogoUrl(organizationId, { updatedAt } = {}) {
  const id = Number(organizationId);
  if (!Number.isFinite(id) || id <= 0) return null;
  const base = `${API_BASE}/media/organizations/${id}/logo`;
  if (!updatedAt) return base;
  return `${base}?v=${encodeURIComponent(String(updatedAt))}`;
}
