/**
 * Org suspension message detection + UX mapping.
 * Trust API `detail` text; soft-rewrite only the CTA.
 */

export const ORG_SUSPENDED_FLASH_KEY = 'mm-org-auth-flash';

export const SUSPENDED_DETAIL = {
  student:
    "Your organization's access has ended. Please contact your TPO.",
  staff: 'This organization is suspended. Contact MentorMuni support.',
  registration: 'This organization is suspended. Registration is disabled.',
};

export function normalizeDetail(detail) {
  if (detail == null) return '';
  if (typeof detail === 'string') return detail.trim();
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') return item.msg || item.message || JSON.stringify(item);
        return String(item);
      })
      .filter(Boolean)
      .join(' ');
  }
  if (typeof detail === 'object') {
    return String(detail.msg || detail.message || detail.detail || '').trim();
  }
  return String(detail).trim();
}

export function isOrgSuspendedDetail(detail) {
  const text = normalizeDetail(detail).toLowerCase();
  if (!text) return false;
  return (
    text.includes('organization is suspended') ||
    text.includes("organization's access has ended") ||
    text.includes('access has ended') ||
    text.includes('registration is disabled')
  );
}

export function isRegistrationDisabledDetail(detail) {
  const text = normalizeDetail(detail).toLowerCase();
  return text.includes('registration is disabled') || text.includes('organization is suspended');
}

/**
 * @returns {{ kind: 'student'|'staff'|'registration'|'generic', message: string, cta: string }}
 */
export function getSuspendedUx(detail) {
  const message = normalizeDetail(detail) || SUSPENDED_DETAIL.staff;
  const lower = message.toLowerCase();

  if (lower.includes('registration is disabled')) {
    return {
      kind: 'registration',
      message,
      cta: 'Choose another college or contact MentorMuni support.',
    };
  }

  if (lower.includes('contact your tpo') || lower.includes('access has ended')) {
    return {
      kind: 'student',
      message,
      cta: 'Contact your TPO',
    };
  }

  if (lower.includes('contact mentormuni') || lower.includes('organization is suspended')) {
    return {
      kind: 'staff',
      message,
      cta: 'Contact MentorMuni support',
    };
  }

  return {
    kind: 'generic',
    message,
    cta: 'Contact MentorMuni support',
  };
}
