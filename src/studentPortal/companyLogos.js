/**
 * Real company marks for campus drives.
 *
 * Only companies with an asset in public/companies are mapped —
 * anything else falls back to a two-letter monogram, which reads as
 * deliberate rather than broken. SVG is preferred where both exist.
 */

const BASE = `${import.meta.env.BASE_URL}companies/`;

const LOGOS = {
  tcs: 'tcs.svg',
  'tata consultancy services': 'tcs.svg',
  infosys: 'infosys.svg',
  wipro: 'wipro.svg',
  microsoft: 'microsoft.png',
  nagarro: 'nagarro.png',
  persistent: 'persistent.png',
  'persistent systems': 'persistent.png',
};

function normalise(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/\b(pvt|private|ltd|limited|inc|llp|technologies|solutions)\b/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** @returns {string|null} asset URL, or null to use the monogram. */
export function companyLogo(name) {
  const file = LOGOS[normalise(name)];
  return file ? `${BASE}${file}` : null;
}

/** Two-letter fallback mark. */
export function companyMonogram(name) {
  const clean = String(name || '').trim();
  if (!clean) return '??';
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}
