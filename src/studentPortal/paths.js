/** Student portal routes */
export const studentPaths = {
  root: '/studentportal',
  login: '/studentportal/login',
  home: '/studentportal/home',
  practice: '/studentportal/practice',
  companyPrep: '/studentportal/company-prep',
  companies: '/studentportal/companies',
  progress: '/studentportal/progress',
  profile: '/studentportal/profile',
  forgotPassword: '/studentportal/forgot-password',
  resetPassword: '/studentportal/reset-password',
  register: '/studentportal/register',
  enroll: '/studentportal/enroll',
  setPassword: '/studentportal/set-password',
  tools: '/studentportal/tools',
};

/**
 * In-portal tool URL (embeds MmToolWidget — never leaves the student portal).
 * @param {string} toolCode e.g. aptitude | skill_mock | 5_sec
 * @param {{ from?: string, skill?: string, mode?: string }} [opts]
 */
export function studentToolPath(toolCode, opts = {}) {
  const code = String(toolCode || '').trim();
  if (!code) return studentPaths.home;
  const params = new URLSearchParams();
  const from = opts.from || 'roadmap';
  if (from) params.set('from', from);
  if (opts.skill) params.set('skill', String(opts.skill).trim());
  if (opts.mode) params.set('mode', String(opts.mode).trim());
  const q = params.toString();
  return `${studentPaths.tools}/${encodeURIComponent(code)}${q ? `?${q}` : ''}`;
}

const VOICE_MODE_TO_TOOL = {
  skill: 'skill_mock',
  projects: 'project_mock',
  live: 'interview_mock',
  hr: 'hr_mock',
};

const READINESS_MODE_TO_TOOL = {
  aptitude: 'aptitude',
  skill: 'skill_readiness',
  placement: 'interview_readiness',
};

/**
 * Rewrite marketing-site tool URLs (or already-portal paths) into
 * /studentportal/tools/:code so journey links never leave the portal.
 */
export function toPortalToolHref(hrefOrPath, defaultFrom = 'practice') {
  if (!hrefOrPath) return null;
  const raw = String(hrefOrPath).trim();
  if (!raw) return null;
  if (raw.startsWith('/studentportal/tools/')) {
    // Normalize bare portal tool paths; journey host always clears practice daily lock.
    try {
      const url = new URL(raw, 'http://local.invalid');
      if (defaultFrom === 'journey') {
        url.searchParams.set('from', 'journey');
      } else if (!url.searchParams.get('from') && defaultFrom) {
        url.searchParams.set('from', defaultFrom);
      }
      return `${url.pathname}${url.search}`;
    } catch {
      return raw;
    }
  }

  try {
    const url = new URL(raw, 'http://local.invalid');
    // Reject absolute off-site URLs — never hand them to <Link to>.
    if (url.origin !== 'http://local.invalid') return null;

    const from = url.searchParams.get('from') || defaultFrom;
    const tool = url.searchParams.get('tool');
    const skill = url.searchParams.get('skill') || undefined;
    const mode = url.searchParams.get('mode') || undefined;
    const path = url.pathname || '';

    if (tool) return studentToolPath(tool, { from, skill, mode });

    if (/5-sec|snap-test|readiness-snap/i.test(path)) {
      return studentToolPath('5_sec', { from });
    }
    if (/resume-analyzer|resume-ats/i.test(path)) {
      return studentToolPath('resume_ats', { from });
    }
    if (/voice-interview/i.test(path)) {
      return studentToolPath(VOICE_MODE_TO_TOOL[mode] || 'interview_mock', {
        from,
        skill,
      });
    }
    if (/start-assessment|interview-ready|\/readiness$/i.test(path)) {
      return studentToolPath(READINESS_MODE_TO_TOOL[mode] || 'interview_readiness', {
        from,
      });
    }
  } catch {
    // fall through
  }

  return null;
}

/**
 * Only in-portal tool routes — safe for LLM-generated plan links.
 */
export function safePortalToolHref(hrefOrPath, defaultFrom = 'journey') {
  const rewritten = toPortalToolHref(hrefOrPath, defaultFrom);
  if (!rewritten || !rewritten.startsWith(`${studentPaths.tools}/`)) return null;
  return rewritten;
}
