import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

/** Visible countdown: 5 minutes */
export const TEST_TIMER_DISPLAY_MS = 5 * 60 * 1000;
/** Auto-submit at 5 min 30 sec */
export const TEST_TIMER_AUTO_SUBMIT_MS = 5 * 60 * 1000 + 30 * 1000;

function formatMmSs(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TestCountdownTimer({ onAutoSubmit, disabled = false }) {
  const reduceMotion = useReducedMotion();
  const [remainingMs, setRemainingMs] = useState(TEST_TIMER_DISPLAY_MS);
  const startRef = useRef(Date.now());
  const firedRef = useRef(false);
  const onAutoSubmitRef = useRef(onAutoSubmit);
  const disabledRef = useRef(disabled);

  onAutoSubmitRef.current = onAutoSubmit;
  disabledRef.current = disabled;

  const remainingSec = Math.ceil(remainingMs / 1000);
  const displaySec = Math.max(0, remainingSec);
  const isUrgent = displaySec <= 60;
  const isCritical = displaySec <= 30;
  const progressPct = Math.min(100, (remainingMs / TEST_TIMER_DISPLAY_MS) * 100);

  const fireAutoSubmit = useCallback(() => {
    if (firedRef.current || disabledRef.current) return;
    firedRef.current = true;
    onAutoSubmitRef.current?.();
  }, []);

  /** Start once per quiz mount — do not reset when parent re-renders (e.g. each answer tap). */
  useEffect(() => {
    startRef.current = Date.now();
    firedRef.current = false;
    setRemainingMs(TEST_TIMER_DISPLAY_MS);

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const left = Math.max(0, TEST_TIMER_DISPLAY_MS - elapsed);
      setRemainingMs(left);

      if (elapsed >= TEST_TIMER_AUTO_SUBMIT_MS) {
        fireAutoSubmit();
      }
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [fireAutoSubmit]);

  useEffect(() => {
    if (remainingMs <= 0 && !firedRef.current) {
      const graceLeft = TEST_TIMER_AUTO_SUBMIT_MS - TEST_TIMER_DISPLAY_MS;
      const t = window.setTimeout(fireAutoSubmit, graceLeft);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [remainingMs, fireAutoSubmit]);

  return (
    <div className="mm-quiz-timer border-b border-border/80">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <motion.span
            animate={
              !reduceMotion && isCritical
                ? { scale: [1, 1.08, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.8, repeat: isCritical ? Infinity : 0 }}
            className={`flex h-7 w-7 items-center justify-center rounded-lg ${
              isCritical
                ? 'bg-red-100 text-red-600'
                : isUrgent
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-secondary text-cta'
            }`}
          >
            {isCritical ? (
              <AlertTriangle className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            ) : (
              <Clock className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            )}
          </motion.span>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              Time remaining
            </p>
            <p
              className={`text-lg font-black tabular-nums leading-none ${
                isCritical ? 'text-red-600' : isUrgent ? 'text-amber-700' : 'text-foreground'
              }`}
            >
              {displaySec > 0 ? formatMmSs(displaySec) : '0:00'}
            </p>
          </div>
        </div>

        <div className="min-w-[6rem] flex-1 max-w-[7.5rem] sm:max-w-xs">
          <div className="h-1 overflow-hidden rounded-full bg-border">
            <motion.div
              className={`h-full rounded-full ${
                isCritical
                  ? 'bg-gradient-to-r from-red-500 to-rose-500'
                  : isUrgent
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-cta to-cyan-500'
              }`}
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="mt-1 text-right text-[10px] text-muted-foreground">
            {displaySec <= 0
              ? 'Auto-submit when all answered…'
              : 'Auto-submit at 5:30 if complete'}
          </p>
        </div>
      </div>
    </div>
  );
}
