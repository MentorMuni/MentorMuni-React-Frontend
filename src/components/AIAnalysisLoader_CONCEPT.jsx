import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, Cpu, TrendingUp, CheckCircle2, Sparkles, Rocket } from 'lucide-react';

/**
 * MODERN GENZ + PROFESSIONAL LOADING SCREEN CONCEPT
 * 
 * Features:
 * - Eye-catching animated background with gradient mesh
 * - Large animated AI brain icon with particle effects
 * - Step progression with smooth animations
 * - Engaging micro-copy with personality
 * - Real-time progress visualization
 * - Floating particles/stars background
 * - Gradient text and modern typography
 * - Smooth transitions between steps
 * - Success celebration at the end
 */

export default function AIAnalysisLoaderModern({ onComplete, duration = 4000 }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    {
      title: '🧠 Analyzing Your Profile',
      subtitle: 'Deep diving into your background...',
      icon: Brain,
      color: 'from-purple-500 to-blue-500',
    },
    {
      title: '⚡ Scanning Skills',
      subtitle: 'Reading between the lines of your expertise...',
      icon: Cpu,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: '📊 Comparing Patterns',
      subtitle: 'Cross-referencing with 5000+ job descriptions...',
      icon: TrendingUp,
      color: 'from-cyan-500 to-teal-500',
    },
    {
      title: '🚀 Generating Questions',
      subtitle: 'Crafting your personalized question set...',
      icon: Rocket,
      color: 'from-teal-500 to-green-500',
    },
    {
      title: '✨ Final Polish',
      subtitle: 'Adding those final AI touches...',
      icon: Sparkles,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const totalSteps = steps.length;
  const stepDuration = duration / totalSteps;

  useEffect(() => {
    if (currentStep < totalSteps) {
      // Update progress continuously
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / (stepDuration / 50));
          return Math.min(newProgress, ((currentStep + 1) / totalSteps) * 100);
        });
      }, 50);

      // Move to next step after step duration
      const stepTimer = setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsComplete(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 800);
        }
      }, stepDuration);

      return () => {
        clearTimeout(stepTimer);
        clearInterval(progressInterval);
      };
    }
  }, [currentStep, stepDuration, totalSteps, onComplete]);

  const CurrentIcon = steps[currentStep]?.icon || Brain;
  const currentGradient = steps[currentStep]?.color || 'from-purple-500 to-blue-500';

  return (
    <div className="min-h-screen mm-site-theme flex items-center justify-center px-4 py-8 overflow-hidden relative">
      {/* Animated gradient background mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient blob */}
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Secondary gradient blob */}
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)' }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Main icon with animation */}
        <div className="flex justify-center mb-12">
          <motion.div
            className="relative w-32 h-32"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Outer rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-teal-400 bg-clip-border"
              style={{ borderRadius: '50%' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, linear: true }}
            />
            <motion.div
              className="absolute inset-3 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-400 bg-clip-border"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, linear: true }}
            />

            {/* Center icon */}
            <motion.div
              className={`absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br ${currentGradient} shadow-2xl`}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                key={currentStep}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.4 }}
              >
                <CurrentIcon className="w-16 h-16 text-white drop-shadow-lg" strokeWidth={1.5} />
              </motion.div>
            </motion.div>

            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-full blur-2xl bg-gradient-to-br ${currentGradient} opacity-50 -z-10`} />
          </motion.div>
        </div>

        {/* Step content */}
        <div className="text-center mb-12">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r ${currentGradient} bg-clip-text text-transparent`}>
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {steps[currentStep].subtitle}
            </p>
          </motion.div>
        </div>

        {/* Progress bar with gradient */}
        <div className="mb-8">
          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden backdrop-blur-sm border border-gray-300 dark:border-gray-600">
            {/* Animated gradient progress */}
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-teal-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
            </motion.div>
          </div>

          {/* Progress text */}
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-3 mb-12">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-3 rounded-full transition-all ${
                index < currentStep
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 w-8'
                  : index === currentStep
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 w-10'
                  : 'bg-gray-300 dark:bg-gray-600 w-3'
              }`}
              animate={index === currentStep ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Fun fact or tip */}
        <motion.div
          className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-gray-900/50 dark:to-gray-800/50 border border-purple-200 dark:border-gray-700 backdrop-blur-sm"
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {currentStep === 0 && "💡 AI is comparing your skills against 10,000+ successful candidates..."}
            {currentStep === 1 && "⚡ Finding patterns in your technical expertise..."}
            {currentStep === 2 && "🎯 Matching your profile to real interview questions..."}
            {currentStep === 3 && "🚀 Creating your personalized question set..."}
            {currentStep === 4 && "✨ Almost there! Getting ready to show you the results..."}
          </p>
        </motion.div>

        {/* Success message (appears at end) */}
        {isComplete && (
          <motion.div
            className="mt-8 flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
            >
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </motion.div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Ready to Go! 🎉
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your questions are ready. Let's start...
            </p>
          </motion.div>
        )}
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

/**
 * KEY DESIGN FEATURES FOR MODERN APPEAL:
 * 
 * 1. GenZ-Friendly Elements:
 *    - Emoji usage in titles and messages
 *    - Fun, engaging micro-copy with personality
 *    - Modern gradient colors (purple → cyan → teal)
 *    - Dynamic animations that feel alive
 * 
 * 2. Professional Elements:
 *    - Clean typography hierarchy
 *    - Smooth, purposeful animations
 *    - Dark mode support
 *    - Accessible color contrasts
 * 
 * 3. Engagement Features:
 *    - Changing icons for each step
 *    - Real-time progress visualization
 *    - Floating particles in background
 *    - Fun facts/tips for each step
 *    - Success celebration at the end
 * 
 * 4. Technical Excellence:
 *    - Framer Motion for smooth animations
 *    - Hardware-accelerated transforms
 *    - Performant gradient animations
 *    - Responsive design (mobile-first)
 * 
 * USAGE:
 * Replace AIAnalysisLoader with AIAnalysisLoaderModern in interviewready.jsx
 */
