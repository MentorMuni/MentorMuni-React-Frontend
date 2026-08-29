/**
 * MentorMuni Student Login - Gen Z Experience
 * 
 * Split-screen design with:
 * - Left: MentorMuni brand story & value proposition
 * - Right: Clean login form
 * - Full branding with college name
 * - Motivational messaging about placement prep
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  TrendingUp,
  Users,
  Award,
  Zap,
} from 'lucide-react';
import { loginStudent } from '../auth';
import { studentPaths } from '../paths';
import { resolveTenantFromHostname } from '../../tenant/resolveTenant';
import './StudentLoginPageGen.css';

const EASE = [0.22, 1, 0.36, 1];

// ============================================================================
// Animation Variants
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const featureVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

// ============================================================================
// Animated Input Field Component
// ============================================================================

function AnimatedInputField({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  isValid,
  icon: Icon,
  placeholder,
  autoComplete,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="login-field"
      variants={fadeInUp}
      whileHover={{ y: -2 }}
    >
      <label className="login-label">{label}</label>
      <div className={`login-input-wrapper ${isFocused ? 'focused' : ''} ${error ? 'error' : ''} ${isValid ? 'valid' : ''}`}>
        {Icon && <Icon size={18} className="login-input-icon" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={() => setIsFocused(true)}
          onBlurCapture={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="login-input"
          aria-label={label}
        />
        {isValid && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="login-check">
            <CheckCircle2 size={18} />
          </motion.div>
        )}
      </div>
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="login-error">
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

// ============================================================================
// Feature Card Component
// ============================================================================

// eslint-disable-next-line no-unused-vars
function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div className="feature-card" variants={featureVariants} whileHover={{ y: -4 }}>
      <div className="feature-icon">
        <Icon size={24} />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </motion.div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function StudentLoginPageGen() {
  const navigate = useNavigate();

  // College/tenant info
  const [collegeName, setCollegeName] = useState('');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  // Load college/tenant info on mount
  useEffect(() => {
    const loadTenantInfo = async () => {
      try {
        const tenant = await resolveTenantFromHostname();
        setCollegeName(tenant?.organization_name || 'MentorMuni');
      } catch {
        setCollegeName('MentorMuni');
      }
    };

    loadTenantInfo();
  }, []);

  // ========== Form Validation ==========

  const emailError = touched.email && errors.email;
  const passwordError = touched.password && errors.password;

  const emailValid = email && validateEmail(email) && !errors.email;
  const passwordValid = password && validatePassword(password) && !errors.password;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (touched.email) {
      const newErrors = { ...errors };
      if (!e.target.value) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(e.target.value)) {
        newErrors.email = 'Please enter a valid email';
      } else {
        delete newErrors.email;
      }
      setErrors(newErrors);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (touched.password) {
      const newErrors = { ...errors };
      if (!e.target.value) {
        newErrors.password = 'Password is required';
      } else if (!validatePassword(e.target.value)) {
        newErrors.password = 'Password must be at least 6 characters';
      } else {
        delete newErrors.password;
      }
      setErrors(newErrors);
    }
  };

  const handleEmailBlur = () => {
    setTouched({ ...touched, email: true });
    const newErrors = { ...errors };
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    } else {
      delete newErrors.email;
    }
    setErrors(newErrors);
  };

  const handlePasswordBlur = () => {
    setTouched({ ...touched, password: true });
    const newErrors = { ...errors };
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    } else {
      delete newErrors.password;
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email || !validateEmail(email)) newErrors.email = 'Valid email required';
    if (!password || !validatePassword(password)) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await loginStudent(email, password);

      if (!result.ok) {
        setApiError(result.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setSuccessMessage(`Welcome back, ${result.user?.name || 'student'}!`);

      setTimeout(() => {
        navigate(studentPaths.home, { replace: true });
      }, 1200);
    } catch (err) {
      setApiError(err?.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  // ========== Render ==========

  return (
    <div className="login-gen-root">
      {/* Left Side - Brand & Info */}
      <motion.div
        className="login-gen-left"
        initial="hidden"
        animate="visible"
        variants={slideInLeft}
      >
        <div className="brand-section">
          <motion.img
            src="/mentormuni-logo.png"
            alt="MentorMuni"
            className="brand-logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />
          <motion.h1 className="brand-title" variants={fadeInUp}>
            MentorMuni
          </motion.h1>
          {collegeName && collegeName !== 'MentorMuni' && (
            <motion.p className="college-name" variants={fadeInUp}>
              {collegeName}
            </motion.p>
          )}
        </div>

        <div className="info-section">
          <motion.div variants={fadeInUp}>
            <h2 className="info-heading">Your FAANG-Ready Placement Platform</h2>
            <p className="info-subtitle">
              Join thousands of students transforming their careers through elite interview prep and personalized learning paths.
            </p>
          </motion.div>

          <motion.div
            className="features-grid"
            variants={containerVariants}
          >
            <FeatureCard
              icon={Briefcase}
              title="Elite Interview Prep"
              description="FAANG-level technical & HR interview preparation with real-world scenarios"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Personalized Roadmap"
              description="AI-driven 90-day learning path tailored to your goals and pace"
            />
            <FeatureCard
              icon={Users}
              title="Expert Mentorship"
              description="1-on-1 guidance from industry professionals and placement experts"
            />
            <FeatureCard
              icon={Award}
              title="Verified Success"
              description="94% placement rate with average 25% salary hike upon hire"
            />
          </motion.div>

          <motion.div className="stats-section" variants={fadeInUp}>
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat">
              <span className="stat-number">94%</span>
              <span className="stat-label">Placement Rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Companies</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        className="login-gen-right"
        initial="hidden"
        animate="visible"
        variants={slideInRight}
      >
        <motion.div className="login-card" variants={containerVariants}>
          <motion.div variants={fadeInUp}>
            <h2 className="login-heading">Welcome Back</h2>
            <p className="login-subheading">Sign in to continue your placement journey</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="login-success"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <CheckCircle2 size={48} />
                </motion.div>
                <h3 className="success-title">{successMessage}</h3>
                <p className="success-subtitle">Redirecting to your dashboard...</p>
              </motion.div>
            ) : (
              <form key="form" onSubmit={handleSubmit} className="login-form">
                {/* API Error */}
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="login-alert error"
                    role="alert"
                  >
                    <AlertCircle size={16} />
                    {apiError}
                  </motion.div>
                )}

                {/* Email Field */}
                <AnimatedInputField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  error={emailError}
                  isValid={emailValid}
                  icon={Mail}
                  placeholder="you@college.edu"
                  autoComplete="email"
                />

                {/* Password Field */}
                <motion.div className="login-field" variants={fadeInUp}>
                  <label className="login-label">Password</label>
                  <div className={`login-input-wrapper ${passwordError ? 'error' : ''} ${passwordValid ? 'valid' : ''}`}>
                    <Lock size={18} className="login-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      onBlur={handlePasswordBlur}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="login-input"
                      aria-label="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="toggle-password"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {passwordValid && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="login-check">
                        <CheckCircle2 size={18} />
                      </motion.div>
                    )}
                  </div>
                  {passwordError && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="login-error">
                      {passwordError}
                    </motion.p>
                  )}
                </motion.div>

                {/* Remember Me */}
                <motion.label className="remember-checkbox" variants={fadeInUp}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me for 30 days</span>
                </motion.label>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || !emailValid || !passwordValid}
                  className="login-button"
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {loading ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                        <Loader2 size={18} />
                      </motion.div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>

                {/* Links */}
                <motion.div className="login-links" variants={fadeInUp}>
                  <p className="login-text">
                    Not a student yet?{' '}
                    <a href={studentPaths.register} className="login-link">
                      Request college enrollment
                    </a>
                  </p>
                  <p className="login-text">
                    <a href={studentPaths.forgotPassword} className="login-link">
                      Forgot your password?
                    </a>
                  </p>
                </motion.div>
              </form>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div className="login-footer" variants={fadeInUp}>
          <p>Back to <a href="/" className="brand-link">MentorMuni</a></p>
        </motion.div>
      </motion.div>
    </div>
  );
}
