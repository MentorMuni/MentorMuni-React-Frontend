import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Loader2, Lock, UserRound } from 'lucide-react';
import RoutePageShell from '../layout/RoutePageShell';

const EASE = [0.22, 1, 0.36, 1];

export default function LoginPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId.trim() || !password) return;
    setError('');
    setLoading(true);
    
    // TODO: Implement authentication logic
    window.setTimeout(() => {
      setLoading(false);
      setError('Authentication not implemented yet');
    }, 650);
  };

  return (
    <RoutePageShell scope="marketing" className="mm-login-vibe-root">
      <section className="mm-login-vibe mm-marketing-hero-backdrop" aria-labelledby="login-vibe-heading">
        <div className="mm-login-vibe__noise" aria-hidden />
        <div className="mm-login-vibe__blob mm-login-vibe__blob--1" aria-hidden />
        <div className="mm-login-vibe__blob mm-login-vibe__blob--2" aria-hidden />
        <div className="mm-login-vibe__blob mm-login-vibe__blob--3" aria-hidden />

        <div className="mm-container mm-login-vibe__stage">
          <motion.header className="mm-login-vibe__hero"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }}>
            <h1 id="login-vibe-heading" className="mm-login-vibe__headline">
              <span className="mm-login-vibe__headline-line">Log in.</span>
              <span className="mm-login-vibe__headline-line mm-login-vibe__headline-grad">Get placement-ready.</span>
            </h1>
          </motion.header>

          <div className="mm-login-vibe__layout">
            <div className="mm-login-vibe__main">
              <motion.div className="mm-login-vibe__card-shell"
                initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}>
                <div className="mm-login-vibe__card-glow" aria-hidden />
                <div className="mm-login-vibe__card">
                  <div className="mm-login-vibe__card-top">
                    <div className="mm-login-vibe__avatar" aria-hidden>
                      <UserRound size={22} />
                    </div>
                    <div>
                      <p className="mm-login-vibe__card-eyebrow">Login Portal</p>
                      <h2 className="mm-login-vibe__card-title">Welcome Back</h2>
                    </div>
                  </div>

                  <form className="mm-login-vibe-form" onSubmit={handleSubmit} noValidate>
                    {error && (
                      <motion.p className="mm-login-vibe-form__error" role="alert"
                        initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}>
                        {error}
                      </motion.p>
                    )}

                    <label className="mm-login-vibe-label" htmlFor="login-user-id">User ID</label>
                    <div className="mm-login-vibe-input-wrap">
                      <span className="mm-login-vibe-input-wrap__leading" aria-hidden>
                        <UserRound size={18} strokeWidth={2.25} />
                      </span>
                      <input 
                        id="login-user-id" 
                        type="text" 
                        name="userId" 
                        autoComplete="username" 
                        required
                        placeholder="Enter your user ID"
                        value={userId} 
                        onChange={(e) => setUserId(e.target.value)} 
                        className="mm-login-vibe-input" 
                      />
                    </div>

                    <div className="mm-login-vibe-label-row">
                      <label className="mm-login-vibe-label" htmlFor="login-password">Password</label>
                    </div>
                    <div className="mm-login-vibe-input-wrap">
                      <span className="mm-login-vibe-input-wrap__leading" aria-hidden>
                        <Lock size={18} strokeWidth={2.25} />
                      </span>
                      <input 
                        id="login-password" 
                        type={showPassword ? 'text' : 'password'} 
                        name="password" 
                        autoComplete="current-password"
                        required 
                        placeholder="Enter your password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="mm-login-vibe-input" 
                      />
                      <button 
                        type="button" 
                        className="mm-login-vibe-input-wrap__trailing"
                        onClick={() => setShowPassword(!showPassword)} 
                        aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading || !userId || !password}
                      className="mm-login-vibe-btn mm-login-vibe-btn--full">
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} aria-hidden /> 
                          Logging in...
                        </>
                      ) : (
                        <>
                          Log in <ArrowRight size={18} aria-hidden />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </RoutePageShell>
  );
}
