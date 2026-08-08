/**
 * Student Company Intelligence API + local demo fallback.
 */

import { studentApi } from './studentApi';
import { isLocalFallbackSession } from './roadmap/roadmapApi';

const CURATED = [
  { company: 'TCS', role: 'Software Engineer', country: 'India' },
  { company: 'Infosys', role: 'Software Engineer', country: 'India' },
  { company: 'Accenture', role: 'Software Engineer', country: 'India' },
  { company: 'Wipro', role: 'Software Engineer', country: 'India' },
  { company: 'Cognizant', role: 'Software Engineer', country: 'India' },
  { company: 'Capgemini', role: 'Software Engineer', country: 'India' },
  { company: 'Persistent Systems', role: 'Software Engineer', country: 'India' },
  { company: 'Microsoft', role: 'Software Engineer', country: 'India' },
  { company: 'Amazon', role: 'Software Engineer', country: 'India' },
  { company: 'Google', role: 'Software Engineer', country: 'India' },
  { company: 'IBM', role: 'Software Engineer', country: 'India' },
  { company: 'Deloitte', role: 'Software Engineer', country: 'India' },
];

function slugify(company, role, country) {
  const part = (s) =>
    String(s || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'unknown';
  return `${part(company)}--${part(role)}--${part(country)}`;
}

function demoPayload(company, role, country) {
  return {
    company,
    role,
    country,
    metadata: {
      overall_confidence: 0.72,
      evidence_strength: 'Medium',
      last_updated_estimate: '2025',
      known_hiring_variants: 1,
    },
    company_profile: {
      hiring_type: 'Service Based',
      technical_depth: 'Medium',
      communication_importance: 'High',
      project_importance: 'High',
      coding_importance: 'High',
      aptitude_importance: 'High',
      behavioral_importance: 'Medium',
      confidence: 0.7,
      evidence_strength: 'Medium',
    },
    hiring_process: [
      {
        round_name: 'Online aptitude / cognitive',
        order: 1,
        elimination: true,
        duration: '60–90 min',
        evaluation_goal: 'Screen quantitative, logical, verbal basics',
        importance: 'High',
        confidence: 0.75,
        evidence_strength: 'High',
      },
      {
        round_name: 'Technical interview',
        order: 2,
        elimination: true,
        duration: '30–45 min',
        evaluation_goal: 'Programming fundamentals, projects, CS basics',
        importance: 'High',
        confidence: 0.7,
        evidence_strength: 'Medium',
      },
      {
        round_name: 'HR / behavioral',
        order: 3,
        elimination: true,
        duration: '20–30 min',
        evaluation_goal: 'Communication, culture fit, willingness to relocate',
        importance: 'Medium',
        confidence: 0.65,
        evidence_strength: 'Medium',
      },
    ],
    evaluation_dimensions: [
      { dimension: 'Problem Solving', importance: 'High', confidence: 0.7, evidence_strength: 'Medium' },
      { dimension: 'Communication', importance: 'High', confidence: 0.7, evidence_strength: 'Medium' },
      { dimension: 'Projects', importance: 'High', confidence: 0.65, evidence_strength: 'Medium' },
      { dimension: 'Programming', importance: 'High', confidence: 0.7, evidence_strength: 'Medium' },
    ],
    topic_frequency: {},
    interview_profile: {
      interviewer_style: { value: 'Structured, resume-led', confidence: 0.6, evidence_strength: 'Medium' },
      follow_up_depth: { value: 'Moderate', confidence: 0.55, evidence_strength: 'Medium' },
      resume_focus: { value: 'High', confidence: 0.65, evidence_strength: 'Medium' },
      project_discussion_depth: { value: 'Medium-High', confidence: 0.6, evidence_strength: 'Medium' },
      coding_style: { value: 'Fundamentals over contest tricks', confidence: 0.6, evidence_strength: 'Medium' },
      communication_style: { value: 'Clarity and confidence matter', confidence: 0.65, evidence_strength: 'Medium' },
      behavioral_focus: { value: 'Teamwork and relocation readiness', confidence: 0.55, evidence_strength: 'Medium' },
    },
    project_evaluation: {
      importance: 'High',
      discussion_depth: 'Medium',
      focus_areas: ['Contribution', 'Technology Choice', 'Challenges'],
      confidence: 0.65,
      evidence_strength: 'Medium',
    },
    common_rejection_reasons: [
      {
        rank: 1,
        reason: 'Fails medium DSA / coding problems within time limits',
        confidence: 0.7,
        evidence_strength: 'Medium',
      },
      {
        rank: 2,
        reason: 'Weak CS fundamentals (OOP, DBMS, OS) in technical round',
        confidence: 0.65,
        evidence_strength: 'Medium',
      },
      {
        rank: 3,
        reason: 'Cannot explain architecture or complexity trade-offs in project deep-dive',
        confidence: 0.65,
        evidence_strength: 'Medium',
      },
    ],
    mock_interview_blueprint: [
      {
        round: 'Technical interview',
        question_types: ['project deep-dive', 'CS fundamentals', 'coding basics'],
        difficulty: 'Medium',
        duration: '30–45 min',
        evaluation_dimensions: ['Programming', 'Projects', 'Communication'],
      },
      {
        round: 'HR / behavioral',
        question_types: ['behavioral', 'situational'],
        difficulty: 'Easy-Medium',
        duration: '20–30 min',
        evaluation_dimensions: ['Communication', 'Teamwork'],
      },
    ],
  };
}

const localCache = new Map();

function demoEnsure({ company, role = 'Software Engineer', country = 'India' }) {
  const slug = slugify(company, role, country);
  if (!localCache.has(slug)) {
    const payload = demoPayload(company, role, country);
    localCache.set(slug, {
      id: localCache.size + 1,
      slug,
      company,
      role,
      country,
      status: 'ready',
      overall_confidence: payload.metadata.overall_confidence,
      evidence_strength: payload.metadata.evidence_strength,
      last_updated_estimate: payload.metadata.last_updated_estimate,
      error_message: null,
      prompt_version: 'demo',
      model: 'demo',
      completed_at: new Date().toISOString(),
      payload,
    });
  }
  return localCache.get(slug);
}

export async function listCompanyIntelligence(q = '') {
  if (isLocalFallbackSession()) {
    const items = [...localCache.values()]
      .filter((x) => x.status === 'ready')
      .filter((x) => {
        if (!q.trim()) return true;
        const t = q.trim().toLowerCase();
        return x.company.toLowerCase().includes(t) || x.slug.includes(t);
      })
      .map((x) => ({
        id: x.id,
        slug: x.slug,
        company: x.company,
        role: x.role,
        country: x.country,
        status: x.status,
        overall_confidence: x.overall_confidence,
        evidence_strength: x.evidence_strength,
        last_updated_estimate: x.last_updated_estimate,
        hiring_type: x.payload?.company_profile?.hiring_type,
        technical_depth: x.payload?.company_profile?.technical_depth,
        rounds_count: x.payload?.hiring_process?.length || 0,
      }));
    return { items, catalog: CURATED };
  }
  const qs = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : '';
  return studentApi.get(`/student/company-intelligence${qs}`);
}

export async function ensureCompanyIntelligence({ company, role, forceRefresh = false }) {
  const country = 'India';
  if (isLocalFallbackSession()) {
    return demoEnsure({ company, role, country });
  }
  return studentApi.post('/student/company-intelligence/ensure', {
    company,
    role: role || 'Software Engineer',
    country,
    force_refresh: Boolean(forceRefresh),
  });
}

export async function getCompanyIntelligenceById(id) {
  if (isLocalFallbackSession()) {
    const hit = [...localCache.values()].find((x) => x.id === Number(id));
    if (!hit) throw Object.assign(new Error('Not found'), { status: 404 });
    return hit;
  }
  return studentApi.get(`/student/company-intelligence/id/${encodeURIComponent(id)}`);
}

export async function getCompanyIntelligenceBySlug(slug) {
  if (isLocalFallbackSession()) {
    const hit = localCache.get(slug);
    if (!hit) throw Object.assign(new Error('Not found'), { status: 404 });
    return hit;
  }
  return studentApi.get(`/student/company-intelligence/${encodeURIComponent(slug)}`);
}

export async function pollUntilReady(id, { intervalMs = 2000, maxAttempts = 45 } = {}) {
  let last = await getCompanyIntelligenceById(id);
  for (let i = 0; i < maxAttempts; i += 1) {
    if (last.status !== 'generating') return last;
    await new Promise((r) => setTimeout(r, intervalMs));
    last = await getCompanyIntelligenceById(id);
  }
  return last;
}

export { CURATED as COMPANY_INTEL_CATALOG, slugify as companyIntelSlug };
