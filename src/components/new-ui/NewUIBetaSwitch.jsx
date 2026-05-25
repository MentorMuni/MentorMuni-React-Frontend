import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNewUI } from '../../context/NewUIContext';

/**
 * Classic / Dark theme switch — slim bar under the site header.
 */
export default function NewUIBetaSwitch() {
  const { newUI, setNewUI } = useNewUI();
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="mm-beta-switch-bar"
      data-mm-beta-switch
    >
      <div className="mm-container flex items-center justify-center py-1">
        <div
          role="group"
          aria-label="Site theme"
          className={`mm-beta-switch relative inline-grid grid-cols-2 rounded-full border p-px ${
            newUI
              ? 'mm-beta-switch--new border-cyan-500/30 bg-[#0c121f]/90'
              : 'border-sky-200/90 bg-white shadow-sm'
          }`}
        >
          {!reduceMotion ? (
            <motion.span
              layoutId="mm-beta-switch-thumb"
              className={`absolute inset-px rounded-full ${
                newUI
                  ? 'bg-cyan-500/15 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.3)]'
                  : 'bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)]'
              }`}
              style={{
                width: 'calc(50% - 1px)',
                left: newUI ? 'calc(50%)' : '1px',
              }}
              transition={{ type: 'spring', stiffness: 560, damping: 36 }}
              aria-hidden
            />
          ) : (
            <span
              className={`absolute inset-px rounded-full ${
                newUI
                  ? 'left-[calc(50%)] w-[calc(50%-1px)] bg-cyan-500/15'
                  : 'left-px w-[calc(50%-1px)] bg-white'
              }`}
              aria-hidden
            />
          )}

          <button
            type="button"
            aria-pressed={!newUI}
            onClick={() => setNewUI(false)}
            className={`relative z-[1] rounded-full px-3 py-1 text-[10px] font-semibold leading-none transition-colors sm:px-3.5 sm:text-[11px] ${
              !newUI ? 'text-[#0e5e85]' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Classic
          </button>

          <button
            type="button"
            aria-pressed={newUI}
            onClick={() => setNewUI(true)}
            className={`relative z-[1] rounded-full px-3 py-1 text-[10px] font-semibold leading-none transition-colors sm:px-3.5 sm:text-[11px] ${
              newUI ? 'text-cyan-100' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Dark theme
          </button>
        </div>
      </div>
    </div>
  );
}
