import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNewUI } from '../../context/NewUIContext';

/**
 * Preview theme switch — sits in a slim bar directly under the site header
 * (not fixed over page content). Compact segmented control.
 */
export default function NewUIBetaSwitch() {
  const { newUI, setNewUI } = useNewUI();
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`mm-beta-switch-bar border-b ${
        newUI
          ? 'border-white/[0.06] bg-[#070b14]/95'
          : 'border-border/60 bg-slate-50/90'
      }`}
      data-mm-beta-switch
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1 sm:px-6 lg:px-8">
        <span
          className={`hidden text-[10px] font-semibold uppercase tracking-[0.16em] sm:inline ${
            newUI ? 'text-slate-500' : 'text-muted-foreground'
          }`}
        >
          Preview
        </span>
        <div
          role="group"
          aria-label="Interface preview"
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
            className={`relative z-[1] inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold leading-none transition-colors sm:px-3.5 sm:text-[11px] ${
              newUI ? 'text-cyan-100' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            New UI
            <span
              className={`rounded px-1 py-px text-[8px] font-bold uppercase leading-none tracking-wider ${
                newUI
                  ? 'bg-amber-400/25 text-amber-200'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Beta
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
