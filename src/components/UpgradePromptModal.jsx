import React, { useState, useEffect } from 'react';
import { X, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UpgradePromptModal({ isOpen, onClose, toolName = 'Resume Analyzer' }) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div
          role="dialog"
          aria-labelledby="upgrade-modal-title"
          className="w-full max-w-sm bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl shadow-2xl p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={18} className="text-muted-foreground" />
          </button>

          <div className="flex items-start gap-3 pr-8">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9500] to-cyan-500 text-white">
              <Zap size={20} />
            </div>
            <div className="min-w-0 pt-0.5">
              <h2 id="upgrade-modal-title" className="text-lg font-black text-white leading-snug">
                Free limit reached
              </h2>
              <p className="mt-1 text-sm text-slate-300 leading-snug">
                <span className="sr-only">{toolName}. </span>
                You&apos;ve used all{' '}
                <span className="font-bold text-[#CC7000]">3 free analyses</span> for this tool.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Link
              to="/contact"
              onClick={handleClose}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Contact us
              <ArrowRight size={18} />
            </Link>
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 px-4 border border-slate-600 text-slate-300 text-sm font-semibold rounded-lg hover:text-white hover:border-slate-500 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
