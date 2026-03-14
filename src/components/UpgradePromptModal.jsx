import React, { useState, useEffect } from 'react';
import { X, Zap, ArrowRight, Star } from 'lucide-react';
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

  const features = [
    { icon: '∞', text: 'Unlimited analysis' },
    { icon: '🎯', text: 'Personalized roadmap' },
    { icon: '👨‍🏫', text: '1:1 mentor guidance' },
    { icon: '✓', text: 'Interview prep' }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-8 relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-slate-400" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white">
              <Zap size={32} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-black text-white text-center mb-3">
            Free Limit Reached
          </h2>

          {/* Description */}
          <p className="text-center text-slate-300 mb-3">
            You've used all <span className="font-bold text-indigo-300">3 free analyses</span>.
          </p>

          <p className="text-center text-slate-400 text-sm mb-8 leading-relaxed">
            Unlock unlimited analysis, get a personalized career roadmap, and connect with experienced mentors to ace your interviews.
          </p>

          {/* Features list */}
          <div className="space-y-3 mb-8 p-4 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 rounded-xl">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-lg font-bold text-indigo-400">{feature.icon}</span>
                <span className="text-sm text-slate-300">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <Link
            to="/upgrade"
            onClick={handleClose}
            className="w-full py-4 px-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-orange-500/30 active:scale-95 mb-3"
          >
            Upgrade Now
            <ArrowRight size={20} />
          </Link>

          {/* Secondary CTA */}
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 font-semibold rounded-xl transition-all"
          >
            Maybe Later
          </button>

          {/* Trust message */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-center text-xs text-slate-500">
              Join 200+ students already getting interview ready
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
