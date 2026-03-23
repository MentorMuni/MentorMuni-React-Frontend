import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ChevronRight, Lock, Mail, Phone, Check, Zap, ShieldCheck, Map, ArrowRight, Star, Clock } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE } from '../config';
import AIAnalysisLoader from './AIAnalysisLoader';
import FreeUsageCounter, { useFreeUsageTracker } from './FreeUsageCounter';
import UpgradePromptModal from './UpgradePromptModal';
const FREE_TIER_LIMIT = 1;

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
    contactNumber: ''
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

  const validateForm = () => {
    const errors = {};

    if (!profile.userCategory.trim()) {
      errors.userCategory = 'Please select a category';
    }

    if (!profile.primarySkill.trim()) {
      errors.primarySkill = 'Primary tech stack is required';
    } else if (profile.primarySkill.trim().length < 2) {
      errors.primarySkill = 'Tech stack must be at least 2 characters';
    } else if (profile.primarySkill.trim().length > 2000) {
      errors.primarySkill = 'Tech stack cannot exceed 2000 characters';
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

    const payload = {
      user_type: profile.userCategory,
      primary_skill: profile.primarySkill.trim(),
      target_role: profile.targetRole?.trim() || undefined,
      email: profile.email?.trim() || undefined,
      phone: profile.contactNumber?.trim() || undefined,
    };

    try {
      const res = await fetch(`${API_BASE}/interview-ready/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setStep(6);
          setLoading(false);
          return;
        }
        setError(data.detail || data.error || 'Failed to generate questions');
        setLoading(false);
        return;
      }

      if (!data.evaluation_plan || !data.evaluation_plan.length) {
        setError('No questions returned from server. Please try again.');
        setLoading(false);
        return;
      }

      setQuestions(data.evaluation_plan.map(q => q.question));
      setEvaluationData(data.evaluation_plan);
      setStep(4);
    } catch (err) {
      console.error('Error:', err);
      setError(`Cannot connect to backend (${API_BASE}). Please try again.`);
    } finally {
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
      setStep(5);

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
    setProfile({ userCategory: '', primarySkill: '', email: '', contactNumber: '' });
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

  const ProgressBar = () => (
    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-8">
      <div 
        className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full transition-all duration-500 ease-out"
        style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
      />
    </div>
  );

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

    const STEP_LABELS = ['Role', 'Skills', 'Questions', 'Score', 'Roadmap'];

    return (
      <div className="min-h-screen bg-[#050b18] py-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0f1a30] rounded-3xl shadow-2xl p-8 md:p-10 border border-white/8">

            {/* ── Progress bar ── */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-violet-400">Step 1 of 5</p>
                <p className="text-xs text-slate-500">Interview Readiness Check</p>
              </div>
              <div className="flex items-center gap-1.5">
                {STEP_LABELS.map((label, i) => (
                  <React.Fragment key={label}>
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        i === 0 ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/30' : 'bg-white/5 border border-white/10 text-slate-500'
                      }`}>
                        {i === 0 ? <Check size={12} /> : i + 1}
                      </div>
                      <span className={`text-[10px] font-medium hidden sm:block ${i === 0 ? 'text-violet-400' : 'text-slate-600'}`}>{label}</span>
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                      <div className={`flex-1 h-px mb-4 ${i < 0 ? 'bg-indigo-600' : 'bg-white/8'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-white mb-1">Who are you?</h2>
            <p className="text-slate-300 text-base mb-8">Select your role to get questions matched to your situation.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {ROLES.map(option => {
                const selected = profile.userCategory === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setProfile({...profile, userCategory: option.value});
                      setValidationErrors({...validationErrors, userCategory: ''});
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
                disabled={!profile.userCategory}
                onClick={() => setStep(3)}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all text-sm ${
                  profile.userCategory
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98]'
                    : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/8'
                }`}
              >
                Continue to Skills
                <ChevronRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 3: PROFILE FORM ==========
  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#050b18] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0f1a30] border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
                <div>
                  <h2 className="text-3xl font-black text-white">What's Your Tech Stack?</h2>
                  <p className="text-slate-400 text-base mt-2">
                    Tell us about your primary technologies for <span className="text-indigo-400 font-semibold">{profile.userCategory.replace('_', ' ')}</span>
                  </p>
                </div>
                <div className="text-sm font-bold text-cyan-400 bg-cyan-500/20 border border-cyan-500/50 px-4 py-2 rounded-full whitespace-nowrap">
                  {usageInfo.remaining_attempts}/{FREE_TIER_LIMIT} attempts left
                </div>
              </div>
            </div>
            
            <form onSubmit={handleGetReadinessPlan} className="space-y-6">
              <InputField
                label="Primary Tech Stack / Skills"
                type="textarea"
                name="primarySkill"
                value={profile.primarySkill}
                onChange={(e) => {
                  const v = e.target.value;
                  setProfile((prev) => ({ ...prev, primarySkill: v }));
                  setValidationErrors((prev) => (prev.primarySkill ? { ...prev, primarySkill: '' } : prev));
                }}
                placeholder="e.g. React, Node.js, Python, Java, Django, Express.js, TypeScript, etc."
                error={validationErrors.primarySkill}
                maxLength={2000}
                showCharCount={true}
                autoComplete="off"
              />

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-sm text-cyan-400">
                  <span className="font-semibold">Pro Tip:</span> List the technologies you work with most frequently. Separate multiple technologies with commas for better accuracy.
                </p>
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
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-white/10 hover:border-white/20"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={loading || usageInfo.remaining_attempts <= 0}
                  className="flex-[2] bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Start Assessment
                  <ChevronRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 4: QUIZ ==========
  if (step === 4) {
    return (
      <div className="min-h-screen bg-[#050b18] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#0f1a30] border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-right-8 duration-500">
            <div className="mb-8">
              <div className="flex justify-between items-end mb-6 gap-4 flex-wrap">
                <div>
                  <h2 className="text-3xl font-black text-white">Interview Readiness Quiz</h2>
                  <p className="text-slate-400 text-sm mt-2">Based on <span className="text-cyan-400 font-semibold">{profile.primarySkill.split(',')[0].trim()}</span> for <span className="text-indigo-400 font-semibold">{profile.userCategory.replace('_', ' ')}</span></p>
                </div>
                <div className="text-right bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-w-fit">
                  <div className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">{Object.keys(answers).length}/{questions.length}</div>
                  <p className="text-xs text-slate-400 mt-1">Answered</p>
                </div>
              </div>
              <ProgressBar />
            </div>

            {/* Free Usage Counter */}
            <div className="mb-8 p-4 bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-indigo-500/30 rounded-lg">
              <FreeUsageCounter
                toolName="interview_readiness"
                onLimitReached={() => setShowUpgradeModal(true)}
                compact={false}
              />
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

  // ========== STEP 5: LOADING STATE ==========
  if (step === 5 && loading && !result) {
    return (
      <AIAnalysisLoader
        onComplete={() => {
          // Loader completes, results will be displayed automatically
        }}
        duration={4000}
      />
    );
  }

  // ========== STEP 5: RESULTS ==========
  if (step === 5 && result) {
    return (
      <div className="min-h-screen bg-[#050b18] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-3xl mx-auto space-y-6 animate-in zoom-in-95 duration-700">
          <div className="bg-[#0f1a30] border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur text-center">
            <div className="mb-8">
              <div className={`text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r ${result.readiness_percentage >= 70 ? 'from-emerald-400 to-emerald-500' : 'from-amber-400 to-amber-500'}`}>
                {result.readiness_percentage}%
              </div>
              <h2 className="text-4xl font-black text-white mb-3">{result.readiness_label}</h2>
              <p className="text-slate-300 text-lg">{result.summary}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-sm text-slate-300">
              <p className="font-semibold text-white mb-3">Assessment Details:</p>
              <div className="space-y-2">
                <p>Role: <span className="font-medium text-slate-200">{result.userCategory.replace('_', ' ')}</span></p>
                <p>Tech Stack: <span className="font-medium text-slate-200">{result.techStack}</span></p>
                <p>Attempts Used: <span className="font-medium text-slate-200">{usageInfo.current_usage}/{FREE_TIER_LIMIT}</span></p>
              </div>
            </div>

            {/* Mentorship funnel — contextual based on score */}
            <div className="bg-[#0f1a30] border border-indigo-500/30 rounded-2xl p-6 text-left mt-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">What this means for you</p>
              <h3 className="text-lg font-bold text-white mb-1 leading-snug">
                {result.readiness_percentage < 50
                  ? "Students at this score level improve by 30+ points in 3 weeks with a mentor."
                  : result.readiness_percentage < 75
                  ? "You're close — a focused 2-week plan with a mentor can push you past 75."
                  : "You're scoring well. A mentor session can sharpen the last few gaps before campus drives."}
              </h3>
              <p className="text-sm text-slate-400 mb-4">First session is free. No commitment needed.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/mentors"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-all"
                >
                  Book Free Intro Call <ArrowRight size={15} />
                </Link>
                <Link
                  to="/learning-paths"
                  className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium px-5 py-3 rounded-xl text-sm transition-all"
                >
                  Browse Learning Paths
                </Link>
              </div>
            </div>
          </div>

          {/* Email-save — value first, contact second */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            {reportSent ? (
              <div className="text-center py-2">
                <CheckCircle size={28} className="text-green-400 mx-auto mb-2" />
                <p className="text-white font-semibold text-sm">Report sent! Check your inbox.</p>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-white mb-1">Get your full report in your inbox</p>
                <p className="text-xs text-slate-500 mb-3">Score breakdown, study plan, and resource links — sent once, no spam.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={reportEmail}
                    onChange={(e) => setReportEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    onClick={() => { if (reportEmail.includes('@')) setReportSent(true); }}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all whitespace-nowrap"
                  >
                    Send Report
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {result.strengths && result.strengths.length > 0 && (
              <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 border border-emerald-500/30 rounded-2xl shadow-lg p-6 backdrop-blur">
                <h3 className="text-emerald-400 font-black text-lg flex items-center mb-4">
                  Your Strengths
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.strengths.map((strength, i) => (
                    <span key={i} className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-4 py-2 rounded-lg text-sm font-medium">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.gaps && result.gaps.length > 0 && (
              <div className="bg-gradient-to-br from-amber-600/20 to-amber-700/20 border border-amber-500/30 rounded-2xl shadow-lg p-6 backdrop-blur">
                <h3 className="text-amber-400 font-black text-lg flex items-center mb-4">
                  Areas to Improve
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.gaps.map((gap, i) => (
                    <span key={i} className="bg-amber-500/20 border border-amber-500/50 text-amber-300 px-4 py-2 rounded-lg text-sm font-medium">
                      {gap}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#0f1a30] border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur">
            <div className="space-y-3">
              {usageInfo.remaining_attempts > 0 ? (
                <button 
                  onClick={() => {
                    setStep(2);
                    setAnswers({});
                    setProfile({...profile, primarySkill: ''});
                  }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  Try Another Category
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setStep(6);
                    setAuthMode(null);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  Unlock Premium - Get More Interviews
                </button>
              )}
              <button 
                onClick={resetAll}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 font-bold py-4 rounded-2xl transition-all"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 6: AUTHENTICATION CHECK ==========
  if (step === 6) {
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
                  setStep(7);
                }}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
              >
                Sign In to Your Account
              </button>
              <button 
                onClick={() => {
                  setAuthMode('signup');
                  setStep(7);
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

  // ========== STEP 7: SIGNUP / SIGNIN ==========
  if (step === 7) {
    if (authMode === 'signin') {
      return (
        <div className="min-h-screen bg-[#050b18] py-12 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-md mx-auto">
            <div className="bg-[#0f1a30] border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-white mb-2">Sign In</h2>
              <p className="text-slate-400 mb-8">Access your premium interviews</p>

              <form onSubmit={(e) => {
                e.preventDefault();
                setStep(8);
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
                    onClick={() => setStep(6)}
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
              setStep(8);
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
                  onClick={() => setStep(6)}
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

  // ========== STEP 8: PAYMENT PLANS ==========
  if (step === 8 && isUserSignedUp) {
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
              onClick={() => setStep(5)}
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
  if (loading && step !== 6 && step !== 7 && step !== 8) {
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
