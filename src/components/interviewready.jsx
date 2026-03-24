import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle, CheckCircle, ChevronRight, Lock, Mail, Phone, Check, Zap, ShieldCheck, Map, ArrowRight, Star, Clock,
  TrendingUp, Target, Sparkles, BarChart3, AlertTriangle, CheckCircle2, Lightbulb, Cpu, User,
  Share2, Linkedin, Trophy, Building2, Briefcase,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE } from '../config';
import AIAnalysisLoader from './AIAnalysisLoader';
import { useFreeUsageTracker } from './FreeUsageCounter';
import UpgradePromptModal from './UpgradePromptModal';
const FREE_TIER_LIMIT = 1;

/** Same as Swagger: generate_plan_interview_ready_plan_post → POST /interview-ready/plan */
const INTERVIEW_PLAN_PATH = '/interview-ready/plan';

/**
 * PlanRequest.user_type — must match backend validation exactly:
 * student | working professional | 3rd Year Student | 4th Year Student
 */
const API_USER_TYPE_BY_CATEGORY = {
  '3rd_year': '3rd Year Student',
  '4th_year': '4th Year Student',
  'recent_graduate': 'student',
  professional: 'working professional',
};

/** Pretty labels for UI only (not sent to API) */
const DISPLAY_ROLE_BY_CATEGORY = {
  '3rd_year': '3rd Year Student',
  '4th_year': '4th Year Student',
  'recent_graduate': 'Recent Graduate',
  professional: 'Working Professional',
};

/** PlanRequest.primary_skill maxLength in OpenAPI schema */
const PLAN_PRIMARY_SKILL_MAX = 100;

function formatPlanApiError(data) {
  if (!data) return 'Failed to generate questions';
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail
      .map((d) => (typeof d === 'string' ? d : d.msg || JSON.stringify(d)))
      .join(' ');
  }
  return data.error || data.message || 'Failed to generate questions';
}

/** Avoid crash when server returns HTML or plain text on 5xx */
async function parseResponseJson(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {
      detail: `Unexpected response from server. ${text.slice(0, 180)}${text.length > 180 ? '…' : ''}`,
    };
  }
}

const PLAN_FETCH_TIMEOUT_MS = 120000;

/** User-facing copy only — never show raw HTTP status codes (e.g. 500) in the UI */
function explainPlanHttpError(status, apiMessage) {
  const base = (apiMessage || '').trim();

  if (status === 429) {
    return base || 'Too many requests. Please wait and try again.';
  }

  if (status === 500 || status === 502 || status === 503 || status === 504) {
    if (/failed to generate plan/i.test(base)) {
      return "We couldn't generate your questions right now. Please try again in a minute. If this keeps happening, the assessment service may need maintenance.";
    }
    return "Something went wrong on our side. Please try again in a few minutes.";
  }

  if (status >= 500) {
    return 'Service is temporarily unavailable. Please try again later.';
  }

  // 4xx: show API validation / business message when useful
  if (status === 422 || status === 400) {
    return base || 'Please check your input and try again.';
  }

  return base || 'Something went wrong. Please try again.';
}

/** HashRouter: #/start-assessment?entry=tools */
function readToolsEntryFromHash() {
  if (typeof window === 'undefined') return false;
  try {
    const h = window.location.hash || '';
    const qi = h.indexOf('?');
    if (qi === -1) return false;
    return new URLSearchParams(h.slice(qi + 1)).get('entry') === 'tools';
  } catch {
    return false;
  }
}

const InputField = ({ label, type, name, value, onChange, placeholder, error, maxLength, showCharCount }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-sm font-bold text-slate-200">
        {label} <span className="text-red-400">*</span>
      </label>
      {showCharCount && maxLength && (
        <span className={`text-xs font-medium ${value.length > maxLength * 0.9 ? 'text-red-400' : 'text-slate-400'}`}>
          {value.length} / {maxLength}
        </span>
      )}
    </div>
    {type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className={`w-full px-4 py-3 rounded-xl border bg-white/5 backdrop-blur outline-none transition-all resize-none text-white placeholder-slate-500 ${
          error
            ? 'border-red-500/50 bg-red-500/10'
            : 'border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
        }`}
        required
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 rounded-xl border bg-white/5 backdrop-blur outline-none transition-all text-white placeholder-slate-500 ${
          error
            ? 'border-red-500/50 bg-red-500/10'
            : 'border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
        }`}
        required
      />
    )}
    {error && (
      <div className="flex items-center gap-2 text-red-400 text-xs font-medium">
        <AlertCircle size={14} />
        {error}
      </div>
    )}
  </div>
);

const resultsListContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const resultsListItem = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
};

/** SVG ring + animated stroke (readiness %) */
function ReadinessScoreRing({ pct }) {
  const size = 216;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  const tier =
    pct >= 75 ? { from: '#34d399', to: '#10b981', glow: 'rgba(16,185,129,0.45)' } :
    pct >= 50 ? { from: '#fbbf24', to: '#f59e0b', glow: 'rgba(245,158,11,0.4)' } :
    { from: '#fb7185', to: '#f43f5e', glow: 'rgba(244,63,94,0.35)' };

  return (
    <div className="relative mx-auto flex h-[240px] w-[240px] items-center justify-center">
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-60"
        style={{ background: `radial-gradient(circle, ${tier.glow} 0%, transparent 70%)` }}
      />
      <svg width={size} height={size} className="-rotate-90 transform drop-shadow-lg">
        <defs>
          <linearGradient id="readinessRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tier.from} />
            <stop offset="100%" stopColor={tier.to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#readinessRingGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 18 }}
          className="text-5xl font-black tabular-nums tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-300"
        >
          {pct}%
        </motion.span>
        <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Readiness</span>
      </div>
    </div>
  );
}

function FactorBar({ label, value, icon: Icon, variant = 'indigo', delay = 0 }) {
  const v = Math.min(100, Math.max(0, value));
  const grad =
    variant === 'emerald'
      ? 'linear-gradient(90deg, #10b981, #34d399)'
      : variant === 'amber'
        ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
        : 'linear-gradient(90deg, #6366f1, #22d3ee)';
  const iconCls =
    variant === 'emerald' ? 'text-emerald-400' : variant === 'amber' ? 'text-amber-400' : 'text-indigo-400';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-slate-300">
          {Icon && <Icon size={13} className={iconCls} />}
          {label}
        </span>
        <span className="tabular-nums text-slate-500">{Math.round(v)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${v}%` }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: grad }}
        />
      </div>
    </div>
  );
}

/** Public link to start the same assessment (HashRouter + Vite base). */
function getInterviewReadinessShareUrl() {
  if (typeof window === 'undefined') return '';
  const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  return `${window.location.origin}${base}#/start-assessment`;
}

function buildWhatsAppChallengeMessage(pct, readinessLabel) {
  const url = getInterviewReadinessShareUrl();
  return (
    `I scored ${pct}% on MentorMuni Interview Readiness (${readinessLabel}).\n\n` +
    `Think you can beat me? Same free 5-minute quiz — no signup.\n\n` +
    `Challenge your batchmates:\n${url}\n\n` +
    `Placement prep · Engineering students`
  );
}

const InterviewReady = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fromToolsEntry] = useState(() => readToolsEntryFromHash());

  // Initialize free usage tracker and modal
  const { incrementUsage, getUsageInfo } = useFreeUsageTracker('interview_readiness');

  // 0: landing, 2: role, … — skip landing when opened from Tools (?entry=tools)
  const [step, setStep] = useState(() => (readToolsEntryFromHash() ? 2 : 0));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: ''
  });
  
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  // Post-results email save
  const [reportEmail, setReportEmail] = useState('');
  const [reportSent, setReportSent] = useState(false);
  
  const [profile, setProfile] = useState({
    userCategory: '',
    primarySkill: '',
    email: '',
    contactNumber: '',
    collegeName: '',
    experienceYears: '',
    currentOrganization: '',
  });

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [evaluationData, setEvaluationData] = useState(null);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState({
    current_usage: 0,
    limit: FREE_TIER_LIMIT,
    remaining_attempts: FREE_TIER_LIMIT
  });

  // Authentication states
  const [authMode, setAuthMode] = useState(null); // 'signup' or 'signin'
  const [isUserSignedUp, setIsUserSignedUp] = useState(false);
  const [authData, setAuthData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Selected payment plan
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  // Client navigation to ?entry=tools after mount (e.g. in-app link)
  useEffect(() => {
    if (searchParams.get('entry') === 'tools') {
      setStep((s) => (s === 0 ? 2 : s));
    }
  }, [searchParams]);

  const checkBackendHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) {
        console.warn('Backend health check failed');
      }
    } catch (err) {
      console.warn('Cannot reach backend:', err.message);
    }
  };

  // Form validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validatePhone = (phone) => {
    const cleanNumber = phone.replace(/[^\d]/g, '');
    return cleanNumber.length >= 10;
  };

  const validateContactInfo = () => {
    const errors = {};
    
    if (!contactInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(contactInfo.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!contactInfo.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(contactInfo.phone)) {
      errors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    
    if (!validateContactInfo()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/get-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: contactInfo.email.trim(),
          phone: contactInfo.phone.trim()
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to send OTP');
        setLoading(false);
        return;
      }
      
      setOtpSent(true);
      setError(null);
    } catch (err) {
      setError('Cannot reach backend. Please ensure server is running.');
    } finally {
      setLoading(false);
    }
  };

  const validateOTP = () => {
    if (!otpCode.trim()) {
      setError('OTP is required');
      return false;
    }
    if (otpCode.trim().length !== 6 || !/^\d+$/.test(otpCode.trim())) {
      setError('OTP must be 6 digits');
      return false;
    }
    return true;
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!validateOTP()) return;
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: contactInfo.email.trim(),
          otp: otpCode.trim()
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'OTP verification failed');
        setLoading(false);
        return;
      }
      
      setOtpVerified(true);
      setUsageInfo(data.usage_info ? {
        current_usage: data.usage_info.current_usage,
        limit: data.usage_info.limit,
        remaining_attempts: data.usage_info.remaining_attempts
      } : usageInfo);
      
      // Move to category selection
      setProfile({
        ...profile,
        email: contactInfo.email.trim(),
        contactNumber: contactInfo.phone.trim()
      });
      setStep(2);
      setOtpCode('');
      setError(null);
    } catch (err) {
      setError('Cannot reach backend. Please ensure server is running.');
    } finally {
      setLoading(false);
    }
  };

  const validateContext = () => {
    const errors = {};
    if (profile.userCategory === 'professional') {
      const raw = String(profile.experienceYears ?? '').trim();
      if (!raw) {
        errors.experienceYears = 'Enter years of experience';
      } else {
        const n = parseFloat(raw, 10);
        if (Number.isNaN(n) || n < 0 || n > 50) {
          errors.experienceYears = 'Enter a number between 0 and 50';
        }
      }
      if (!profile.currentOrganization?.trim()) {
        errors.currentOrganization = 'Current organization is required';
      }
    } else if (profile.userCategory && profile.userCategory !== 'professional') {
      if (!profile.collegeName?.trim()) {
        errors.collegeName = 'College or university name is required';
      }
    }

    const emailStr = String(profile.email ?? '').trim();
    if (!emailStr) {
      errors.email = 'Email is required';
    } else if (!validateEmail(emailStr)) {
      errors.email = 'Invalid email format';
    }

    const phoneStr = String(profile.contactNumber ?? '').trim();
    if (!phoneStr) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(phoneStr)) {
      errors.phone = 'Enter a valid phone number (at least 10 digits)';
    }

    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next.collegeName;
      delete next.experienceYears;
      delete next.currentOrganization;
      delete next.email;
      delete next.phone;
      return { ...next, ...errors };
    });
    return Object.keys(errors).length === 0;
  };

  const validateForm = () => {
    const errors = {};

    if (!profile.userCategory.trim()) {
      errors.userCategory = 'Please select a category';
    }

    if (!profile.primarySkill.trim()) {
      errors.primarySkill = 'Primary tech stack is required';
    } else if (profile.primarySkill.trim().length > PLAN_PRIMARY_SKILL_MAX) {
      errors.primarySkill = `Keep your stack to ${PLAN_PRIMARY_SKILL_MAX} characters or less (API limit)`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGetReadinessPlan = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    const primarySkill = profile.primarySkill.trim().slice(0, PLAN_PRIMARY_SKILL_MAX);
    const expParsed =
      profile.userCategory === 'professional'
        ? Math.min(50, Math.max(0, parseFloat(String(profile.experienceYears).trim(), 10) || 0))
        : 0;
    const payload = {
      user_type:
        API_USER_TYPE_BY_CATEGORY[profile.userCategory] ?? 'student',
      primary_skill: primarySkill,
      experience_years: expParsed,
      target_role: profile.targetRole?.trim() || undefined,
      email: profile.email?.trim() || undefined,
      phone: profile.contactNumber?.trim() || undefined,
    };
    if (profile.userCategory === 'professional' && profile.currentOrganization?.trim()) {
      payload.current_organization = profile.currentOrganization.trim();
    }
    if (profile.userCategory && profile.userCategory !== 'professional' && profile.collegeName?.trim()) {
      payload.college_name = profile.collegeName.trim();
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), PLAN_FETCH_TIMEOUT_MS);

    try {
      const res = await fetch(`${API_BASE}${INTERVIEW_PLAN_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await parseResponseJson(res);

      if (!res.ok) {
        if (res.status === 429) {
          setStep(7);
          return;
        }
        const msg = formatPlanApiError(data);
        if (import.meta.env.DEV) {
          console.warn('[interview-ready/plan] error', res.status, data);
        }
        setError(explainPlanHttpError(res.status, msg));
        return;
      }

      if (!data.evaluation_plan || !data.evaluation_plan.length) {
        setError('No questions returned from server. Please try again.');
        return;
      }

      setQuestions(data.evaluation_plan.map((q) => q.question));
      setEvaluationData(data.evaluation_plan);
      setStep(5);
    } catch (err) {
      console.error('Plan request:', err);
      if (err.name === 'AbortError') {
        setError(
          `No response after ${PLAN_FETCH_TIMEOUT_MS / 1000}s. Generating questions can be slow — try again, or check your network.`
        );
      } else {
        setError(`Cannot reach ${API_BASE}. Check your connection or try again later.`);
      }
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleEvalSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        questions: evaluationData.map(q => q.question),
        answers: evaluationData.map((_, i) => answers[i] || ''),
        correct_answers: evaluationData.map(q => q.correct_answer),
        study_topics: evaluationData.map(q => q.study_topic),
      };

      const res = await fetch(`${API_BASE}/interview-ready/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || data.error || 'Failed to evaluate answers. Please try again.');
        setLoading(false);
        return;
      }

      const evalResult = {
        readiness_percentage: data.readiness_percentage,
        readiness_label: data.readiness_label,
        summary: `${data.readiness_label} — ${data.readiness_percentage}% readiness score`,
        userCategory: profile.userCategory,
        techStack: profile.primarySkill,
        strengths: data.strengths || [],
        gaps: data.gaps || [],
        learning_recommendations: data.learning_recommendations || [],
      };

      setResult(evalResult);
      setStep(6);

      const { isLimitReached } = incrementUsage();
      if (isLimitReached) setShowUpgradeModal(true);

    } catch (err) {
      console.error('Evaluate error:', err);
      setError('Cannot connect to backend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStep(0);
    setProfile({
      userCategory: '',
      primarySkill: '',
      email: '',
      contactNumber: '',
      collegeName: '',
      experienceYears: '',
      currentOrganization: '',
    });
    setContactInfo({ email: '', phone: '' });
    setAnswers({});
    setValidationErrors({});
    setError(null);
    setOtpSent(false);
    setOtpVerified(false);
    setOtpCode('');
    setReportEmail('');
    setReportSent(false);
  };

  const ProgressBar = () => {
    const total = questions.length || 1;
    return (
      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500 ease-out"
          style={{ width: `${(Object.keys(answers).length / total) * 100}%` }}
        />
      </div>
    );
  };

  // ========== STEP 0: LANDING ==========
  if (step === 0) {
    return (
      <div className="min-h-screen bg-[#050b18] text-white py-14 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto">

          {/* Source credibility pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Star size={13} className="text-amber-400" />
              <span className="text-sm text-slate-400">Questions built from real interview patterns at 500+ companies</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight">
              Interview{' '}
              <span className="text-indigo-400">Readiness</span>
              <br />Check
            </h1>
          </div>

          {/* Subheadline — specific, not fluffy */}
          <p className="text-center text-lg text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto">
            Questions tailored to your role and tech stack. Get your readiness score, your weak spots,
            and a personalized study plan — in 5 minutes.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { Icon: Zap, title: 'Score in 5 minutes', desc: '5 targeted questions, instant readiness score and topic breakdown.' },
              { Icon: ShieldCheck, title: 'No account needed', desc: 'No account, no password — just start. Save your report after if you want.' },
              { Icon: Map, title: 'Personalised plan', desc: 'Weak areas mapped to a specific week-by-week study roadmap for your stack.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white/[0.03] border border-white/8 rounded-xl p-5 hover:border-indigo-500/30 transition-all">
                <div className="w-9 h-9 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-3">
                  <Icon size={16} className="text-indigo-400" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Trust pills — ABOVE the CTA */}
          <div className="flex flex-wrap justify-center gap-3 mb-5">
            {[
              { Icon: Clock, text: '5 minutes' },
              { Icon: Check, text: 'Free, always' },
              { Icon: ShieldCheck, text: 'No signup' },
            ].map(({ Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-full px-3 py-1.5 text-xs text-slate-300 font-medium">
                <Icon size={12} className="text-green-400" />
                {text}
              </span>
            ))}
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => setStep(2)}
            className="group w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 text-base active:scale-[0.98] mb-3"
          >
            Check My Readiness Score — Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </div>
    );
  }

  // ========== STEP 1: COLLECT CONTACT INFO ==========
  if (step === 1 && !otpSent) {
    return (
      <div className="min-h-screen bg-[#050b18] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0f1a30] border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500">
                  <Mail className="text-indigo-400" size={24} />
                </div>
                <h2 className="text-3xl font-black text-white">Verify Your Contact</h2>
              </div>
              <p className="text-slate-400 text-base">
                We'll send you an OTP to verify your email and phone
              </p>
            </div>
            
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-200 block mb-3">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input 
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => {
                    setContactInfo({...contactInfo, email: e.target.value});
                    setValidationErrors({...validationErrors, email: ''});
                  }}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 rounded-xl border bg-white/5 backdrop-blur outline-none transition-all text-white placeholder-slate-500 ${
                    validationErrors.email 
                      ? 'border-red-500/50 bg-red-500/10' 
                      : 'border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                  }`}
                  required
                />
                {validationErrors.email && (
                  <div className="flex items-center gap-2 text-red-400 text-xs font-medium mt-2">
                    <AlertCircle size={14} />
                    {validationErrors.email}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-bold text-slate-200 block mb-3">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input 
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => {
                    setContactInfo({...contactInfo, phone: e.target.value});
                    setValidationErrors({...validationErrors, phone: ''});
                  }}
                  placeholder="+91 9876543210"
                  className={`w-full px-4 py-3 rounded-xl border bg-white/5 backdrop-blur outline-none transition-all text-white placeholder-slate-500 ${
                    validationErrors.phone 
                      ? 'border-red-500/50 bg-red-500/10' 
                      : 'border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                  }`}
                  required
                />
                {validationErrors.phone && (
                  <div className="flex items-center gap-2 text-red-400 text-xs font-medium mt-2">
                    <AlertCircle size={14} />
                    {validationErrors.phone}
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium flex items-start gap-3">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={() => setStep(0)}
                  className="flex-1 py-3 font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-white/10 hover:border-white/20"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 1B: VERIFY OTP ==========
  if (step === 1 && otpSent && !otpVerified) {
    return (
      <div className="min-h-screen bg-[#050b18] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0f1a30] border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500">
                  <Lock className="text-cyan-400" size={24} />
                </div>
                <h2 className="text-3xl font-black text-white">Verify OTP</h2>
              </div>
              <p className="text-slate-400 text-base">
                Enter the 6-digit code sent to your email and phone
              </p>
              <p className="text-xs text-cyan-400/80 mt-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                Enter the 6-digit OTP we sent to your email. Check your inbox and spam folder.
              </p>
            </div>
            
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-200 block mb-3">
                  Enter OTP <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur outline-none text-center text-3xl font-black tracking-widest text-white placeholder-slate-600 hover:border-white/20 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium flex items-start gap-3">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={() => setOtpSent(false)}
                  className="flex-1 py-3 font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-white/10 hover:border-white/20"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 2: SELECT USER CATEGORY ==========
  if (step === 2) {
    const ROLES = [
      {
        value: '3rd_year',
        emoji: '🎓',
        label: '3rd Year Student',
        badge: 'Internship-focused',
        details: ['Building DSA fundamentals', 'Core CS concepts', 'Targeting internships'],
      },
      {
        value: '4th_year',
        emoji: '🚀',
        label: '4th Year Student',
        badge: 'Campus placement season',
        details: ['Full-time job offers', 'System Design basics', 'Cracking tech rounds'],
      },
      {
        value: 'recent_graduate',
        emoji: '🎯',
        label: 'Recent Graduate',
        badge: 'Passout 2023–2025',
        details: ['Off-campus job hunt', 'Competitive placement prep', 'High-stakes interviews'],
      },
      {
        value: 'professional',
        emoji: '💼',
        label: 'Working Professional',
        badge: 'Job switch ready',
        details: ['Senior-level interviews', 'Architecture & design', 'Leadership questions'],
      },
    ];

    const ASSESSMENT_STEPS = 6;
    const currentStepIndex = 1;

    return (
      <div className="min-h-screen bg-[#050b18] py-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0f1a30] rounded-3xl shadow-2xl p-8 md:p-10 border border-white/8">

            {/* Progress bar only — no step numbers or labels */}
            <div className="mb-6">
              <div
                className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden"
                role="progressbar"
                aria-label="Assessment progress"
                aria-valuenow={currentStepIndex}
                aria-valuemin={1}
                aria-valuemax={ASSESSMENT_STEPS}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-[width] duration-300"
                  style={{ width: `${(currentStepIndex / ASSESSMENT_STEPS) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
              Select your professional profile
            </h2>
            <p className="text-slate-400 text-base mb-8 leading-relaxed">
              Choose the option that best reflects your current stage. We’ll tailor questions to your context.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {ROLES.map(option => {
                const selected = profile.userCategory === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setProfile((p) => {
                        const next = { ...p, userCategory: option.value };
                        if (option.value === 'professional') {
                          next.collegeName = '';
                        } else {
                          next.experienceYears = '';
                          next.currentOrganization = '';
                        }
                        return next;
                      });
                      setValidationErrors({ ...validationErrors, userCategory: '' });
                    }}
                    className={`p-5 rounded-2xl text-left transition-all border-2 group relative ${
                      selected
                        ? 'border-indigo-500 bg-indigo-600/15 shadow-lg shadow-indigo-500/10'
                        : 'border-white/8 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    {selected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                        <Check size={11} className="text-white" />
                      </div>
                    )}
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-white text-sm mb-1">{option.label}</h3>
                    <p className={`text-xs font-medium mb-3 ${selected ? 'text-indigo-400' : 'text-slate-500'}`}>{option.badge}</p>
                    <div className="space-y-1.5">
                      {option.details.map((d) => (
                        <div key={d} className="flex items-start gap-1.5 text-xs text-slate-400">
                          <Check size={11} className={`mt-0.5 shrink-0 ${selected ? 'text-indigo-400' : 'text-slate-600'}`} />
                          {d}
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => (fromToolsEntry ? navigate('/interview-readiness-tools') : setStep(0))}
                className="px-6 py-3 font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-white/8 hover:border-white/20 text-sm"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={!profile.userCategory}
                onClick={() => setStep(3)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                  profile.userCategory
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]'
                    : 'cursor-not-allowed border border-white/8 bg-white/[0.04] text-slate-600'
                }`}
              >
                Continue
                <ChevronRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 3: CONTEXT (COLLEGE VS PROFESSIONAL) ==========
  if (step === 3) {
    const ASSESSMENT_STEPS = 6;
    const currentStepIndex = 2;
    const isPro = profile.userCategory === 'professional';
    const roleLabel =
      DISPLAY_ROLE_BY_CATEGORY[profile.userCategory] ||
      profile.userCategory.replace(/_/g, ' ');

    return (
      <div className="min-h-screen bg-[#050b18] py-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0f1a30] rounded-3xl shadow-2xl p-8 md:p-10 border border-white/8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <div
                className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden"
                role="progressbar"
                aria-label="Assessment progress"
                aria-valuenow={currentStepIndex}
                aria-valuemin={1}
                aria-valuemax={ASSESSMENT_STEPS}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-[width] duration-300"
                  style={{ width: `${(currentStepIndex / ASSESSMENT_STEPS) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-200">
                Profile: <span className="ml-1 text-white">{roleLabel}</span>
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
              {isPro ? 'Your experience & organization' : 'Your college or university'}
            </h2>
            <p className="text-slate-400 text-base mb-8 leading-relaxed max-w-2xl">
              {isPro
                ? 'We use this to calibrate question difficulty and seniority—same as how real interviews adapt to your level.'
                : 'Helps us tailor examples and expectations to your academic context (campus drives, coursework, projects).'}
            </p>

            <div className="space-y-6">
              {isPro ? (
                <>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <Briefcase size={16} className="text-indigo-400" />
                      Years of experience <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      step={0.5}
                      inputMode="decimal"
                      value={profile.experienceYears}
                      onChange={(e) => {
                        setProfile((p) => ({ ...p, experienceYears: e.target.value }));
                        setValidationErrors((prev) =>
                          prev.experienceYears ? { ...prev, experienceYears: '' } : prev
                        );
                      }}
                      placeholder="e.g. 2.5"
                      className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 ${
                        validationErrors.experienceYears
                          ? 'border-red-500/50 bg-red-500/10'
                          : 'border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                      }`}
                    />
                    {validationErrors.experienceYears && (
                      <div className="flex items-center gap-2 text-xs font-medium text-red-400">
                        <AlertCircle size={14} />
                        {validationErrors.experienceYears}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <Building2 size={16} className="text-indigo-400" />
                      Current organization <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={profile.currentOrganization}
                      onChange={(e) => {
                        setProfile((p) => ({ ...p, currentOrganization: e.target.value }));
                        setValidationErrors((prev) =>
                          prev.currentOrganization ? { ...prev, currentOrganization: '' } : prev
                        );
                      }}
                      placeholder="Company or employer name"
                      className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 ${
                        validationErrors.currentOrganization
                          ? 'border-red-500/50 bg-red-500/10'
                          : 'border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                      }`}
                    />
                    {validationErrors.currentOrganization && (
                      <div className="flex items-center gap-2 text-xs font-medium text-red-400">
                        <AlertCircle size={14} />
                        {validationErrors.currentOrganization}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
                    <Building2 size={16} className="text-indigo-400" />
                    College / university name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.collegeName}
                    onChange={(e) => {
                      setProfile((p) => ({ ...p, collegeName: e.target.value }));
                      setValidationErrors((prev) => (prev.collegeName ? { ...prev, collegeName: '' } : prev));
                    }}
                    placeholder="e.g. IIT Madras, VIT Vellore, state university…"
                    className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 ${
                      validationErrors.collegeName
                        ? 'border-red-500/50 bg-red-500/10'
                        : 'border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                    }`}
                  />
                  {validationErrors.collegeName && (
                    <div className="flex items-center gap-2 text-xs font-medium text-red-400">
                      <AlertCircle size={14} />
                      {validationErrors.collegeName}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Email &amp; phone</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <Mail size={16} className="text-indigo-400" />
                  Email address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={profile.email}
                  onChange={(e) => {
                    setProfile((p) => ({ ...p, email: e.target.value }));
                    setValidationErrors((prev) => (prev.email ? { ...prev, email: '' } : prev));
                  }}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 ${
                    validationErrors.email
                      ? 'border-red-500/50 bg-red-500/10'
                      : 'border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                  }`}
                />
                {validationErrors.email && (
                  <div className="flex items-center gap-2 text-xs font-medium text-red-400">
                    <AlertCircle size={14} />
                    {validationErrors.email}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <Phone size={16} className="text-indigo-400" />
                  Phone number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={profile.contactNumber}
                  onChange={(e) => {
                    setProfile((p) => ({ ...p, contactNumber: e.target.value }));
                    setValidationErrors((prev) => (prev.phone ? { ...prev, phone: '' } : prev));
                  }}
                  placeholder="+91 9876543210"
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 ${
                    validationErrors.phone
                      ? 'border-red-500/50 bg-red-500/10'
                      : 'border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                  }`}
                />
                {validationErrors.phone && (
                  <div className="flex items-center gap-2 text-xs font-medium text-red-400">
                    <AlertCircle size={14} />
                    {validationErrors.phone}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500">For your report and follow-up only.</p>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl border border-white/8 px-6 py-3 text-sm font-bold text-slate-400 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!validateContext()) return;
                  setStep(4);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]"
              >
                Continue to skills
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 4: SKILLS / TECH STACK ==========
  if (step === 4) {
    const ASSESSMENT_STEPS = 6;
    const currentStepIndex = 3;

    const roleLabel =
      DISPLAY_ROLE_BY_CATEGORY[profile.userCategory] ||
      profile.userCategory.replace(/_/g, ' ');

    return (
      <div className="min-h-screen bg-[#050b18] py-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0f1a30] rounded-3xl shadow-2xl p-8 md:p-10 border border-white/8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Progress — matches role step */}
            <div className="mb-6">
              <div
                className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden"
                role="progressbar"
                aria-label="Assessment progress"
                aria-valuenow={currentStepIndex}
                aria-valuemin={1}
                aria-valuemax={ASSESSMENT_STEPS}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-[width] duration-300"
                  style={{ width: `${(currentStepIndex / ASSESSMENT_STEPS) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                  Your skills &amp; tech stack
                </h2>
                <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                  We&apos;ll call the plan API to build <span className="text-slate-300 font-semibold">15 Yes/No questions</span>{' '}
                  matched to your stack. List the languages, frameworks, and tools you&apos;re most comfortable discussing (
                  {PLAN_PRIMARY_SKILL_MAX} characters max).
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-200">
                  Profile: <span className="ml-1 text-white">{roleLabel}</span>
                </span>
                <span className="inline-flex items-center rounded-full border border-cyan-500/35 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300">
                  {usageInfo.remaining_attempts}/{FREE_TIER_LIMIT} free runs
                </span>
              </div>
            </div>

            <form onSubmit={handleGetReadinessPlan} className="space-y-6">
              <InputField
                label="Primary technologies"
                type="textarea"
                name="primarySkill"
                value={profile.primarySkill}
                onChange={(e) => {
                  const v = e.target.value;
                  setProfile((prev) => ({ ...prev, primarySkill: v }));
                  setValidationErrors((prev) => (prev.primarySkill ? { ...prev, primarySkill: '' } : prev));
                }}
                placeholder="e.g. React, TypeScript, Node.js, PostgreSQL"
                error={validationErrors.primarySkill}
                maxLength={PLAN_PRIMARY_SKILL_MAX}
                showCharCount={true}
                autoComplete="off"
              />

              <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/[0.06] p-4">
                <p className="text-sm leading-relaxed text-cyan-100/90">
                  <span className="font-semibold text-cyan-300">Tip:</span> Separate items with commas. Mention what you&apos;d
                  talk about in a technical interview — we match question difficulty to this list.
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-300">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
                    <div className="min-w-0 flex-1 leading-relaxed">{error}</div>
                  </div>
                  <button
                    type="button"
                    disabled={loading || usageInfo.remaining_attempts <= 0}
                    onClick={() => handleGetReadinessPlan({ preventDefault() {} })}
                    className="mt-3 w-full rounded-lg border border-red-500/40 bg-red-500/10 py-2 text-xs font-bold text-red-200 transition-colors hover:bg-red-500/20 disabled:opacity-50 sm:w-auto sm:px-4"
                  >
                    Try again
                  </button>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-xl border border-white/8 px-6 py-3 text-sm font-bold text-slate-400 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading || usageInfo.remaining_attempts <= 0}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 disabled:shadow-none"
                >
                  {loading ? (
                    'Preparing your questions…'
                  ) : (
                    <>
                      Generate questions &amp; continue
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 5: QUIZ ==========
  if (step === 5) {
    return (
      <div className="min-h-screen bg-[#050b18] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#0f1a30] border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-right-8 duration-500">
            <div className="mb-8">
              <div className="flex justify-between items-end mb-6 gap-4 flex-wrap">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h2 className="text-3xl font-black text-white">Interview Readiness Quiz</h2>
                    <span className="rounded-full border border-indigo-500/40 bg-indigo-500/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-indigo-300">
                      Yes / No · {questions.length} questions
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">
                    Based on{' '}
                    <span className="font-semibold text-cyan-400">
                      {(profile.primarySkill || '').split(',')[0].trim() || 'your stack'}
                    </span>{' '}
                    for{' '}
                    <span className="font-semibold text-indigo-400">
                      {DISPLAY_ROLE_BY_CATEGORY[profile.userCategory] ||
                        profile.userCategory.replace(/_/g, ' ')}
                    </span>
                  </p>
                </div>
                <div className="text-right bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-w-fit">
                  <div className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">{Object.keys(answers).length}/{questions.length}</div>
                  <p className="text-xs text-slate-400 mt-1">Answered</p>
                </div>
              </div>
              <ProgressBar />
            </div>

            <div className="space-y-8 mb-8 max-h-[60vh] overflow-y-auto pr-4">
              {questions.map((q, i) => (
                <div key={i} className="border-b border-white/5 pb-8 last:border-0">
                  <p className="text-base font-semibold text-white mb-5 leading-relaxed flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-black flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{q}</span>
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setAnswers({...answers, [i]: 'Yes'})}
                      className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${
                        answers[i] === 'Yes' 
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-emerald-400/50 hover:bg-emerald-500/10'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setAnswers({...answers, [i]: 'No'})}
                      className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${
                        answers[i] === 'No' 
                          ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/30' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-rose-400/50 hover:bg-rose-500/10'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${
                Object.keys(answers).length < questions.length 
                  ? 'bg-slate-600 cursor-not-allowed text-slate-400' 
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95'
              }`}
              disabled={Object.keys(answers).length < questions.length || loading}
              onClick={handleEvalSubmit}
            >
              {Object.keys(answers).length < questions.length 
                ? `Answer ${questions.length - Object.keys(answers).length} more ${questions.length - Object.keys(answers).length === 1 ? 'question' : 'questions'}` 
                : 'Get My Readiness Score'
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 6: LOADING STATE ==========
  if (step === 6 && loading && !result) {
    return (
      <AIAnalysisLoader
        onComplete={() => {
          // Loader completes, results will be displayed automatically
        }}
        duration={4000}
      />
    );
  }

  // ========== STEP 6: RESULTS ==========
  if (step === 6 && result) {
    const pct = result.readiness_percentage;
    const strengthCount = result.strengths?.length || 0;
    const gapCount = result.gaps?.length || 0;
    const topicTotal = Math.max(strengthCount + gapCount, 1);
    const strengthSignal = Math.round((strengthCount / topicTotal) * 100);
    const gapPressure = Math.round((gapCount / topicTotal) * 100);
    const band =
      pct >= 75
        ? { label: 'Strong band', sub: 'Keep momentum — polish the last gaps.' }
        : pct >= 50
          ? { label: 'Growth band', sub: 'Structured practice moves this score quickly.' }
          : { label: 'Build band', sub: 'High upside — lock fundamentals below.' };

    return (
      <div className="min-h-screen bg-[#050b18] py-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0f1a30] p-6 shadow-2xl shadow-black/40 sm:p-10"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-600/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:text-left">
              <div className="flex flex-col items-center lg:items-start">
                <ReadinessScoreRing pct={pct} />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-400"
                >
                  <Sparkles size={12} className="text-amber-400" />
                  {band.label}
                </motion.div>
                <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">{result.readiness_label}</h2>
                <p className="mt-2 max-w-md text-slate-400">{band.sub}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{result.summary}</p>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <BarChart3 size={14} className="text-indigo-400" />
                    Score factors
                  </p>
                  <div className="space-y-4">
                    <FactorBar label="Overall readiness index" value={pct} icon={Target} variant="indigo" delay={0.1} />
                    <FactorBar
                      label="Strength coverage (topics you showed)"
                      value={strengthSignal}
                      icon={TrendingUp}
                      variant="emerald"
                      delay={0.2}
                    />
                    <FactorBar
                      label="Gap surface (topics to close)"
                      value={gapPressure}
                      icon={AlertTriangle}
                      variant="amber"
                      delay={0.3}
                    />
                  </div>
                  <p className="mt-3 text-[10px] leading-relaxed text-slate-600">
                    Bars derive from your score + how many strength vs gap topics the model returned — use them as a
                    directional snapshot, not a second exam.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { icon: User, label: 'Role', value: result.userCategory.replace('_', ' ') },
                    { icon: Cpu, label: 'Stack', value: result.techStack || '—' },
                    { icon: BarChart3, label: 'Attempts', value: `${usageInfo.current_usage}/${FREE_TIER_LIMIT}` },
                  ].map((row, i) => (
                    <motion.div
                      key={row.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.06 }}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left"
                    >
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <row.icon size={14} className="text-indigo-400" />
                        {row.label}
                      </div>
                      <p className="text-sm font-semibold capitalize text-white">{row.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="relative mt-10 rounded-2xl border border-indigo-500/35 bg-gradient-to-br from-indigo-600/15 to-violet-600/10 p-6 text-left"
            >
              <div className="absolute right-4 top-4 opacity-20">
                <Lightbulb size={56} className="text-indigo-300" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-300/90">What this means for you</p>
              <h3 className="relative mt-2 max-w-xl text-lg font-bold leading-snug text-white">
                {pct < 50
                  ? 'Students at this score level often improve by 30+ points in a few weeks with guided practice.'
                  : pct < 75
                    ? "You're close — a focused plan can push you past 75 before drives."
                    : "You're in a strong range — sharpen the last gaps before interviews."}
              </h3>
              <p className="relative mt-2 text-sm text-slate-400">First mentor session is free. No commitment.</p>
              <div className="relative mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/mentors"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500"
                >
                  Book free intro call <ArrowRight size={15} />
                </Link>
                <Link
                  to="/learning-paths"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-slate-200 transition-all hover:border-white/25 hover:bg-white/5"
                >
                  Browse learning paths
                </Link>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] via-white/[0.03] to-[#0a1224] p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
                <Trophy className="text-emerald-400" size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Share2 size={16} className="text-slate-500" />
                  <p className="text-sm font-bold text-white">Challenge your friends</p>
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  Dare your squad to beat your {pct}% — same free ~5 min interview readiness check. Bragging rights
                  optional, placement prep mandatory.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(buildWhatsAppChallengeMessage(pct, result.readiness_label))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/25 transition hover:bg-[#20bd5a]"
                  >
                    Share on WhatsApp
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getInterviewReadinessShareUrl())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-[#095195]"
                  >
                    <Linkedin size={18} aria-hidden />
                    Share on LinkedIn
                  </a>
                </div>
                <p className="mt-3 text-[11px] text-slate-500">
                  LinkedIn shares the assessment link — add your score in the post so friends know what to beat.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/8 bg-white/[0.03] p-6"
          >
            {reportSent ? (
              <div className="py-2 text-center">
                <CheckCircle size={28} className="mx-auto mb-2 text-green-400" />
                <p className="text-sm font-semibold text-white">Report sent! Check your inbox.</p>
              </div>
            ) : (
              <>
                <p className="mb-1 text-sm font-semibold text-white">Get your full report in your inbox</p>
                <p className="mb-3 text-xs text-slate-500">Score breakdown, study plan, and resource links — sent once, no spam.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={reportEmail}
                    onChange={(e) => setReportEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (reportEmail.includes('@')) setReportSent(true);
                    }}
                    className="whitespace-nowrap rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
                  >
                    Send Report
                  </button>
                </div>
              </>
            )}
          </motion.div>

          {result.learning_recommendations && result.learning_recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 to-indigo-500/5 p-6"
            >
              <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-cyan-200">
                <Lightbulb size={20} className="text-cyan-400" />
                Personalized next steps
              </h3>
              <div className="space-y-3">
                {result.learning_recommendations.map((rec, i) =>
                  typeof rec === 'string' ? (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="rounded-xl border border-white/10 bg-black/20 p-4 text-left text-sm text-slate-300"
                    >
                      {rec}
                    </motion.p>
                  ) : (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="rounded-xl border border-white/10 bg-black/20 p-4 text-left"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                        {rec.priority || 'Focus'}
                      </p>
                      <p className="mt-1 font-semibold text-white">{rec.topic}</p>
                      {rec.why && <p className="mt-1 text-sm text-slate-400">{rec.why}</p>}
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {result.strengths && result.strengths.length > 0 && (
              <div className="rounded-2xl border border-emerald-500/35 bg-gradient-to-br from-emerald-600/20 via-emerald-900/10 to-transparent p-6 shadow-lg shadow-emerald-950/20">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-emerald-300">
                  <CheckCircle2 size={22} className="text-emerald-400" />
                  Your strengths
                </h3>
                <motion.div
                  variants={resultsListContainer}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-2"
                >
                  {result.strengths.map((strength, i) => (
                    <motion.div
                      key={i}
                      variants={resultsListItem}
                      className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-left text-sm font-medium text-emerald-100"
                    >
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                      <span>{strength}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {result.gaps && result.gaps.length > 0 && (
              <div className="rounded-2xl border border-amber-500/35 bg-gradient-to-br from-amber-600/15 via-amber-900/10 to-transparent p-6 shadow-lg shadow-amber-950/20">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-amber-300">
                  <AlertTriangle size={22} className="text-amber-400" />
                  Areas to improve
                </h3>
                <motion.div
                  variants={resultsListContainer}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-2"
                >
                  {result.gaps.map((gap, i) => (
                    <motion.div
                      key={i}
                      variants={resultsListItem}
                      className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-left text-sm font-medium text-amber-100"
                    >
                      <Target size={16} className="mt-0.5 shrink-0 text-amber-400" />
                      <span>{gap}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="rounded-3xl border border-white/10 bg-[#0f1a30] p-8 shadow-2xl"
          >
            <div className="space-y-3">
              {usageInfo.remaining_attempts > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setStep(2);
                    setAnswers({});
                    setProfile({
                      ...profile,
                      primarySkill: '',
                      collegeName: '',
                      experienceYears: '',
                      currentOrganization: '',
                    });
                  }}
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]"
                >
                  Try another category
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setStep(7);
                    setAuthMode(null);
                  }}
                  className="w-full rounded-2xl bg-indigo-600 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 active:scale-[0.98]"
                >
                  Unlock premium — get more interviews
                </button>
              )}
              <button
                type="button"
                onClick={resetAll}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 text-base font-bold text-slate-300 transition-all hover:border-white/20 hover:bg-white/10"
              >
                Start fresh
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ========== STEP 7: AUTHENTICATION CHECK ==========
  if (step === 7) {
    return (
      <div className="min-h-screen bg-[#050b18] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0f1a30] border border-indigo-500/20 rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in duration-500">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/20 border border-indigo-500/40 mb-6">
                <div className="w-2 h-10 bg-indigo-400 rounded-full"></div>
              </div>
              <h1 className="text-4xl font-black text-white mb-3">
                Unlock AI Mock Interviews
              </h1>
              <p className="text-lg text-slate-300">
                You've completed your free assessment. Get premium access to unlimited AI mock interviews with advanced features!
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  setAuthMode('signin');
                  setStep(8);
                }}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
              >
                Sign In to Your Account
              </button>
              <button 
                onClick={() => {
                  setAuthMode('signup');
                  setStep(8);
                }}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 font-bold py-4 rounded-2xl transition-all"
              >
                Create New Account
              </button>
              <button 
                onClick={resetAll}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 font-bold py-3 rounded-2xl transition-all text-sm"
              >
                Go Back Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 8: SIGNUP / SIGNIN ==========
  if (step === 8) {
    if (authMode === 'signin') {
      return (
        <div className="min-h-screen bg-[#050b18] py-12 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-md mx-auto">
            <div className="bg-[#0f1a30] border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-white mb-2">Sign In</h2>
              <p className="text-slate-400 mb-8">Access your premium interviews</p>

              <form onSubmit={(e) => {
                e.preventDefault();
                setStep(9);
                setIsUserSignedUp(true);
              }} className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-200 block mb-2">Email</label>
                  <input 
                    type="email"
                    value={signInData.email}
                    onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-200 block mb-2">Password</label>
                  <input 
                    type="password"
                    value={signInData.password}
                    onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setStep(7)}
                    className="flex-1 py-3 font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-white/10"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 rounded-2xl shadow-lg transition-all"
                  >
                    Sign In
                  </button>
                </div>
              </form>

              <p className="text-xs text-slate-500 text-center mt-6">
                Don't have an account? <button onClick={() => setAuthMode('signup')} className="text-indigo-400 font-semibold hover:text-indigo-300">Sign up here</button>
              </p>
            </div>
          </div>
        </div>
      );
    }

    // SIGNUP
    return (
      <div className="min-h-screen bg-[#050b18] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md mx-auto">
          <div className="bg-[#0f1a30] border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-white mb-2">Create Account</h2>
            <p className="text-slate-400 mb-8">Join thousands of job seekers mastering interviews</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              setStep(9);
              setIsUserSignedUp(true);
            }} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-200 block mb-2">Full Name</label>
                <input 
                  type="text"
                  value={authData.fullName}
                  onChange={(e) => setAuthData({...authData, fullName: e.target.value})}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-200 block mb-2">Email</label>
                <input 
                  type="email"
                  value={authData.email}
                  onChange={(e) => setAuthData({...authData, email: e.target.value})}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-200 block mb-2">Phone</label>
                <input 
                  type="tel"
                  value={authData.phone}
                  onChange={(e) => setAuthData({...authData, phone: e.target.value})}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-200 block mb-2">Password</label>
                <input 
                  type="password"
                  value={authData.password}
                  onChange={(e) => setAuthData({...authData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-200 block mb-2">Confirm Password</label>
                <input 
                  type="password"
                  value={authData.confirmPassword}
                  onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setStep(7)}
                  className="flex-1 py-3 font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-white/10"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 rounded-2xl shadow-lg transition-all"
                >
                  Sign Up
                </button>
              </div>
            </form>

            <p className="text-xs text-slate-500 text-center mt-6">
              Already have an account? <button onClick={() => setAuthMode('signin')} className="text-indigo-400 font-semibold hover:text-indigo-300">Sign in here</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 9: PAYMENT PLANS ==========
  if (step === 9 && isUserSignedUp) {
    const plans = [
      {
        id: 'plan1',
        name: 'Starter Plan',
        interviews: 2,
        price: 999,
        duration: '1 month',
        features: [
          'Timed mock interviews',
          'Voice-based interview simulation',
          'Behavioral question simulation',
          'HR round practice',
          'Live feedback on answers'
        ],
        badge: 'Best for Entry Level'
      },
      {
        id: 'plan2',
        name: 'Pro Plan',
        interviews: 5,
        price: 1899,
        duration: '3 months',
        features: [
          'Timed mock interviews',
          'Voice-based interview simulation',
          'Behavioral question simulation',
          'HR round practice',
          'Live feedback on answers',
          'Performance analytics'
        ],
        badge: 'Most Popular',
        highlighted: true
      },
      {
        id: 'plan3',
        name: 'Expert Plan',
        interviews: 10,
        price: 3299,
        duration: '6 months',
        features: [
          'Timed mock interviews',
          'Voice-based interview simulation',
          'Behavioral question simulation',
          'HR round practice',
          'Live feedback on answers',
          'Performance analytics',
          '1:1 Mentor consultation',
          'Resume feedback'
        ],
        badge: 'Complete Package'
      }
    ];

    return (
      <div className="min-h-screen bg-[#050b18] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              AI Mock Interview Plans
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Choose the perfect plan to ace your interviews with AI-powered simulations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl transition-all transform hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-indigo-600 to-cyan-600 p-1 md:scale-105'
                    : 'border border-white/10'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-black">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className={`${
                  plan.highlighted
                    ? 'bg-[#050b18] rounded-[calc(1.5rem-1px)]'
                    : 'bg-white/5'
                } p-8 h-full`}>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className={`text-sm ${plan.highlighted ? 'text-cyan-400' : 'text-slate-400'} mb-6`}>{plan.duration}</p>

                  <div className="mb-6">
                    <div className="text-4xl font-black text-white mb-1">₹{plan.price}</div>
                    <div className="text-sm text-slate-400">
                      {plan.interviews} AI Mock Interviews
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle size={18} className={`flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-cyan-400' : 'text-indigo-400'}`} />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-4 rounded-xl font-bold transition-all ${
                      selectedPlan === plan.id
                        ? plan.highlighted
                          ? 'bg-cyan-600 text-white'
                          : 'bg-indigo-600 text-white'
                        : plan.highlighted
                        ? 'bg-cyan-600/30 border border-cyan-600 text-cyan-400 hover:bg-cyan-600/50'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {selectedPlan === plan.id ? (
                      <span className="inline-flex items-center gap-2">
                        <Check size={18} /> Selected
                      </span>
                    ) : (
                      'Select Plan'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedPlan && (
            <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-3xl p-8 text-center">
              <h2 className="text-2xl font-black text-white mb-4">
                Ready to master interviews?
              </h2>
              <button className="bg-white text-indigo-600 px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-white/20 transition-all">
                Proceed to Payment
              </button>
            </div>
          )}

          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => setStep(6)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold py-3 px-8 rounded-2xl transition-all"
            >
              ← Back
            </button>
            <button
              onClick={resetAll}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold py-3 px-8 rounded-2xl transition-all"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========== LOADING STATE ==========
  if (loading && step !== 7 && step !== 8 && step !== 9) {
    return (
      <div className="min-h-screen bg-[#050b18] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0f1a30] border border-white/10 rounded-3xl shadow-2xl p-12 backdrop-blur text-center animate-in fade-in duration-500">
            <div className="mb-6">
              <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Processing Your Request</h2>
            <p className="text-slate-400 mb-4">Please wait while we generate your personalized assessment...</p>
            <p className="text-xs text-slate-500">This may take up to 30 seconds</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {null}
      <UpgradePromptModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        toolName="Interview Readiness Check"
      />
    </>
  );
};

export default InterviewReady;
