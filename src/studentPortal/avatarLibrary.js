/**
 * Deterministic student avatars from a frontend palette library.
 * No uploads — same user always gets the same colors.
 */

/** @typedef {{ from: string, to: string, ink: string }} AvatarPalette */

/** @type {AvatarPalette[]} */
export const STUDENT_AVATAR_PALETTES = [
  { from: '#0e6fa8', to: '#0a5480', ink: '#ffffff' },
  { from: '#0d9488', to: '#0f766e', ink: '#ffffff' },
  { from: '#c2410c', to: '#9a3412', ink: '#ffffff' },
  { from: '#7c3aed', to: '#5b21b6', ink: '#ffffff' },
  { from: '#be185d', to: '#9d174d', ink: '#ffffff' },
  { from: '#0369a1', to: '#075985', ink: '#ffffff' },
  { from: '#15803d', to: '#166534', ink: '#ffffff' },
  { from: '#b45309', to: '#92400e', ink: '#ffffff' },
  { from: '#4f46e5', to: '#3730a3', ink: '#ffffff' },
  { from: '#0f766e', to: '#115e59', ink: '#ffffff' },
  { from: '#a21caf', to: '#86198f', ink: '#ffffff' },
  { from: '#1d4ed8', to: '#1e40af', ink: '#ffffff' },
];

function hashKey(raw) {
  const s = String(raw || 'student');
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * @param {{ id?: number|string, user_id?: number|string, email?: string, name?: string }|null|undefined} student
 * @returns {AvatarPalette}
 */
export function paletteForStudent(student) {
  const key =
    student?.id ??
    student?.user_id ??
    student?.email ??
    student?.name ??
    'student';
  const idx = hashKey(key) % STUDENT_AVATAR_PALETTES.length;
  return STUDENT_AVATAR_PALETTES[idx];
}

/**
 * CSS custom properties for `.stu-avatar`.
 * @param {{ id?: number|string, user_id?: number|string, email?: string, name?: string }|null|undefined} student
 */
export function avatarStyleForStudent(student) {
  const p = paletteForStudent(student);
  return {
    '--avatar-from': p.from,
    '--avatar-to': p.to,
    '--avatar-ink': p.ink,
  };
}

/**
 * @param {string|null|undefined} name
 */
export function initialsFromName(name) {
  const parts = String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (!parts.length) return 'ST';
  return parts.map((p) => p[0]).join('').toUpperCase();
}
