/**
 * Idle session: after IDLE_MS of no interaction, show a warning.
 * If the user does not confirm (or use the app) within WARN_MS, force logout.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export const IDLE_MS = 10 * 60 * 1000;
export const WARN_MS = 60 * 1000;

const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'click',
  'wheel',
];

/**
 * @param {{
 *   enabled?: boolean,
 *   idleMs?: number,
 *   warnMs?: number,
 *   onWarn?: () => void,
 *   onLogout?: () => void,
 * }} [options]
 */
export function useIdleTimeout({
  enabled = true,
  idleMs = IDLE_MS,
  warnMs = WARN_MS,
  onWarn,
  onLogout,
} = {}) {
  const [warning, setWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() => Math.ceil(warnMs / 1000));

  const idleTimer = useRef(null);
  const warnTimer = useRef(null);
  const tickTimer = useRef(null);
  const warnDeadline = useRef(0);
  const warningRef = useRef(false);
  const lastActivity = useRef(0);
  const onLogoutRef = useRef(onLogout);
  const onWarnRef = useRef(onWarn);

  useEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);
  useEffect(() => {
    onWarnRef.current = onWarn;
  }, [onWarn]);

  const clearTimers = useCallback(() => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
    if (warnTimer.current) {
      clearTimeout(warnTimer.current);
      warnTimer.current = null;
    }
    if (tickTimer.current) {
      clearInterval(tickTimer.current);
      tickTimer.current = null;
    }
  }, []);

  const forceLogout = useCallback(() => {
    clearTimers();
    warningRef.current = false;
    setWarning(false);
    onLogoutRef.current?.();
  }, [clearTimers]);

  const startWarn = useCallback(() => {
    if (warningRef.current) return;
    warningRef.current = true;
    setWarning(true);
    warnDeadline.current = Date.now() + warnMs;
    setSecondsLeft(Math.ceil(warnMs / 1000));
    onWarnRef.current?.();

    warnTimer.current = setTimeout(() => {
      forceLogout();
    }, warnMs);

    tickTimer.current = setInterval(() => {
      const left = Math.max(0, Math.ceil((warnDeadline.current - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0 && tickTimer.current) {
        clearInterval(tickTimer.current);
        tickTimer.current = null;
      }
    }, 250);
  }, [forceLogout, warnMs]);

  const armIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      startWarn();
    }, idleMs);
  }, [idleMs, startWarn]);

  const stayLoggedIn = useCallback(() => {
    clearTimers();
    warningRef.current = false;
    setWarning(false);
    setSecondsLeft(Math.ceil(warnMs / 1000));
    armIdle();
  }, [armIdle, clearTimers, warnMs]);

  const noteActivity = useCallback(
    (event) => {
      if (!enabled) return;
      // Explicit "Log out now" must not count as continued use.
      if (event?.target?.closest?.('[data-idle-logout]')) return;

      if (warningRef.current) {
        // Hover alone should not dismiss — require deliberate use.
        if (event?.type === 'mousemove') return;
        stayLoggedIn();
        return;
      }

      const now = Date.now();
      if (now - lastActivity.current < 1000) return;
      lastActivity.current = now;
      armIdle();
    },
    [armIdle, enabled, stayLoggedIn]
  );

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      warningRef.current = false;
      return undefined;
    }

    lastActivity.current = Date.now();
    armIdle();

    ACTIVITY_EVENTS.forEach((evt) => {
      window.addEventListener(evt, noteActivity, { passive: true, capture: true });
    });

    return () => {
      clearTimers();
      ACTIVITY_EVENTS.forEach((evt) => {
        window.removeEventListener(evt, noteActivity, { capture: true });
      });
    };
  }, [enabled, armIdle, clearTimers, noteActivity]);

  return {
    warning: enabled ? warning : false,
    secondsLeft,
    stayLoggedIn,
    logoutNow: forceLogout,
  };
}
