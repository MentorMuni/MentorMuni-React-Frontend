import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Target, BarChart3, Users, Mic2, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { goToStartAssessment } from '../../utils/startAssessmentNavigation';
import { PRIMARY_CTA_LABEL } from '../../constants/brandCopy';

const STEPS = [
  {
    num: '01',
    label: 'Measure',
    title: 'Take the Readiness Check',
    description: 'Get your score across DSA, System Design & HR in 5 minutes. Know exactly where you stand.',
    Icon: Target,
    color: '#1A8FC4',
    gradient: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
  },
  {
    num: '02',
    label: 'Identify',
    title: 'See Your Gap Report',
    description: 'Detailed breakdown by topic. No guessing — you see exactly which areas need work.',
    Icon: BarChart3,
    color: '#FF9500',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    num: '03',
    label: 'Plan',
    title: 'Get Your Roadmap',
    description: 'Personalized preparation path based on your gaps and target companies.',
    Icon: Users,
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  {
    num: '04',
    label: 'Practice',
    title: 'AI Mock Interviews',
    description: 'Voice-based practice with instant feedback on clarity, structure, and depth.',
    Icon: Mic2,
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    num: '05',
    label: 'Improve',
    title: 'Track & Level Up',
    description: 'Re-test weekly. Watch your score climb. Enter interviews with confidence.',
    Icon: TrendingUp,
    color: '#0D9488',
    gradient: 'from-teal-500 to-cyan-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
  },
];

export function MentorMuniSystemLoop({ reduceMotion: reduceMotionProp }) {
  const prefersReduced = useReducedMotion();
  const reduceMotion = Boolean(reduceMotionProp ?? prefersReduced);
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const isInView = useInView(containerRef, { amount: 0.3, once: false });

  useEffect(() => {
    if (reduceMotion || !isInView) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [reduceMotion, isInView]);

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-sky-50/30 py-20 md:py-28"
      aria-labelledby="system-heading"
    >
      {/* Background Elements */}
      {!reduceMotion && (
        <>
          <div className="pointer-events-none absolute left-0 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-sky-200/30 blur-[120px]" />
          <div className="pointer-events-none absolute right-0 bottom-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-teal-200/30 blur-[100px]" />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-800">
            <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
            The MentorMuni System
          </span>
          <h2
            id="system-heading"
            className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl"
          >
            From{' '}
            <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
              "Where Do I Start?"
            </span>
            <br />
            to Interview Ready
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
            A simple 5-step system that takes you from confused preparation to confident interviews.
          </p>
        </motion.div>

        {/* Steps Timeline - Desktop */}
        <div className="mt-16 hidden lg:block">
          {/* Progress Line */}
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute left-0 right-0 top-8 h-1 bg-gray-200 rounded-full" />
            <motion.div
              className="absolute left-0 top-8 h-1 bg-gradient-to-r from-sky-500 via-violet-500 to-teal-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
            
            {/* Step Indicators */}
            <div className="relative flex justify-between">
              {STEPS.map((step, index) => {
                const Icon = step.Icon;
                const isActive = index <= activeStep;
                const isCurrent = index === activeStep;
                
                return (
                  <motion.div
                    key={step.num}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    {/* Circle */}
                    <motion.div
                      className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 transition-all duration-500 ${
                        isActive
                          ? 'border-white bg-gradient-to-br ' + step.gradient + ' shadow-lg'
                          : 'border-gray-200 bg-white'
                      }`}
                      animate={isCurrent && !reduceMotion ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                    >
                      <Icon
                        className={`h-7 w-7 ${isActive ? 'text-white' : 'text-gray-400'}`}
                        strokeWidth={2}
                      />
                      {isCurrent && !reduceMotion && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-white/50"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                    
                    {/* Label */}
                    <span
                      className={`mt-3 text-xs font-bold uppercase tracking-wider ${
                        isActive ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    
                    {/* Title */}
                    <h3
                      className={`mt-2 max-w-[140px] text-center text-sm font-semibold leading-tight ${
                        isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </h3>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Active Step Detail Card */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto mt-12 max-w-2xl"
          >
            <div className={`rounded-2xl border ${STEPS[activeStep].border} ${STEPS[activeStep].bg} p-8 shadow-sm`}>
              <div className="flex items-start gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${STEPS[activeStep].gradient} shadow-lg`}>
                  {React.createElement(STEPS[activeStep].Icon, { className: 'h-7 w-7 text-white', strokeWidth: 2 })}
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-500">Step {STEPS[activeStep].num}</span>
                  <h4 className="mt-1 text-xl font-bold text-gray-900">{STEPS[activeStep].title}</h4>
                  <p className="mt-2 text-gray-600">{STEPS[activeStep].description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Steps Cards - Mobile */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:hidden">
          {STEPS.map((step, index) => {
            const Icon = step.Icon;
            return (
              <motion.div
                key={step.num}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className={`rounded-xl border ${step.border} ${step.bg} p-5 shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${step.gradient}`}>
                    <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500">Step {step.num}</span>
                    <h3 className="mt-0.5 text-sm font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-1 text-xs text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 flex flex-col items-center gap-4 sm:mt-16"
        >
          <button
            type="button"
            onClick={goToStartAssessment}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1A8FC4] to-[#2AAA8A] px-8 py-4 text-base font-bold text-white shadow-[0_8px_30px_-8px_rgba(26,143,196,0.5)] transition-all hover:shadow-[0_12px_40px_-8px_rgba(26,143,196,0.6)] hover:scale-[1.02]"
          >
            {PRIMARY_CTA_LABEL}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="text-sm text-gray-500">
            Takes 5 minutes • No signup required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
