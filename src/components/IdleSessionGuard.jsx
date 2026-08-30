import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdleTimeout } from '../lib/idleSession';
import './IdleSessionGuard.css';

/**
 * Idle auto-logout + back/forward session lock for authenticated shells.
 *
 * - 10 min idle → “Still using this portal?” warning
 * - Confirm or use the app within 60s → stay signed in (idle timer resets)
 * - No response within 60s → clear session and replace-navigate to login
 * - After logout, popstate / pageshow / focus re-check keeps protected UI closed
 */
export default function IdleSessionGuard({
  isAuthenticated,
  clearSession,
  loginPath,
  portalLabel = 'portal',
  children,
}) {
  const navigate = useNavigate();

  const goLogin = useCallback(() => {
    clearSession();
    navigate(loginPath, { replace: true });
  }, [clearSession, loginPath, navigate]);

  const { warning, secondsLeft, stayLoggedIn, logoutNow } = useIdleTimeout({
    enabled: true,
    onLogout: goLogin,
  });

  useEffect(() => {
    const kickIfLoggedOut = () => {
      if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        clearSession();
        navigate(loginPath, { replace: true });
      }
    };

    const onPageShow = (e) => {
      if (e.persisted) kickIfLoggedOut();
    };

    const onPopState = () => {
      if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        clearSession();
        navigate(loginPath, { replace: true });
        // Absorb the protected history entry so another Back stays on login.
        try {
          window.history.pushState(null, '', loginPath);
        } catch {
          // ignore
        }
      }
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') kickIfLoggedOut();
    };

    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('popstate', onPopState);
    window.addEventListener('focus', kickIfLoggedOut);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('focus', kickIfLoggedOut);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [clearSession, isAuthenticated, loginPath, navigate]);

  return (
    <>
      {children}
      {warning ? (
        <div
          className="mm-idle-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mm-idle-title"
          aria-describedby="mm-idle-desc"
        >
          <div className="mm-idle-modal">
            <p className="mm-idle-kicker">Session timeout</p>
            <h2 id="mm-idle-title">Are you still using this portal?</h2>
            <p id="mm-idle-desc" className="mm-idle-desc">
              Your {portalLabel} session has been idle for 10 minutes. Confirm within{' '}
              <strong>{secondsLeft}s</strong> to stay signed in, or you will be
              logged out automatically.
            </p>
            <div className="mm-idle-actions">
              <button type="button" className="mm-idle-btn mm-idle-btn--primary" onClick={stayLoggedIn}>
                Yes, still using it
              </button>
              <button
                type="button"
                className="mm-idle-btn mm-idle-btn--ghost"
                data-idle-logout
                onClick={logoutNow}
              >
                Log out now
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
