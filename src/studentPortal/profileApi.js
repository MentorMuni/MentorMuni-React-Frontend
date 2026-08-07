/**
 * Student placement profile.
 *
 * This backs a page the student SHOWS TO OTHER PEOPLE — their TPO, a
 * recruiter at a drive. That changes the rules compared to the rest of
 * the portal:
 *
 *   - Nothing on it may be invented. A section with no data says so.
 *   - Every score carries the date it was earned, so a viewer can tell
 *     a fresh result from a stale one.
 *   - Scores are labelled in plain language. "5-sec snap test: 62%"
 *     means nothing to a recruiter; "First-impression screen" does.
 *
 * ── BACKEND CONTRACT ──────────────────────────────────────────────
 *
 * GET /student/profile        (student bearer token)
 *
 * 200 →
 * {
 *   "student": {
 *     "name":              "Ananya Rao",
 *     "college_id":        "CSE2024A01",
 *     "email":             "ananya@demo.edu",
 *     "phone":             "+91…"        | null,
 *     "organization_name": "Demo Institute of Technology",
 *     "department_name":   "Computer Science",
 *     "year":              3              | null,
 *     "graduation_year":   2026           | null,
 *     "headline":          "Backend-leaning full stack" | null,
 *     "career_goal":       "SDE at a product company"   | null,
 *     "skills":            ["Java", "SQL"],
 *     "links": { "github": "…", "linkedin": "…", "portfolio": "…" }
 *   },
 *   "readiness": {
 *     "overall_score":   62,        // 0-100, null before any scored check
 *     "target_score":    85,
 *     "band":            "building" | "approaching" | "ready",
 *     "last_updated_at": "2026-08-07T10:00:00Z" | null
 *   },
 *   "sections": [                   // one per baseline check, all 8 always
 *     {
 *       "tool_code":    "aptitude",
 *       "score":        54,          // null when not attempted
 *       "label":        "Needs polish" | null,   // for unscored checks
 *       "status":       "done" | "current" | "locked",
 *       "completed_at": "2026-08-01T…" | null
 *     }
 *   ],
 *   "strengths":  ["Number series", "OOP concepts"],
 *   "gaps":       ["SQL joins", "Time and work"],
 *   "activity": {
 *     "completed_count":  3,
 *     "total_count":      8,
 *     "consecutive_days": 4,
 *     "active_days_this_week": 3
 *   }
 * }
 *
 * 404 → profile not provisioned yet. The client composes an equivalent
 *       shape from the roadmap + analysis endpoints, so the page works
 *       before this endpoint ships. Do not return 404 for "no data";
 *       return 200 with nulls and empty arrays.
 *
 * PUT /student/profile
 *   Body: the writable subset of `student` — headline, career_goal,
 *   skills, links, phone. Identity and every score stay server-owned:
 *   a profile a recruiter reads must not be editable by its subject.
 *   Returns the updated profile in the same shape as GET.
 * ──────────────────────────────────────────────────────────────────
 */

import { getStudentSession } from './auth';
import { studentApi, StudentApiError } from './studentApi';
import { fetchAnalysis, fetchRoadmap, isLocalFallbackSession } from './roadmap/roadmapApi';
import { getStudentStreak, getStreakWeekDots } from './streak';
import { WEEK1_STEPS } from './roadmap/week1Steps';

export const TARGET_SCORE = 85;

/** A profile page must never hang on a slow or unreachable API. */
const REQUEST_TIMEOUT_MS = 8000;

/**
 * What each baseline check actually measures, in language a recruiter
 * or TPO can read without knowing the product.
 */
export const SECTION_META = {
  '5_sec': {
    title: 'First-impression screen',
    blurb: 'How a resume reads in the six seconds a recruiter gives it.',
    group: 'Profile',
  },
  aptitude: {
    title: 'Aptitude',
    blurb: 'Quantitative, logical and verbal reasoning under time pressure.',
    group: 'Aptitude',
  },
  skill_readiness: {
    title: 'Technical fundamentals',
    blurb: 'Core computer-science and language fundamentals.',
    group: 'Technical',
  },
  skill_mock: {
    title: 'Technical interview',
    blurb: 'A spoken technical round, scored on correctness and clarity.',
    group: 'Technical',
  },
  project_mock: {
    title: 'Project defence',
    blurb: 'Explaining own project work: decisions, trade-offs, depth.',
    group: 'Technical',
  },
  interview_readiness: {
    title: 'Interview readiness',
    blurb: 'Structured-answer technique and role awareness.',
    group: 'Interview',
  },
  interview_mock: {
    title: 'Full mock interview',
    blurb: 'An end-to-end interview round with an AI panel.',
    group: 'Interview',
  },
  hr_mock: {
    title: 'HR round',
    blurb: 'Motivation, communication and behavioural questions.',
    group: 'Interview',
  },
};

/** Readiness bands. Shown as a word because a bare "62%" invites guessing. */
export function readinessBand(score) {
  if (score == null) return { key: 'none', label: 'Not yet scored' };
  if (score >= TARGET_SCORE) return { key: 'ready', label: 'Placement ready' };
  if (score >= 65) return { key: 'approaching', label: 'Approaching ready' };
  if (score >= 40) return { key: 'building', label: 'Building' };
  return { key: 'early', label: 'Early stage' };
}

/**
 * Composes the documented shape from data we already hold. Used until
 * GET /student/profile exists, and as the fallback if it errors — the
 * page should never be blank just because one endpoint is down.
 */
async function composeFromRoadmap() {
  const session = getStudentSession() || {};
  const [roadmap, analysis] = await Promise.all([fetchRoadmap(), fetchAnalysis()]);
  const steps = roadmap?.steps || [];
  const byCode = Object.fromEntries(steps.map((s) => [s.tool_code, s]));
  const userKey = session.id || session.email || 'anon';
  const streak = getStudentStreak(userKey);

  const lastCompleted = steps
    .map((s) => s.completed_at)
    .filter(Boolean)
    .sort()
    .pop();

  return {
    student: {
      name: session.name || '',
      college_id: session.college_id || session.username || '',
      email: session.email || '',
      phone: null,
      organization_name: session.organization_name || '',
      department_name: session.department_name || '',
      year: session.year ?? null,
      graduation_year: null,
      headline: null,
      career_goal: null,
      skills: [],
      links: {},
    },
    readiness: {
      overall_score: analysis?.overall_score ?? null,
      target_score: TARGET_SCORE,
      band: readinessBand(analysis?.overall_score ?? null).key,
      last_updated_at: lastCompleted || null,
    },
    sections: WEEK1_STEPS.map((meta) => {
      const step = byCode[meta.tool_code];
      return {
        tool_code: meta.tool_code,
        score: step?.score ?? null,
        label: step?.label ?? null,
        status: step?.status || 'locked',
        completed_at: step?.completed_at || null,
      };
    }),
    strengths: analysis?.top_strengths || [],
    gaps: analysis?.top_weaknesses || [],
    activity: {
      completed_count: roadmap?.completed_count || 0,
      total_count: roadmap?.total_count || WEEK1_STEPS.length,
      consecutive_days: streak.consecutiveDays || 0,
      active_days_this_week: getStreakWeekDots(userKey).filter(Boolean).length,
    },
    /** True when this came from the fallback rather than /student/profile. */
    composed: true,
  };
}

/**
 * @returns {Promise<object>} the profile shape documented above.
 * @throws {Error} only if the fallback composition also fails.
 */
export async function fetchStudentProfile() {
  // Demo and local-enrollment sessions carry a fake JWT; sending it to
  // the live API just stalls on a request that can never succeed.
  if (isLocalFallbackSession()) return composeFromRoadmap();

  try {
    const data = await Promise.race([
      studentApi.get('/student/profile'),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile request timed out')), REQUEST_TIMEOUT_MS)
      ),
    ]);
    if (data?.student) return { ...data, composed: false };
    // Endpoint answered but with nothing usable — treat as not ready.
    return composeFromRoadmap();
  } catch (err) {
    const notImplemented =
      err instanceof StudentApiError && (err.status === 404 || err.status === 501);
    // Anything that is not a definite auth/permission failure falls back,
    // so an unshipped or unreachable endpoint still renders a profile.
    if (notImplemented || !(err instanceof StudentApiError)) {
      return composeFromRoadmap();
    }
    throw err;
  }
}
