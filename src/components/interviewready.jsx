import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ChevronRight, Lock, Mail, Phone, Check } from 'lucide-react';
import { API_BASE } from '../config';
const FREE_TIER_LIMIT = 1;

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
  const [step, setStep] = useState(0); // 0: landing, 1: contact-info, 1b: otp-verify, 2: user-category, 3: profile, 4: quiz, 5: results, 6: auth-check, 7: signup/signin, 8: payment-plans
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: ''
  });
  
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  
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

    // Check usage limit
    if (usageInfo.remaining_attempts <= 0) {
      setStep(6); // Premium upgrade screen
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      user_category: profile.userCategory,
      primary_skill: profile.primarySkill.trim(),
      email: profile.email.trim(),
      contact_number: profile.contactNumber.trim(),
      otp_verified: otpVerified
    };

    try {
      const res = await fetch(`${API_BASE}/generate-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          setStep(6); // Premium upgrade screen
          setLoading(false);
          return;
        }
        setError(data.error || 'Failed to generate questions');
        setLoading(false);
        return;
      }

      if (!data.success || !data.evaluation_plan) {
        setError('Invalid response from server');
        setLoading(false);
        return;
      }

      setQuestions(data.evaluation_plan.map(q => q.question));
      setEvaluationData(data.evaluation_plan);
      setUsageInfo(data.usage_info || usageInfo);
      setStep(4);
    } catch (err) {
      console.error('Error:', err);
      setError(`Cannot connect to backend. Ensure the server is running at ${API_BASE}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEvalSubmit = async () => {
    setLoading(true);
    setError(null);

    const total = questions.length;
    const correctCount = questions.filter(
      (_, i) => answers[i] === evaluationData[i].correct_answer
    ).length;
    const score = Math.round((correctCount / total) * 100);

    let readinessLabel = '';
    if (score >= 80) {
      readinessLabel = 'Excellent! Ready for Interviews';
    } else if (score >= 60) {
      readinessLabel = 'Good! Keep Practicing';
    } else {
      readinessLabel = 'Keep Preparing';
    }

    const mockResult = {
      readiness_percentage: score,
      readiness_label: readinessLabel,
      summary: `You answered ${correctCount} out of ${total} questions correctly.`,
      userCategory: profile.userCategory,
      techStack: profile.primarySkill,
      strengths: evaluationData
        .filter((_, i) => answers[i] === evaluationData[i].correct_answer)
        .map(q => q.study_topic),
      gaps: evaluationData
        .filter((_, i) => answers[i] !== evaluationData[i].correct_answer)
        .map(q => q.study_topic)
    };

    setTimeout(() => {
      setResult(mockResult);
      setStep(5);
      setLoading(false);
    }, 1500);
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
      <div className="min-h-screen bg-[#0B0F19] text-white py-16 px-4 sm:px-6 lg:px-8 font-sans scroll-smooth">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-16 animate-in fade-in zoom-in duration-700">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              <span className="text-sm font-semibold text-indigo-400">✨ AI-Powered Assessment</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#06B6D4] to-[#4F46E5]">
                Interview Ready Test
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 mb-12 font-medium max-w-3xl mx-auto">
              Get instant AI-powered feedback on your interview readiness based on your role & tech stack. Real questions. Real insights. Real growth.
            </p>
            
            {/* Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 transition-all hover:bg-white/[0.08]">
                <div className="w-1 h-8 bg-indigo-400 mb-4 rounded-full"></div>
                <h3 className="font-bold text-lg mb-2">Instant Results</h3>
                <p className="text-slate-400 text-sm">Get personalized feedback in minutes</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all hover:bg-white/[0.08]">
                <div className="w-1 h-8 bg-cyan-400 mb-4 rounded-full"></div>
                <h3 className="font-bold text-lg mb-2">No Signup Needed</h3>
                <p className="text-slate-400 text-sm">Start instantly, no registration required</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 transition-all hover:bg-white/[0.08]">
                <div className="w-1 h-8 bg-indigo-400 mb-4 rounded-full"></div>
                <h3 className="font-bold text-lg mb-2">Detailed Roadmap</h3>
                <p className="text-slate-400 text-sm">Personalized improvement areas & strength highlights</p>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-indigo-500/30 rounded-3xl p-8 mb-12">
              <p className="text-lg font-semibold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-black">10,000+</span>
                <span className="text-slate-300"> students have improved their interview skills with us</span>
              </p>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => setStep(1)}
              className="inline-block bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-5 px-14 rounded-2xl transition-all shadow-xl hover:shadow-indigo-500/25 active:scale-95 text-lg mb-6"
            >
              Start Your Assessment
            </button>

            {/* Description */}
            <p className="text-slate-400 text-base">
              Takes about 5 minutes • 5 personalized questions • Instant feedback & detailed report
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 1: COLLECT CONTACT INFO ==========
  if (step === 1 && !otpSent) {
    return (
      <div className="min-h-screen bg-[#0B0F19] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
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
      <div className="min-h-screen bg-[#0B0F19] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
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
    return (
      <div className="min-h-screen bg-[#0B0F19] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
                Who are you?
              </h2>
              <p className="text-slate-400 text-lg">
                Select your role to get personalized technical questions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  value: '3rd_year',
                  label: '3rd Year Student',
                  description: 'Currently studying',
                  details: ['Intermediate level', 'DSA & Concepts focus', 'Foundational knowledge'],
                  gradient: 'from-blue-600 to-cyan-600',
                  icon: (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.748 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
                      </svg>
                    </div>
                  )
                },
                {
                  value: '4th_year',
                  label: '4th Year Student',
                  description: 'About to graduate',
                  details: ['Advanced level', 'System Design basics', 'Real-world scenarios'],
                  gradient: 'from-indigo-600 to-purple-600',
                  icon: (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  )
                },
                {
                  value: 'professional',
                  label: 'Working Professional',
                  description: 'Experienced in the field',
                  details: ['Expert level', 'Architecture & Design', 'Leadership questions'],
                  gradient: 'from-purple-600 to-pink-600',
                  icon: (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )
                }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setProfile({...profile, userCategory: option.value});
                    setValidationErrors({...validationErrors, userCategory: ''});
                  }}
                  className={`p-6 rounded-2xl cursor-pointer transition-all transform hover:scale-105 border-2 text-left group ${
                    profile.userCategory === option.value
                      ? 'border-indigo-500 bg-indigo-600/20'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {option.icon}
                  <h3 className="text-xl font-bold text-white mb-2 mt-4">{option.label}</h3>
                  <p className="text-sm text-slate-400 mb-4">{option.description}</p>
                  <div className="space-y-2">
                    {option.details.map((detail, i) => (
                      <div key={i} className="flex items-center text-xs text-slate-300">
                        <Check size={16} className="mr-2 text-indigo-400 flex-shrink-0" />
                        {detail}
                      </div>
                    ))}
                  </div>
                  {profile.userCategory === option.value && (
                    <div className="mt-4 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-indigo-400 flex items-center justify-center">
                        <CheckCircle className="text-indigo-900" size={16} />
                      </div>
                      <span className="ml-2 text-sm font-semibold text-indigo-400">Selected</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {validationErrors.userCategory && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium flex items-start gap-3 mb-8">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <div>{validationErrors.userCategory}</div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtpSent(false);
                  setOtpVerified(false);
                  setOtpCode('');
                }}
                className="flex-1 py-3 font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-white/10 hover:border-white/20"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (!profile.userCategory) {
                    setValidationErrors({...validationErrors, userCategory: 'Please select a category'});
                  } else {
                    setStep(3);
                  }
                }}
                className="flex-[2] bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Continue to Skills
                <ChevronRight size={18} />
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
      <div className="min-h-screen bg-[#0B0F19] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
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
      <div className="min-h-screen bg-[#0B0F19] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-right-8 duration-500">
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

  // ========== STEP 5: RESULTS ==========
  if (step === 5 && result) {
    return (
      <div className="min-h-screen bg-[#0B0F19] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-3xl mx-auto space-y-6 animate-in zoom-in-95 duration-700">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur text-center">
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

            {/* Micro-Conversion Block */}
            <div className="bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 border border-indigo-500/30 rounded-2xl shadow-lg p-8 backdrop-blur">
              <h3 className="text-white font-black text-xl mb-6 text-center">
                You are <span className="text-indigo-400">{result.readiness_percentage}%</span> ready for <span className="text-cyan-400">{result.userCategory.replace('_', ' ')}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => window.location.href = '/learning-paths'}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-95 flex flex-col items-center gap-2"
                >
                  <span>Improve My Score</span>
                </button>
                <button
                  onClick={() => window.location.href = '/mock-interviews'}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-95 flex flex-col items-center gap-2"
                >
                  <span>Book Mock Interview</span>
                </button>
                <button
                  onClick={() => window.location.href = '/upgrade'}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-95 flex flex-col items-center gap-2"
                >
                  <span>Download Roadmap</span>
                </button>
              </div>
            </div>
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

          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur">
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
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
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
      <div className="min-h-screen bg-[#0B0F19] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-3xl shadow-2xl p-8 backdrop-blur text-center animate-in zoom-in duration-500">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/20 border border-orange-500/50 mb-6">
                <div className="w-2 h-10 bg-orange-400 rounded-full"></div>
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
        <div className="min-h-screen bg-[#0B0F19] py-12 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
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
      <div className="min-h-screen bg-[#0B0F19] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur animate-in slide-in-from-bottom-4 duration-500">
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
      <div className="min-h-screen bg-[#0B0F19] py-12 px-4 sm:px-6 lg:px-8 font-sans">
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
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-1 rounded-full text-xs font-black">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className={`${
                  plan.highlighted
                    ? 'bg-[#0B0F19] rounded-[calc(1.5rem-1px)]'
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
      <div className="min-h-screen bg-[#0B0F19] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl shadow-2xl p-12 backdrop-blur text-center animate-in fade-in duration-500">
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

  return null;
};

export default InterviewReady;
