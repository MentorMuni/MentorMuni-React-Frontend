import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

export default function AIAnalysisLoader({ onComplete, duration = 4000 }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const analysisSteps = [
    'Analyzing your profile...',
    'Scanning technical skills...',
    'Comparing with 5000+ job descriptions...',
    'Evaluating interview readiness...',
    'Generating personalized insights...'
  ];

  const totalSteps = analysisSteps.length;
  const stepDuration = duration / totalSteps;

  useEffect(() => {
    if (currentStep < totalSteps) {
      // Fade in the current message
      setFadeIn(true);

      // Update progress bar
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / (stepDuration / 50));
          return Math.min(newProgress, ((currentStep + 1) / totalSteps) * 100);
        });
      }, 50);

      // Move to next step after step duration
      const stepTimer = setTimeout(() => {
        setFadeIn(false);
        setTimeout(() => {
          if (currentStep < totalSteps - 1) {
            setCurrentStep((prev) => prev + 1);
          } else {
            // All steps complete
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 300);
          }
        }, 300);
      }, stepDuration);

      return () => {
        clearTimeout(stepTimer);
        clearInterval(progressInterval);
      };
    }
  }, [currentStep, stepDuration, totalSteps, onComplete]);

  return (
    <div className="min-h-screen mm-site-theme flex items-center justify-center px-6">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#FF9500]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* Main loader content */}
      <div className="relative z-10 w-full max-w-md">
        {/* AI Icon with pulsing animation */}
        <div className="flex justify-center mb-12">
          <div className="relative w-24 h-24">
            {/* Outer pulsing ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#FF9500]/35 animate-pulse" />
            <div className="absolute inset-2 rounded-full border-2 border-cyan-500/20 animate-pulse animation-delay-1000" />

            {/* Inner icon container */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FF9500]/20 to-blue-600/20 rounded-full backdrop-blur-sm border border-[#FF9500]/35">
              <Zap className="w-12 h-12 text-[#FF9500] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Analysis message */}
        <div className="text-center mb-12">
          <div className="h-12 flex items-center justify-center">
            <p
              className={`text-xl font-semibold text-foreground transition-all duration-300 ${
                fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <span className="bg-gradient-to-r from-[#FF9500] via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {analysisSteps[currentStep]}
              </span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="relative h-2 bg-[#E0DCCF] rounded-full overflow-hidden backdrop-blur-sm border border-border">
            {/* Animated gradient progress bar */}
            <div
              className="h-full bg-gradient-to-r from-[#FF9500] via-cyan-500 to-blue-500 rounded-full transition-all duration-300 ease-out shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.25)]"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>

          {/* Progress percentage */}
          <div className="mt-3 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </p>
            <p className="text-xs text-[#FF9500] font-semibold">
              {Math.round(progress)}%
            </p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-12">
          {analysisSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index < currentStep
                  ? 'bg-gradient-to-r from-[#FF9500] to-[#E88600] w-6'
                  : index === currentStep
                  ? 'bg-[#FFB347] w-8 animate-pulse'
                  : 'bg-[#E0DCCF] w-2'
              }`}
            />
          ))}
        </div>

        {/* Sub-message */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            AI is analyzing your profile to provide personalized insights...
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        .animate-pulse {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @keyframes float-up {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .float-up {
          animation: float-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
