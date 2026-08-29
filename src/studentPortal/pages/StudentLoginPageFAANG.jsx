/**
 * MentorMuni Student Portal: FAANG-Level Login Experience
 * 
 * A premium, immersive login page with:
 * - Glassmorphism UI design
 * - Micro-interactions & spring animations
 * - WebGL gradient background (optional)
 * - Form validation with inline feedback
 * - Full accessibility & mobile responsiveness
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Target,
  Rocket,
  Trophy,
} from 'lucide-react';
import { loginStudent } from '../auth';
import { studentPaths } from '../paths';
import { resolveTenantFromHostname } from '../../tenant/resolveTenant';
import './StudentLoginPageFAANG.css';

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

const logoVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 12,
      duration: 0.6,
    },
  },
};

const headlineVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 12,
      duration: 0.7,
    },
  },
};

const formCardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 14,
      duration: 0.8,
    },
  },
};

const fieldVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: (i) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      type: 'spring',
      stiffness: 100,
      damping: 12,
      duration: 0.5,
    },
  }),
};

const buttonVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
      duration: 0.5,
    },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

const errorVariants = {
  hidden: { x: 0 },
  visible: {
    x: [-10, 10, -10, 0],
    transition: {
      duration: 0.4,
      times: [0, 0.25, 0.75, 1],
    },
  },
};

const successVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 12,
    },
  },
};

// ============================================================================
// Email Validation
// ============================================================================

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

// ============================================================================
// Animated Input Field
// ============================================================================

function AnimatedInputField({
  label,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  isValid,
  icon: Icon,
  placeholder,
  autoComplete,
  customIndex = 0,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const reduceMotion = useReducedMotion();

  const displayType = type === 'password' && showPassword ? 'text' : type;

  return (
    <motion.div
      custom={customIndex}
      variants={fieldVariants}
      initial={reduceMotion ? 'visible' : 'hidden'}
      animate="visible"
      className={`animated-field ${error ? 'has-error' : ''} ${isValid ? 'has-success' : ''}`}
    >
      <label className="field-label">{label}</label>
      <div className={`field-wrapper ${isFocused ? 'focused' : ''}`}>
        {Icon && (
          <Icon className="field-icon" size={18} aria-hidden="true" />
        )}
        <input
          type={displayType}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `error-${label}` : undefined}
          className="field-input"
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="field-toggle"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        )}
        {isValid && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="field-success"
            aria-hidden="true"
          >
            <CheckCircle2 size={18} />
          </motion.div>
        )}
        <motion.div className="field-underline" layoutId={`underline-${label}`} />
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="field-error"
          id={`error-${label}`}
          role="alert"
        >
          <AlertCircle size={14} />
          {error}
        </motion.div>
      )}
    </motion.div>
  );
}

// ============================================================================
// Animated Loading Spinner
// ============================================================================

function AnimatedLoadingSpinner() {
  return (
    <motion.div
      className="loading-spinner"
      animate={{ rotate: 360 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <Loader2 size={24} />
    </motion.div>
  );
}

// ============================================================================
// Main Login Component
// ============================================================================

export default function StudentLoginPageFAANG() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  // College/tenant info
  const [collegeName, setCollegeName] = useState('');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  // Refs for focus management
  const submitRef = useRef(null);

  // Load college/tenant info on mount
  useEffect(() => {
    const loadTenantInfo = async () => {
      try {
        const tenant = await resolveTenantFromHostname();
        setCollegeName(tenant?.organization_name || 'MentorMuni');
      } catch {
        // Fallback to generic branding if tenant resolution fails
        setCollegeName('MentorMuni');
      }
    };

    loadTenantInfo();
  }, []);

  const emailError = touched.email && errors.email;
  const passwordError = touched.password && errors.password;

  const emailValid = email && validateEmail(email) && !errors.email;
  const passwordValid = password && validatePassword(password) && !errors.password;

  // ============================================================================
  // Validation & Event Handlers
  // ============================================================================

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      submitRef.current?.focus();
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

      // Success animation
      setSuccess(true);
      setSuccessMessage(`Welcome back, ${result.user?.name || 'student'}!`);

      // Redirect after animation completes
      setTimeout(() => {
        navigate(studentPaths.home, { replace: true });
      }, 1200);
    } catch (err) {
      setApiError(err?.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="faang-login-root">
      {/* Background blur elements */}
      <div className="faang-login-blur faang-login-blur--1" aria-hidden="true" />
      <div className="faang-login-blur faang-login-blur--2" aria-hidden="true" />

      {/* Top Branding */}
      <motion.div
        className="faang-login-branding"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <div className="faang-branding-logo">
          <Rocket size={20} />
          <span className="faang-branding-text">MentorMuni</span>
        </div>
        {collegeName && collegeName !== 'MentorMuni' && (
          <div className="faang-branding-college">{collegeName}</div>
        )}
      </motion.div>

      {/* Main content */}
      <motion.div
        className="faang-login-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section */}
        <div className="faang-login-hero">
          <motion.div variants={logoVariants} className="faang-login-logo">
            <Target size={40} aria-hidden="true" />
          </motion.div>

          <motion.h1 variants={headlineVariants} className="faang-login-headline">
            Ready for Placements?
          </motion.h1>

          <motion.p variants={headlineVariants} className="faang-login-subheadline">
            Your FAANG-ready placement prep platform. Sign in to access interviews, 
            personalized roadmaps, and your path to success.
          </motion.p>

          {/* Motivational stats */}
          <motion.div
            variants={headlineVariants}
            className="faang-login-stats"
          >
            <div className="stat-item">
              <Trophy size={18} aria-hidden="true" />
              <span>Elite Interview Prep</span>
            </div>
            <div className="stat-item">
              <Sparkles size={18} aria-hidden="true" />
              <span>Personalized Roadmap</span>
            </div>
            <div className="stat-item">
              <Rocket size={18} aria-hidden="true" />
              <span>Drive Ready in 90 Days</span>
            </div>
          </motion.div>
        </div>

        {/* Form Card */}
        <motion.div
          variants={formCardVariants}
          className="faang-login-card"
          role="main"
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                variants={successVariants}
                className="faang-login-success"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, times: [0, 0.5, 1] }}
                >
                  <CheckCircle2 size={48} aria-hidden="true" />
                </motion.div>
                <h2 className="faang-login-success-title">{successMessage}</h2>
                <p className="faang-login-success-subtitle">Redirecting to your dashboard...</p>
              </motion.div>
            ) : (
              <form key="form" onSubmit={handleSubmit} className="faang-login-form">
                {/* API Error */}
                {apiError && (
                  <motion.div
                    variants={errorVariants}
                    className="faang-login-api-error"
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
                  customIndex={0}
                />

                {/* Password Field */}
                <AnimatedInputField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  error={passwordError}
                  isValid={passwordValid}
                  icon={Lock}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  customIndex={1}
                />

                {/* Remember Me & Forgot Password */}
                <motion.div
                  variants={fieldVariants}
                  custom={2}
                  className="faang-login-options"
                >
                  <label className="faang-login-checkbox">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      aria-label="Remember me"
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="faang-login-link">
                    Forgot password?
                  </a>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  ref={submitRef}
                  variants={buttonVariants}
                  custom={3}
                  initial={reduceMotion ? 'visible' : 'hidden'}
                  animate="visible"
                  whileHover={!loading ? 'hover' : undefined}
                  whileTap={!loading ? 'tap' : undefined}
                  disabled={loading}
                  className={`faang-login-button ${loading ? 'is-loading' : ''}`}
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <AnimatedLoadingSpinner />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight size={18} aria-hidden="true" />
                    </>
                  )}
                </motion.button>

                {/* Divider */}
                <motion.div
                  variants={fieldVariants}
                  custom={4}
                  className="faang-login-divider"
                >
                  <span>or</span>
                </motion.div>

                {/* Secondary Options */}
                <motion.div
                  variants={fieldVariants}
                  custom={5}
                  className="faang-login-secondary"
                >
                  <p className="faang-login-text">Not a student yet?</p>
                  <a href="/studentportal/register" className="faang-login-cta">
                    Request college enrollment
                  </a>
                </motion.div>

                {/* Footer Links */}
                <motion.div
                  variants={fieldVariants}
                  custom={6}
                  className="faang-login-footer"
                >
                  <a href="/studentportal/help" className="faang-login-help-link">
                    Need help?
                  </a>
                  <span className="faang-login-separator">·</span>
                  <a href="/" className="faang-login-help-link">
                    Back to MentorMuni
                  </a>
                </motion.div>
              </form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="faang-login-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
