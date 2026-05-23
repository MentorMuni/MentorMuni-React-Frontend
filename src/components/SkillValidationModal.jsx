import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

/**
 * Compact centered alert — one skill hint (not a full-screen modal).
 */
export default function SkillValidationModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Light scrim — no blur */}
          <motion.button
            type="button"
            aria-label="Dismiss"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/25"
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="skill-alert-title"
            aria-describedby="skill-alert-desc"
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="relative w-full max-w-[min(100%,20rem)] rounded-2xl border border-orange-200/80 bg-white px-4 py-4 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.25)] ring-1 ring-black/[0.04]"
          >
            <div className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Info className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p id="skill-alert-title" className="text-sm font-bold text-foreground">
                  One skill only
                </p>
                <p id="skill-alert-desc" className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Enter one skill only (e.g. React, JavaScript) — no commas or spaces. Max 15 characters for sharper questions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full rounded-xl bg-cta py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105 active:scale-[0.98]"
            >
              Okay
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
