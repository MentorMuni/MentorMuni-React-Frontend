import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  UploadCloud, FileText, X, ChevronRight, CheckCircle,
  AlertCircle, AlertTriangle, Zap, Target, TrendingUp, Shield, Globe2,
  Copy, Check, XCircle, Sparkles, LayoutGrid, PenLine, ClipboardList,
} from 'lucide-react';
import { RESUME_ATS_URL } from '../config';
import { PRIMARY_CTA_LABEL } from '../constants/brandCopy';
import InnerRouteShell from './new-ui/InnerRouteShell';

/**
 * POST {API_BASE}/api/resume/ats — multipart/form-data only (no JSON body).
 * Do not set Content-Type; the browser sets the multipart boundary.
 *
 * Form fields:
 *   - file (required): .pdf, .doc, or .docx (max 5MB client-side)
 *   - target_role (required): role label for keyword matching
 *   - candidate_type (optional): college_student | experienced | fresher
 *   - experience_years (optional): 0–50
 *   - job_description (optional): pasted JD text
 *
 * Server: rate limit ~30 req/min per IP. Response: JSON ResumeAtsResponse.
 * See normalizeAtsResponse().
 */

const ATS_ALLOWED_EXTENSIONS = new Set(['pdf', 'doc', 'docx']);
const ATS_ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ATS_MAX_BYTES = 5 * 1024 * 1024;
const ATS_ACCEPT_ATTR =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const LOADING_STEPS = [
  'Extracting text…',
  'Scoring resume…',
  'Generating recommendations…',
];

const ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'DevOps Engineer',
  'QA / Test Engineer',
  'Product Manager',
  'Android Developer',
];

const CANDIDATE_TYPES = [
  { value: '', label: 'Not specified' },
  { value: 'fresher', label: 'Fresher' },
  { value: 'college_student', label: 'College student (1st–4th year)' },
  { value: 'experienced', label: 'Experienced professional' },
];

const SECTION_SCORE_KEYS = ['headline', 'summary', 'experience', 'skills', 'education', 'contact'];
const SECTION_SCORE_LABELS = {
  headline: 'Headline',
  summary: 'Summary',
  experience: 'Experience',
  skills: 'Skills',
  education: 'Education',
  contact: 'Contact',
};

const RESULT_TABS = [
  { id: 'scores', label: 'Scores' },
  { id: 'fix', label: 'Fix Resume' },
  { id: 'portal', label: 'Naukri & LinkedIn' },
  { id: 'copy', label: 'Copy rewrites' },
];

const SCORE_DISCLAIMER =
  'Scores are directional estimates for resume + Naukri visibility — not Naukri\u2019s exact Profile Score.';

const DEFAULT_SECTION_SCORES = {
  headline: 0,
  summary: 0,
  experience: 0,
  skills: 0,
  education: 0,
  contact: 0,
};

const EASE_OUT = [0.22, 1, 0.36, 1];

const heroStagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const heroItem = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

const cardStagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

const cardItem = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE_OUT } },
};

const resultReveal = {
  initial: { opacity: 0, y: 28, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

const tabPanelMotion = {
  initial: { opacity: 0, y: 14, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.35, ease: EASE_OUT } },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)', transition: { duration: 0.2 } },
};

/** Smooth count-up for score bars and rings */
function useCountUp(target, enabled = true, durationMs = 1100) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion || !enabled ? target : 0);

  useEffect(() => {
    if (reduceMotion || !enabled) {
      setValue(target);
      return undefined;
    }
    setValue(0);
    const start = performance.now();
    let raf;
    function tick(now) {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, enabled, durationMs, reduceMotion]);

  return value;
}

function clampPct(n, fallback = 0) {
  const x = Number(n);
  if (!Number.isFinite(x)) return fallback;
  return Math.max(0, Math.min(100, Math.round(x)));
}

function asStringArray(v) {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === 'string' && v.trim()) return [v.trim()];
  return [];
}

function asOptionalString(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s || null;
}

function scoreLabelFromScore(score) {
  if (score >= 80) return 'Strong';
  if (score >= 60) return 'Moderate';
  return 'Low';
}

function scoreBadgeClass(label) {
  if (label === 'Strong') return 'mm-resume-ats-badge mm-resume-ats-badge--strong';
  if (label === 'Moderate') return 'mm-resume-ats-badge mm-resume-ats-badge--moderate';
  return 'mm-resume-ats-badge mm-resume-ats-badge--low';
}

function scoreRingColor(score) {
  if (score >= 75) return 'var(--success)';
  if (score >= 55) return 'var(--warning-text)';
  return '#ef4444';
}

function normalizeChecklistItem(item) {
  if (!item || typeof item !== 'object') return null;
  const status = ['pass', 'warn', 'fail'].includes(item.status) ? item.status : 'warn';
  return {
    item: String(item.item ?? '').trim(),
    status,
    detail: item.detail ? String(item.detail).trim() : null,
    current: item.current != null && Number.isFinite(Number(item.current)) ? Number(item.current) : null,
    target: item.target != null && Number.isFinite(Number(item.target)) ? Number(item.target) : null,
  };
}

function normalizeFormatWarning(w) {
  if (!w || typeof w !== 'object') return null;
  const severity = w.severity === 'fail' ? 'fail' : 'warn';
  return {
    code: String(w.code ?? '').trim(),
    message: String(w.message ?? '').trim(),
    severity,
  };
}

function normalizeSectionScores(raw, score) {
  const src = raw?.section_scores;
  if (src && typeof src === 'object') {
    const out = {};
    for (const key of SECTION_SCORE_KEYS) {
      out[key] = clampPct(src[key], score);
    }
    return out;
  }
  return { ...DEFAULT_SECTION_SCORES };
}

function normalizeNaukriReadiness(raw, score, scoreLabel) {
  const nr = raw?.naukri_readiness;
  if (nr && typeof nr === 'object') {
    return {
      resume_document: clampPct(nr.resume_document, score),
      profile_alignment: clampPct(nr.profile_alignment, score),
      label: nr.label ?? scoreLabel,
      visibility_band: String(nr.visibility_band ?? '').trim(),
    };
  }
  return {
    resume_document: score,
    profile_alignment: score,
    label: scoreLabel,
    visibility_band: '',
  };
}

/** Maps API JSON (ResumeAtsResponse + aliases) to UI result shape */
function normalizeAtsResponse(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid response from server');
  }

  const overall = raw.overall_score ?? raw.score ?? raw.total_score ?? 0;
  const ats = raw.ats ?? raw.ats_compatibility ?? 0;
  const keywords = raw.keywords ?? raw.keyword_match ?? raw.keyword_score ?? 0;
  const formatting = raw.formatting ?? raw.formatting_score ?? 0;
  const impact = raw.impact ?? raw.impact_score ?? 0;

  const score = clampPct(overall, 0);
  const scoreLabel = raw.score_label ?? scoreLabelFromScore(score);
  const summary =
    String(raw.summary ?? raw.message ?? raw.overview ?? '').trim() ||
    'Here is your ATS-style analysis and keyword feedback for the selected role.';

  const checklistRaw = raw.naukri_checklist ?? [];
  const naukriChecklist = (Array.isArray(checklistRaw) ? checklistRaw : [])
    .map(normalizeChecklistItem)
    .filter(Boolean);

  const warningsRaw = raw.format_warnings ?? [];
  const formatWarnings = (Array.isArray(warningsRaw) ? warningsRaw : [])
    .map(normalizeFormatWarning)
    .filter(Boolean);

  return {
    score,
    score_label: scoreLabel,
    ats: clampPct(ats, 0),
    keywords: clampPct(keywords, 0),
    formatting: clampPct(formatting, 0),
    impact: clampPct(impact, 0),
    summary,
    matched_keywords: asStringArray(raw.matched_keywords ?? raw.matched ?? raw.keywords_found),
    missing_keywords: asStringArray(raw.missing_keywords ?? raw.missing),
    fixes: asStringArray(raw.fixes ?? raw.recommendations ?? raw.suggestions ?? raw.to_do),
    strengths: asStringArray(raw.strengths ?? raw.positives ?? raw.whats_working),
    portal_tips: asStringArray(raw.portal_tips ?? raw.portalTips),
    skills_count: clampPct(raw.skills_count ?? 0, 0),
    section_scores: normalizeSectionScores(raw, score),
    naukri_checklist: naukriChecklist,
    naukri_readiness: normalizeNaukriReadiness(raw, score, scoreLabel),
    format_warnings: formatWarnings,
    candidate_type: asOptionalString(raw.candidate_type),
    inferred_role: asOptionalString(raw.inferred_role),
    top_resume_killers: asStringArray(raw.top_resume_killers),
    keyword_gaps: asStringArray(raw.keyword_gaps),
    rewrite_examples: asStringArray(raw.rewrite_examples),
    section_rewrites: raw.section_rewrites && typeof raw.section_rewrites === 'object' ? raw.section_rewrites : null,
    positioning_improvement: asStringArray(raw.positioning_improvement),
    score_breakdown: raw.score_breakdown && typeof raw.score_breakdown === 'object' ? raw.score_breakdown : null,
    ats_score_estimate: raw.ats_score_estimate && typeof raw.ats_score_estimate === 'object' ? raw.ats_score_estimate : null,
    priority_action_plan: asStringArray(raw.priority_action_plan),
    job_description_provided: Boolean(raw.job_description_provided),
  };
}

async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { _parseError: true, detail: text.slice(0, 200) };
  }
}

function errorMessageFromBody(data, status) {
  if (status === 413) return 'File too large (max 5 MB)';
  if (status === 429) return 'Too many requests — wait a minute and try again.';
  if (!data || typeof data !== 'object') return `Request failed (${status})`;
  if (data.detail) {
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail.map((d) => (typeof d === 'string' ? d : d.msg || JSON.stringify(d))).join(' ');
    }
  }
  return data.message || data.error || (status >= 500 ? 'Something went wrong on our end. Please try again.' : `Request failed (${status})`);
}

/* ─── SCORE RING ─────────────────────────────────────────────── */
function ScoreRing({ score, size = 140, animateIn = true }) {
  const reduceMotion = useReducedMotion();
  const r = 52;
  const circ = 2 * Math.PI * r;
  const displayScore = useCountUp(score, animateIn);
  const ringProgress = animateIn ? (displayScore / 100) * circ : (score / 100) * circ;
  const celebrate = score >= 80;

  return (
    <motion.div
      className={`flex flex-col items-center shrink-0 ${celebrate ? 'mm-resume-ats-ring-wrap--celebrate' : ''}`}
      initial={reduceMotion ? false : { scale: 0.82, opacity: 0, rotate: -8 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.12 }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden className="mm-resume-ats-ring-svg">
        <circle cx="60" cy="60" r={r} fill="none" className="mm-resume-ats-ring__track" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none"
          stroke={scoreRingColor(score)} strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          initial={reduceMotion ? false : { strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${ringProgress} ${circ}` }}
          transition={{ duration: reduceMotion ? 0 : 1.15, ease: EASE_OUT, delay: 0.2 }}
        />
        <text x="60" y="55" textAnchor="middle" className="mm-resume-ats-ring__score" fontSize="22" fontWeight="900" fontFamily="inherit">{displayScore}</text>
        <text x="60" y="71" textAnchor="middle" className="mm-resume-ats-ring__sub" fontSize="9" fontFamily="inherit">/ 100</text>
      </svg>
    </motion.div>
  );
}

function ScoreLabelBadge({ label }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      className={scoreBadgeClass(label)}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.25 }}
    >
      {label}
    </motion.span>
  );
}

function BarMetric({ label, value, fill = 'brand', delay = 0 }) {
  const reduceMotion = useReducedMotion();
  const displayVal = useCountUp(value, true, 900 + delay * 400);
  const fillClass = {
    brand: 'mm-resume-ats-bar-fill--brand',
    cyan: 'mm-resume-ats-bar-fill--cyan',
    violet: 'mm-resume-ats-bar-fill--violet',
    impact: 'mm-resume-ats-bar-fill--impact',
  }[fill] ?? 'mm-resume-ats-bar-fill--brand';

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay, ease: EASE_OUT }}
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
        <motion.span
          className="text-xs font-bold text-foreground tabular-nums"
          key={displayVal}
          initial={reduceMotion ? false : { opacity: 0.5, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {displayVal}%
        </motion.span>
      </div>
      <div className="mm-resume-ats-bar-track">
        <motion.div
          className={`mm-resume-ats-bar-fill ${fillClass} mm-resume-ats-bar-fill--shine`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.95, delay: delay + 0.1, ease: EASE_OUT }}
        />
      </div>
    </motion.div>
  );
}

function ChecklistStatusIcon({ status }) {
  if (status === 'pass') return <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />;
  if (status === 'fail') return <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />;
  return <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />;
}

function FormatWarningBanners({ warnings }) {
  const reduceMotion = useReducedMotion();
  if (!warnings.length) return null;
  return (
    <div className="flex flex-col gap-2">
      {warnings.map((w, i) => (
        <motion.div
          key={`${w.code}-${w.message}`}
          className={`mm-resume-ats-alert ${w.severity === 'fail' ? 'mm-resume-ats-alert--fail' : 'mm-resume-ats-alert--warn'}`}
          initial={reduceMotion ? false : { opacity: 0, x: -20, height: 0 }}
          animate={{ opacity: 1, x: 0, height: 'auto' }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: EASE_OUT }}
        >
          {w.severity === 'fail' ? (
            <XCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
          ) : (
            <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-500" />
          )}
          <span>{w.message}</span>
        </motion.div>
      ))}
    </div>
  );
}

function AnimatedStatNumber({ value }) {
  const display = useCountUp(value, true, 900);
  return <span className="text-2xl font-black text-foreground tabular-nums">{display}</span>;
}

function NaukriReadinessCard({ readiness }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="mm-resume-ats-naukri"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Globe2 size={15} className="text-accent shrink-0" aria-hidden />
        <h3 className="text-sm font-black text-foreground">Naukri readiness</h3>
        <ScoreLabelBadge label={readiness.label} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <motion.div
          className="mm-resume-ats-naukri__stat"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Resume document</p>
          <AnimatedStatNumber value={readiness.resume_document} />
          <p className="text-[10px] text-muted-foreground mt-0.5">Parse quality &amp; file structure</p>
        </motion.div>
        <motion.div
          className="mm-resume-ats-naukri__stat"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Profile alignment</p>
          <AnimatedStatNumber value={readiness.profile_alignment} />
          <p className="text-[10px] text-muted-foreground mt-0.5">Role fit for recruiter search</p>
        </motion.div>
      </div>
      {readiness.visibility_band && (
        <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
          {readiness.visibility_band}
        </p>
      )}
    </motion.div>
  );
}

function ChecklistRows({ items }) {
  const reduceMotion = useReducedMotion();
  return (
    <ul className="flex flex-col gap-3">
      {items.map((row, i) => (
        <motion.li
          key={`${row.item}-${i}`}
          className="flex items-start gap-2.5"
          initial={reduceMotion ? false : { opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.35, ease: EASE_OUT }}
        >
          <ChecklistStatusIcon status={row.status} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-xs font-semibold text-foreground">{row.item}</span>
              {row.current != null && row.target != null && (
                <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
                  {row.current}/{row.target}
                </span>
              )}
            </div>
            {row.detail && (
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{row.detail}</p>
            )}
          </div>
        </motion.li>
      ))}
    </ul>
  );
}

function NaukriChecklist({ items, title = 'Naukri checklist', embedded = false }) {
  if (!items.length) return null;
  const list = <ChecklistRows items={items} />;
  if (embedded) return list;
  return (
    <div className="mm-resume-ats-panel">
      <h3 className="text-sm font-black text-foreground mb-4">{title}</h3>
      {list}
    </div>
  );
}

function KeywordChips({ matched, missing, gaps }) {
  const reduceMotion = useReducedMotion();
  const chipMotion = (i) => ({
    initial: reduceMotion ? false : { opacity: 0, scale: 0.8, y: 6 },
    whileInView: { opacity: 1, scale: 1, y: 0 },
    viewport: { once: true },
    transition: { delay: i * 0.04, type: 'spring', stiffness: 400, damping: 22 },
  });

  return (
    <motion.div
      className="mm-resume-ats-panel"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <h3 className="text-sm font-black text-foreground mb-4">Keyword analysis</h3>
      <div className="mb-4">
        <p className="text-xs font-semibold text-foreground mb-2">Matched in your resume</p>
        <div className="flex flex-wrap gap-2">
          {matched.length ? matched.map((k, i) => (
            <motion.span key={k} className="mm-resume-ats-chip mm-resume-ats-chip--match" {...chipMotion(i)}>{k}</motion.span>
          )) : (
            <span className="text-xs text-muted-foreground">No role keywords detected yet</span>
          )}
        </div>
      </div>
      <div className="mb-4">
        <p className="text-xs font-semibold text-foreground mb-2">Missing — add these</p>
        <div className="flex flex-wrap gap-2">
          {missing.length ? missing.map((k, i) => (
            <motion.span key={k} className="mm-resume-ats-chip mm-resume-ats-chip--miss" {...chipMotion(i + matched.length)}>{k}</motion.span>
          )) : (
            <span className="text-xs text-muted-foreground">No obvious gaps for this role</span>
          )}
        </div>
      </div>
      {gaps.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">AI-suggested gaps</p>
          <div className="flex flex-wrap gap-2">
            {gaps.map((k, i) => (
              <motion.span key={k} className="mm-resume-ats-chip mm-resume-ats-chip--gap" {...chipMotion(i + matched.length + missing.length)}>{k}</motion.span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      className="mm-resume-ats-copy-btn"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      animate={copied ? { borderColor: 'var(--success)' } : {}}
    >
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </motion.button>
  );
}

function SectionRewritesPanel({ rewrites }) {
  if (!rewrites) return null;
  const sections = [
    { key: 'headline', label: 'Headline' },
    { key: 'summary', label: 'Summary' },
    { key: 'skills', label: 'Skills' },
    { key: 'project_or_experience', label: 'Projects / experience' },
  ];
  const hasContent = sections.some(({ key }) => {
    const v = rewrites[key];
    return v != null && v !== '' && (!Array.isArray(v) || v.length > 0);
  });
  if (!hasContent) return null;

  return (
    <div className="flex flex-col gap-4">
      {sections.map(({ key, label }) => {
        const val = rewrites[key];
        if (val == null || val === '' || (Array.isArray(val) && val.length === 0)) return null;
        const text = Array.isArray(val) ? val.join('\n') : String(val);
        return (
          <div key={key} className="mm-resume-ats-panel">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-black text-foreground">{label}</p>
              <CopyButton text={text} />
            </div>
            {Array.isArray(val) ? (
              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                {val.map((item, idx) => (
                  <li key={idx}>{String(item)}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{text}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

const TAB_ICONS = {
  scores: LayoutGrid,
  fix: PenLine,
  portal: Globe2,
  copy: Copy,
};

function ResultTabs({ activeTab, onChange }) {
  return (
    <div className="mm-resume-ats-tabs" role="tablist" aria-label="Resume analysis sections">
      {RESULT_TABS.map(({ id, label }) => {
        const Icon = TAB_ICONS[id];
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={`mm-resume-ats-tab relative ${isActive ? 'mm-resume-ats-tab--active' : ''}`}
          >
            {isActive && (
              <motion.span
                layoutId="ats-tab-indicator"
                className="mm-resume-ats-tab__indicator"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              <Icon size={13} aria-hidden />
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function AtsResultsPanel({ result, activeTab }) {
  const failWarnChecklist = result.naukri_checklist.filter((r) => r.status !== 'pass');

  if (activeTab === 'scores') {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="mm-resume-ats-panel flex flex-col gap-3">
          <h3 className="text-sm font-black text-foreground mb-1">Core scores</h3>
          <BarMetric label="ATS compatibility" value={result.ats} fill="brand" delay={0} />
          <BarMetric label="Keyword match" value={result.keywords} fill="cyan" delay={0.08} />
          <BarMetric label="Formatting" value={result.formatting} fill="cyan" delay={0.16} />
          <BarMetric label="Impact & metrics" value={result.impact} fill="impact" delay={0.24} />
          {result.skills_count > 0 && (
            <p className="mt-2 text-xs text-muted-foreground border-t border-border pt-3">
              <span className="font-bold text-foreground tabular-nums">{result.skills_count}</span> skills detected
              <span className="text-hint"> · aim for 10–15 on Naukri</span>
            </p>
          )}
        </div>

        <div className="mm-resume-ats-panel">
          <h3 className="text-sm font-black text-foreground mb-4">Section scores</h3>
          <div className="flex flex-col gap-3">
            {SECTION_SCORE_KEYS.map((key, i) => (
              <BarMetric key={key} label={SECTION_SCORE_LABELS[key]} value={result.section_scores[key]} fill="violet" delay={i * 0.06} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-5">
          <NaukriChecklist items={result.naukri_checklist} />
          <KeywordChips matched={result.matched_keywords} missing={result.missing_keywords} gaps={result.keyword_gaps} />

          {result.score_breakdown && (
            <div className="mm-resume-ats-panel">
              <p className="text-xs font-black text-foreground mb-3">Score breakdown (AI narrative)</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(result.score_breakdown).map(([k, v]) => (
                  v ? (
                    <span key={k} className="mm-surface-chip px-3 py-1.5 text-xs">
                      <span className="font-semibold text-foreground capitalize">{k.replace(/_/g, ' ')}:</span>{' '}
                      <span className="text-muted-foreground">{String(v)}</span>
                    </span>
                  ) : null
                ))}
              </div>
            </div>
          )}

          {result.ats_score_estimate && (
            <div className="mm-resume-ats-panel border border-border">
              <p className="text-xs font-black text-foreground mb-1">ATS estimate (AI)</p>
              {result.ats_score_estimate.score && (
                <p className="text-sm font-bold text-cta">{String(result.ats_score_estimate.score)}</p>
              )}
              {result.ats_score_estimate.label && (
                <p className="text-xs text-muted-foreground">{result.ats_score_estimate.label}</p>
              )}
              {result.ats_score_estimate.reason && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{result.ats_score_estimate.reason}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'fix') {
    return (
      <div className="flex flex-col gap-5">
        <div className="mm-resume-ats-panel">
          <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
        </div>

        {result.top_resume_killers.length > 0 && (
          <div className="mm-resume-ats-block--risk">
            <h3 className="text-sm font-black text-foreground mb-2">Top resume risks</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {result.top_resume_killers.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-red-500 font-bold">{i + 1}.</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.priority_action_plan.length > 0 && (
          <div className="mm-resume-ats-block--plan">
            <h3 className="text-sm font-black text-foreground mb-2">Priority action plan</h3>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-muted-foreground">
              {result.priority_action_plan.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="mm-resume-ats-block--fix">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={15} className="text-amber-400" />
            <h3 className="text-sm font-black text-foreground">Resume fixes</h3>
          </div>
          <div className="flex flex-col gap-3">
            {result.fixes.map((fix, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-1 text-[10px] font-black text-cta rounded px-1.5 py-0.5 shrink-0 mm-resume-ats-dropzone__icon">{i + 1}</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{fix}</p>
              </div>
            ))}
          </div>
        </div>

        {result.strengths.length > 0 && (
          <div className="mm-resume-ats-block--win">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={14} className="text-green-400" />
              <h3 className="text-sm font-black text-foreground">What&apos;s working</h3>
            </div>
            <div className="flex flex-col gap-2">
              {result.strengths.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-green-400" />
                  <span className="text-xs text-muted-foreground">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.rewrite_examples.length > 0 && (
          <div className="mm-resume-ats-panel">
            <h3 className="text-sm font-black text-foreground mb-2">Rewrite examples</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {result.rewrite_examples.map((line, i) => (
                <li key={i} className="leading-relaxed border-l-2 border-cta/40 pl-3">{line}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'portal') {
    return (
      <div className="flex flex-col gap-5">
        <NaukriReadinessCard readiness={result.naukri_readiness} />

        {result.portal_tips.length > 0 && (
          <div className="mm-resume-ats-naukri">
            <div className="flex items-center gap-2 mb-3">
              <Globe2 size={14} className="text-accent" aria-hidden />
              <h3 className="text-sm font-black text-foreground">Naukri &amp; LinkedIn tips</h3>
            </div>
            <ul className="flex flex-col gap-2.5">
              {result.portal_tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md mm-badge-tag text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {failWarnChecklist.length > 0 && (
          <div className="mm-resume-ats-block--fix">
            <h3 className="text-sm font-black text-foreground mb-3">Checklist items to improve</h3>
            <ChecklistRows items={failWarnChecklist} />
          </div>
        )}

        {!result.portal_tips.length && !failWarnChecklist.length && (
          <p className="text-xs text-muted-foreground text-center py-8">No portal-specific tips returned for this resume.</p>
        )}
      </div>
    );
  }

  if (activeTab === 'copy') {
    const hasRewrites = result.section_rewrites && ['headline', 'summary', 'skills', 'project_or_experience'].some((key) => {
      const v = result.section_rewrites[key];
      return v != null && v !== '' && (!Array.isArray(v) || v.length > 0);
    });
    if (!hasRewrites) {
      return (
        <div className="mm-resume-ats-empty">
          <ClipboardList size={28} className="mx-auto mb-3 text-muted-foreground opacity-60" />
          <p className="text-sm font-semibold text-foreground">No copy-ready rewrites yet</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            AI section rewrites appear here when enrichment is enabled on the server.
          </p>
        </div>
      );
    }
    return <SectionRewritesPanel rewrites={result.section_rewrites} />;
  }

  return null;
}

function AnalysisLoader({ stepIndex }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="mm-resume-ats-loader flex flex-col items-center justify-center gap-5 mm-resume-ats-loader--scanning"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      <div className="relative">
        <span className="mm-resume-ats-loader__pulse mm-resume-ats-loader__pulse--1" aria-hidden />
        <span className="mm-resume-ats-loader__pulse mm-resume-ats-loader__pulse--2" aria-hidden />
        <div className="mm-resume-ats-loader__ring flex items-center justify-center">
          <FileText size={20} className="text-cta relative z-10 mm-resume-ats-loader__icon" />
        </div>
      </div>
      <div className="text-center min-h-[3rem]">
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            className="text-sm font-bold text-foreground"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {LOADING_STEPS[stepIndex]}
          </motion.p>
        </AnimatePresence>
        <p className="text-xs text-muted-foreground mt-1">Usually 3–10 seconds · AI scoring your resume</p>
      </div>
      <div className="flex gap-2">
        {LOADING_STEPS.map((step, i) => (
          <motion.span
            key={step}
            className={`mm-resume-ats-loader__dot ${i <= stepIndex ? 'mm-resume-ats-loader__dot--active' : 'mm-resume-ats-loader__dot--idle'}`}
            animate={i === stepIndex ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: i === stepIndex ? Infinity : 0, duration: 1.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');
  const [candidateType, setCandidateType] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('scores');
  const [fileError, setFileError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (result && resultsRef.current) {
      const t = setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [result]);

  useEffect(() => {
    if (!analyzing) {
      setLoadingStep(0);
      return undefined;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 2800);
    return () => clearInterval(interval);
  }, [analyzing]);

  function isAllowedResumeFile(f) {
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    if (!ATS_ALLOWED_EXTENSIONS.has(ext)) return false;
    if (!f.type || f.type === 'application/octet-stream') return true;
    return ATS_ALLOWED_MIME.has(f.type);
  }

  function handleFile(f) {
    if (!f) return;
    setFileError(null);
    if (f.size > ATS_MAX_BYTES) {
      setFileError('File too large. Maximum size is 5MB.');
      return;
    }
    if (!isAllowedResumeFile(f)) {
      setFileError('Only PDF, DOC, or DOCX files are allowed. Please convert other formats and try again.');
      return;
    }
    setFile(f);
    setResult(null);
    setApiError(null);
  }

  function onInputChange(e) { handleFile(e.target.files?.[0]); }
  function onDrop(e) {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  async function runAnalysis() {
    if (!file || !role || analyzing) return;
    if (candidateType === 'experienced' && experienceYears === '') {
      setApiError('Please enter years of experience for experienced professionals.');
      return;
    }

    setAnalyzing(true);
    setResult(null);
    setApiError(null);
    setActiveTab('scores');
    setLoadingStep(0);

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('target_role', role);
    if (candidateType) formData.append('candidate_type', candidateType);
    if (candidateType === 'experienced' && experienceYears !== '') {
      formData.append('experience_years', String(experienceYears));
    }
    if (jobDescription.trim()) formData.append('job_description', jobDescription.trim());

    try {
      const res = await fetch(RESUME_ATS_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await parseJsonResponse(res);

      if (!res.ok) {
        setApiError(errorMessageFromBody(data, res.status));
        return;
      }

      if (data._parseError) {
        setApiError('Unexpected response from server. Please try again.');
        return;
      }

      const normalized = normalizeAtsResponse(data);
      if (!normalized.fixes.length) {
        normalized.fixes = [
          'Add measurable outcomes to your bullets (%, revenue, latency, users).',
          `Align skills and summary with common ${role} job descriptions.`,
          'Use clear section headings so ATS parsers can segment your resume.',
        ];
      }
      setResult(normalized);
    } catch (err) {
      setApiError(
        err?.message?.includes('Failed to fetch')
          ? 'Cannot reach the server. Check your network or try again later.'
          : err?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setAnalyzing(false);
    }
  }

  const canAnalyze = file && role && !analyzing
    && (candidateType !== 'experienced' || experienceYears !== '');

  const stepUpload = file ? 'done' : 'active';
  const stepRole = role ? 'done' : file ? 'active' : 'idle';
  const stepScan = analyzing || result ? 'active' : role && file ? 'active' : 'idle';
  const stepStates = [
    { label: 'Upload resume', state: stepUpload },
    { label: 'Pick role', state: stepRole },
    { label: 'Get score', state: result ? 'done' : stepScan },
  ];

  return (
    <InnerRouteShell scope="tool" className="mm-site-theme mm-resume-ats-page min-h-screen">

      <section className="mm-resume-ats-hero mm-marketing-hero-backdrop relative overflow-hidden">
        <div className="mm-resume-ats-hero__orb--1 mm-resume-ats-hero__orb--animate" aria-hidden />
        <div className="mm-resume-ats-hero__orb--2 mm-resume-ats-hero__orb--animate" aria-hidden />
        <div className="mm-container relative z-10 pt-12 pb-10">
          <motion.div variants={heroStagger} initial="initial" animate="animate">
            <motion.div variants={heroItem} className="mm-resume-ats-eyebrow mb-5 mm-resume-ats-eyebrow--sparkle">
              <Sparkles size={12} className="mm-resume-ats-sparkle-icon" aria-hidden />
              Free · No signup
            </motion.div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-2xl">
                <motion.h1 variants={heroItem} className="text-3xl md:text-5xl font-extrabold mb-3 leading-[1.08] tracking-tight text-foreground">
                  Will your resume beat the{' '}
                  <span className="mm-resume-ats-hero__title-accent mm-resume-ats-hero__title-accent--shimmer">ATS filter?</span>
                </motion.h1>
                <motion.p variants={heroItem} className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
                  Upload once — get your score, Naukri checklist, keyword gaps, and copy-paste fixes in under a minute.
                </motion.p>
              </div>
              <motion.div variants={heroItem} className="flex flex-wrap gap-2 shrink-0">
                {[
                  { icon: Shield, cls: 'text-green-400', label: 'ATS score' },
                  { icon: Target, cls: 'text-cta', label: 'Keywords' },
                  { icon: TrendingUp, cls: 'text-amber-400', label: 'Fix list' },
                ].map(({ icon: Icon, cls, label }, i) => (
                  <motion.span
                    key={label}
                    className="mm-resume-ats-stat-pill"
                    whileHover={{ y: -2, scale: 1.03 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Icon size={13} className={cls} />
                    {label}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mm-container py-10 pb-16">
        <nav className="mm-resume-ats-steps" aria-label="Progress">
          {stepStates.map(({ label, state }, i) => (
            <motion.span
              key={label}
              layout
              className={`mm-resume-ats-step ${
                state === 'done' ? 'mm-resume-ats-step--done' : state === 'active' ? 'mm-resume-ats-step--active' : ''
              }`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
            >
              <motion.span
                className="mm-resume-ats-step__num"
                animate={state === 'done' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.35 }}
              >
                {state === 'done' ? '✓' : i + 1}
              </motion.span>
              {label}
            </motion.span>
          ))}
        </nav>

        <motion.div className="mm-resume-ats-form-grid" variants={cardStagger} initial="initial" animate="animate">
          <motion.div variants={cardItem} className="mm-resume-ats-form-grid__upload mm-resume-ats-card mm-resume-ats-card--hover">
            <div className="mm-resume-ats-card__head">
              <h2 className="mm-resume-ats-card__title">Upload resume</h2>
              <p className="mm-resume-ats-card__sub">PDF, DOC, or DOCX · max 5 MB</p>
            </div>
            <div className="mm-resume-ats-card__body">
              {!file ? (
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`mm-resume-ats-dropzone ${dragging ? 'mm-resume-ats-dropzone--drag' : ''}`}
                >
                  <div className="mm-resume-ats-dropzone__icon">
                    <UploadCloud size={26} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">
                      {dragging ? 'Drop it here' : 'Drag & drop or tap to upload'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Your file stays private — sent securely for analysis</p>
                  </div>
                  <button type="button" className="mm-resume-ats-cta mm-resume-ats-cta--on px-6 py-2.5 text-sm w-auto">
                    Choose file
                  </button>
                  <input ref={inputRef} type="file" accept={ATS_ACCEPT_ATTR} onChange={onInputChange} className="sr-only" />
                  {fileError && (
                    <p className="text-xs font-medium text-red-400 text-center max-w-sm">{fileError}</p>
                  )}
                </div>
              ) : (
                <motion.div
                  className="mm-resume-ats-file-chip"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl mm-resume-ats-dropzone__icon">
                    <FileText size={18} className="text-cta" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · ready to scan</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setFile(null); setResult(null); setFileError(null); }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Remove file"
                  >
                    <X size={15} />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div variants={cardItem} className="mm-resume-ats-card mm-resume-ats-card--hover">
            <div className="mm-resume-ats-card__head">
              <h2 className="mm-resume-ats-card__title">Target role</h2>
              <p className="mm-resume-ats-card__sub">Keywords matched to this role</p>
            </div>
            <div className="mm-resume-ats-card__body">
              <div className="flex flex-wrap gap-2">
                {ROLES.map(r => (
                  <motion.button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    whileTap={{ scale: 0.94 }}
                    whileHover={{ scale: 1.04 }}
                    className={`mm-resume-ats-role-chip ${role === r ? 'mm-resume-ats-role-chip--on' : 'mm-resume-ats-role-chip--off'}`}
                  >
                    {r}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={cardItem} className="mm-resume-ats-card mm-resume-ats-card--hover">
            <div className="mm-resume-ats-card__head">
              <h2 className="mm-resume-ats-card__title">About you</h2>
              <p className="mm-resume-ats-card__sub">Optional — sharper scoring</p>
            </div>
            <div className="mm-resume-ats-card__body flex flex-col gap-4">
              <div>
                <label htmlFor="candidate-type" className="text-xs font-bold text-foreground block mb-1.5">I am a…</label>
                <select
                  id="candidate-type"
                  value={candidateType}
                  onChange={(e) => {
                    setCandidateType(e.target.value);
                    if (e.target.value !== 'experienced') setExperienceYears('');
                  }}
                  className="mm-resume-ats-select"
                >
                  {CANDIDATE_TYPES.map(({ value, label }) => (
                    <option key={value || 'none'} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {candidateType === 'experienced' && (
                <div>
                  <label htmlFor="experience-years" className="text-xs font-bold text-foreground block mb-1.5">Years of experience</label>
                  <input
                    id="experience-years"
                    type="number"
                    min={0}
                    max={50}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="e.g. 3"
                    className="mm-resume-ats-input"
                  />
                </div>
              )}

              <div>
                <label htmlFor="job-description" className="text-xs font-bold text-foreground block mb-1.5">
                  Job description <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={3}
                  placeholder="Paste a JD for tighter keyword matching…"
                  className="mm-resume-ats-textarea resize-y min-h-[4.5rem]"
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={cardItem} className="mm-resume-ats-form-grid__cta">
            <motion.button
              type="button"
              onClick={runAnalysis}
              disabled={!canAnalyze}
              className={`mm-resume-ats-cta ${canAnalyze ? 'mm-resume-ats-cta--on mm-resume-ats-cta--pulse' : 'mm-resume-ats-cta--off'}`}
              whileHover={canAnalyze ? { scale: 1.015, y: -2 } : {}}
              whileTap={canAnalyze ? { scale: 0.98 } : {}}
            >
              {analyzing ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Scanning your resume…
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Check my ATS score — free
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {apiError && (
                <motion.div
                  className="mm-resume-ats-alert mm-resume-ats-alert--fail mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AlertCircle size={18} className="shrink-0 text-red-400" />
                  <span className="text-sm leading-relaxed">{apiError}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {analyzing && (
            <AnalysisLoader key="loader" stepIndex={loadingStep} />
          )}
          {!result && !analyzing && (
            <motion.div
              key="empty"
              className="mm-resume-ats-empty mm-resume-ats-empty--float"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <Target size={32} className="mx-auto mb-3 text-muted-foreground opacity-50 mm-resume-ats-empty__icon" />
              <p className="text-sm font-bold text-foreground">Your scorecard lands here</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Upload + pick a role, then hit scan. You&apos;ll get sub-scores, Naukri checklist, and copy-ready rewrites.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              key="results"
              ref={resultsRef}
              className="mm-resume-ats-results"
              variants={resultReveal}
              initial="initial"
              animate="animate"
            >
              <FormatWarningBanners warnings={result.format_warnings} />

              <div className="mm-resume-ats-score-hero mm-resume-ats-score-hero--shimmer">
                <div className="mm-resume-ats-score-hero__inner">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Overall ATS score</p>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <ScoreLabelBadge label={result.score_label} />
                        {result.candidate_type && (
                          <span className="mm-surface-chip px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                            {result.candidate_type.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                      {result.inferred_role && result.inferred_role !== role && (
                        <p className="text-xs text-muted-foreground mb-2">
                          AI inferred role: <span className="font-semibold text-foreground">{result.inferred_role}</span>
                        </p>
                      )}
                      <p className="mm-resume-ats-disclaimer">{SCORE_DISCLAIMER}</p>
                      {result.naukri_readiness.visibility_band && (
                        <p className="text-xs text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border">
                          {result.naukri_readiness.visibility_band}
                        </p>
                      )}
                    </div>
                    <ScoreRing score={result.score} size={132} animateIn />
                  </div>
                </div>
              </div>

              <ResultTabs activeTab={activeTab} onChange={setActiveTab} />
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} {...tabPanelMotion}>
                  <AtsResultsPanel result={result} activeTab={activeTab} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section className="border-t border-border py-14 px-6">
        <div className="mm-container">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-3">Why this matters</span>
          <h2 className="text-xl md:text-2xl font-black text-foreground mb-6 tracking-tight">The ATS gate before humans see you</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { stat: '75%', cls: 'mm-resume-ats-stat-card__num--hot', label: 'Resumes rejected by ATS before a recruiter reads them' },
              { stat: '6 sec', cls: 'mm-resume-ats-stat-card__num--cool', label: 'Average scan time when your resume actually gets through' },
              { stat: '3×', cls: 'mm-resume-ats-stat-card__num--go', label: 'More callbacks when resumes match role keywords' },
            ].map(({ stat, cls, label }, i) => (
              <motion.div
                key={stat}
                className="mm-resume-ats-stat-card mm-resume-ats-card--hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45, ease: EASE_OUT }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <div className={`mm-resume-ats-stat-card__num mb-2 ${cls}`}>{stat}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-border">
        <div className="mm-container mm-container--prose text-center">
          <h2 className="text-xl font-black text-foreground mb-2">Nailed the resume? Check interview readiness next</h2>
          <p className="text-muted-foreground text-sm mb-6">A strong resume gets you in the room — prep gets you the offer.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/start-assessment" className="mm-btn-primary inline-flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl text-sm">
              {PRIMARY_CTA_LABEL} <ChevronRight size={15} />
            </Link>
            <Link to="/mock-interviews" className="mm-btn-secondary inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm">
              Try AI mock interview
            </Link>
          </div>
        </div>
      </section>

    </InnerRouteShell>
  );
}
