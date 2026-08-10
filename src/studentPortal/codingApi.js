/**
 * Coding Round API helpers.
 * Demo/local fake JWTs are accepted by the API in APP_ENV=development
 * (mapped to a real PUBLIC student). Catalog fallback is only for offline errors.
 */

import { studentApi, StudentApiError } from './studentApi';

const DEMO_ASSESSMENTS = [
  {
    id: 1,
    slug: 'practice-two-sum',
    title: 'Practice: Two Sum',
    difficulty: 'easy',
    duration_minutes: 45,
    status: 'active',
    company_key: 'microsoft',
    company_name: 'Microsoft',
    role_name: 'Software Engineer',
    placement_blurb:
      'Pattern practice aligned with Microsoft Software Engineer screening themes. Not a guarantee of any specific interview question.',
    relevance_label: 'Solid pattern match',
    topic: 'Arrays',
    pattern: 'HashMap complement lookup',
    why_this_matters:
      'Trains the Arrays / HashMap complement lookup pattern, commonly useful for Microsoft Software Engineer screens. Evidence-based theme — not a specific interview question.',
    allowed_languages: ['python', 'cpp', 'java'],
    problem_count: 1,
  },
  {
    id: 2,
    slug: 'practice-two-sum',
    title: 'Arrays warm-up (Two Sum)',
    difficulty: 'easy',
    duration_minutes: 30,
    status: 'active',
    company_key: 'amazon',
    company_name: 'Amazon',
    role_name: 'SDE-1',
    placement_blurb:
      'Pattern practice aligned with Amazon SDE-1 screening themes. Not a guarantee of any specific interview question.',
    relevance_label: 'Solid pattern match',
    topic: 'Arrays',
    pattern: 'HashMap complement lookup',
    why_this_matters:
      'Trains Arrays hashing fundamentals used in early product-company screens.',
    allowed_languages: ['python', 'cpp', 'java'],
    problem_count: 1,
  },
  {
    id: 3,
    slug: 'practice-two-sum',
    title: 'Hashing drill (Two Sum)',
    difficulty: 'medium',
    duration_minutes: 45,
    status: 'active',
    company_key: 'google',
    company_name: 'Google',
    role_name: 'Software Engineer',
    placement_blurb:
      'Pattern practice aligned with Google Software Engineer screening themes. Not a guarantee of any specific interview question.',
    relevance_label: 'Exploratory match',
    topic: 'Hashing',
    pattern: 'Complement lookup',
    why_this_matters:
      'Trains Hashing / Complement lookup under tighter constraints for product screens.',
    allowed_languages: ['python', 'cpp', 'java'],
    problem_count: 1,
  },
];

function demoList(filters = {}) {
  let items = DEMO_ASSESSMENTS.map((a) => ({ ...a }));
  const topic = String(filters.topic || '').trim().toLowerCase();
  const difficulty = String(filters.difficulty || '').trim().toLowerCase();
  const companyKey = String(filters.company_key || '').trim().toLowerCase();
  if (companyKey) {
    items = items.filter((a) => (a.company_key || '').toLowerCase() === companyKey);
  }
  if (topic) {
    items = items.filter((a) => (a.topic || '').toLowerCase() === topic);
  }
  if (difficulty) {
    items = items.filter((a) => (a.difficulty || '').toLowerCase() === difficulty);
  }
  return { items, company_key: companyKey || null, demo: true };
}

/** Always try live API — demo tokens work against local/dev backend. */
export function canUseLiveCodingApi() {
  return true;
}

export async function listCodingAssessments({
  company_key,
  topic,
  difficulty,
} = {}) {
  const params = new URLSearchParams();
  if (company_key) params.set('company_key', company_key);
  if (topic) params.set('topic', topic);
  if (difficulty) params.set('difficulty', difficulty);
  const q = params.toString();
  try {
    return await studentApi.get(`/api/coding/assessments${q ? `?${q}` : ''}`);
  } catch (err) {
    if (
      err instanceof StudentApiError &&
      (err.status === 0 || err.status === 401 || err.status >= 500)
    ) {
      return demoList({ company_key, topic, difficulty });
    }
    throw err;
  }
}

export async function listCodingSubmissions({ limit = 20, company_key } = {}) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  if (company_key) params.set('company_key', company_key);
  try {
    return await studentApi.get(`/api/coding/submissions?${params.toString()}`);
  } catch (err) {
    if (err instanceof StudentApiError && (err.status === 0 || err.status === 401 || err.status >= 500)) {
      return { items: [], demo: true };
    }
    throw err;
  }
}

export async function getCodingSubmission(id) {
  return studentApi.get(`/api/coding/submissions/${id}`);
}

export async function getCodingAnalysis(id) {
  return studentApi.get(`/api/coding/submissions/${id}/analysis`);
}

export async function listCodingTopics() {
  try {
    return await studentApi.get('/api/coding/topics');
  } catch (err) {
    if (
      err instanceof StudentApiError &&
      (err.status === 0 || err.status === 401 || err.status === 404 || err.status >= 500)
    ) {
      const topics = [...new Set(DEMO_ASSESSMENTS.map((a) => a.topic).filter(Boolean))];
      const base = [
        'Arrays',
        'Strings',
        'Hashing',
        'Two Pointers',
        'Sliding Window',
        'Binary Search',
        'Stack',
        'Queue',
        'Linked List',
        'Trees',
        'Graphs',
        'Greedy',
        'Recursion',
        'Backtracking',
        'Dynamic Programming',
      ];
      const merged = [...new Set([...topics, ...base])];
      return {
        items: merged.map((topic) => ({
          topic,
          problem_count: DEMO_ASSESSMENTS.filter((a) => a.topic === topic).length,
          difficulties: ['easy', 'medium', 'hard'],
          patterns: [],
        })),
        audience: 'engineering_campus_placement_year4',
        demo: true,
      };
    }
    throw err;
  }
}

export async function listCodingBankProblems({ topic, difficulty, limit = 50 } = {}) {
  const params = new URLSearchParams();
  if (topic) params.set('topic', topic);
  if (difficulty) params.set('difficulty', difficulty);
  if (limit) params.set('limit', String(limit));
  const q = params.toString();
  try {
    return await studentApi.get(`/api/coding/bank/problems${q ? `?${q}` : ''}`);
  } catch (err) {
    if (
      err instanceof StudentApiError &&
      (err.status === 0 || err.status === 401 || err.status === 404 || err.status >= 500)
    ) {
      let items = DEMO_ASSESSMENTS.map((a) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        difficulty: a.difficulty,
        topic: a.topic,
        pattern: a.pattern,
        summary: a.why_this_matters || a.placement_blurb || '',
        company_name: a.company_name,
        role_name: a.role_name,
        relevance_label: a.relevance_label,
        why_this_matters: a.why_this_matters,
        assessment_slug: a.slug,
      }));
      if (topic) {
        const t = topic.toLowerCase();
        items = items.filter((x) => (x.topic || '').toLowerCase() === t);
      }
      if (difficulty) {
        const d = difficulty.toLowerCase();
        items = items.filter((x) => (x.difficulty || '').toLowerCase() === d);
      }
      return { items, topic: topic || null, difficulty: difficulty || null, total: items.length, demo: true };
    }
    throw err;
  }
}

/**
 * Free-text topic + difficulty → practice assessment (bank first, generate if allowed).
 */
export async function resolveCodingPractice({
  topic,
  difficulty = 'easy',
  company_key,
  company_name,
  allow_generate = true,
  max_problems = 1,
} = {}) {
  return studentApi.post('/api/coding/practice/resolve', {
    topic,
    difficulty,
    company_key: company_key || null,
    company_name: company_name || null,
    allow_generate,
    max_problems,
  });
}

export { DEMO_ASSESSMENTS };
