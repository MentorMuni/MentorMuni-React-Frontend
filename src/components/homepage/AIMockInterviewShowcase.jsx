import React from 'react';
import { motion } from 'framer-motion';
import { Mic2, MessageSquare, Brain, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeUp from '../layout/FadeUp';

export const AIMockInterviewShowcase = ({ isHeroSection = true }) => {
  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-6, 6, -6],
      transition: {
        duration: 3.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const micVariants = {
    initial: { y: 0, opacity: 0 },
    animate: {
      y: [0, -3, 0],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 320,
        damping: 25,
      },
    }),
  };

  const features = [
    {
      icon: Mic2,
      title: 'Real Voice Practice',
      description: 'Talk with AI that responds naturally',
    },
    {
      icon: Brain,
      title: 'AI Feedback',
      description: 'Instant scores on clarity & confidence',
    },
    {
      icon: MessageSquare,
      title: 'Interview Simulation',
      description: 'Company-like interview questions',
    },
    {
      icon: Zap,
      title: 'Instant Improvement',
      description: 'Track progress across sessions',
    },
  ];

  if (isHeroSection) {
    return (
      <div className="w-full">
        {/* Hero Variant - Compact and Centered */}
        <motion.div
          className="relative mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Main Content Grid */}
          <div className="grid gap-8 items-center lg:grid-cols-2">
            {/* Left: Animated Microphone */}
            <motion.div
              className="relative h-[320px] flex items-center justify-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
            >
              {/* Background gradient */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400/15 via-cyan-400/10 to-blue-400/15 blur-3xl"
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.6, 0.9, 0.6],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-full border border-sky-300/20"
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.8, 0.4, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />

              <motion.div
                className="absolute inset-0 rounded-full border border-sky-300/15"
                animate={{
                  scale: [1, 1.6, 2.2],
                  opacity: [0.6, 0.3, 0],
                }}
                transition={{ duration: 2.5, delay: 0.3, repeat: Infinity, ease: 'easeOut' }}
              />

              {/* Central mic container */}
              <motion.div variants={floatVariants} className="relative z-10">
                <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 shadow-[0_0_30px_rgba(14,165,233,0.4)] flex items-center justify-center">
                  <motion.div variants={micVariants} initial="initial" animate="animate">
                    <Mic2 className="h-10 w-10 text-white" strokeWidth={1.5} />
                  </motion.div>
                </div>
              </motion.div>

              {/* Score indicators */}
              <motion.div
                className="absolute right-4 top-1/4 space-y-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { label: 'Confidence', value: '78%', color: 'from-emerald-400 to-green-500' },
                  { label: 'Clarity', value: '82%', color: 'from-sky-400 to-cyan-500' },
                ].map((metric, i) => (
                  <motion.div
                    key={metric.label}
                    custom={i}
                    variants={{
                      hidden: { opacity: 0, x: 15 },
                      visible: (idx) => ({
                        opacity: 1,
                        x: 0,
                        transition: { delay: idx * 0.12 },
                      }),
                    }}
                    className={`rounded-lg bg-gradient-to-r ${metric.color} px-3 py-1.5 shadow-md`}
                  >
                    <p className="text-xs font-bold text-white">{metric.label}</p>
                    <p className="text-xs font-black text-white">{metric.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Features Grid */}
            <motion.div
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">Practice with AI</h3>
                <p className="text-sm text-muted-foreground">Get interview-ready with our intelligent mock interview coach</p>
              </div>

              <div className="space-y-3">
                {features.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      custom={i}
                      variants={featureVariants}
                      className="flex gap-3 rounded-lg border border-sky-200/40 bg-white/50 backdrop-blur-sm p-3 hover:bg-white/70 transition-colors"
                    >
                      <motion.div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-cyan-500 text-white"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </motion.div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-foreground">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground leading-tight">{feature.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.button
                onClick={() => window.location.href = '/tools/voice-interview'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-xl mm-btn-primary mm-cta-glow min-h-[44px] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl"
              >
                Try AI Mock Interview <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="mm-band mm-marketing-section border-t border-border bg-gradient-to-b from-blue-50/40 via-cyan-50/20 to-sky-50/30" aria-labelledby="ai-interview-heading">
      <div className="mm-container">
        <FadeUp>
          <header className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-700 sm:text-sm">
              AI Interview Coach
            </p>
            <h2
              id="ai-interview-heading"
              className="mm-prose-measure--hero text-balance text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.5rem] md:leading-[1.08]"
            >
              Practice interviews that feel real
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Get instant feedback on your interview skills with our AI-powered mock interview coach. Zero awkwardness, 100% preparation.
            </p>
          </header>
        </FadeUp>

        <FadeUp delay={0.08}>
          <div className="grid gap-12 items-center lg:grid-cols-2">
            {/* Left: Animated AI Voice Visualization */}
            <motion.div
              className="relative h-[400px] flex items-center justify-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
            >
              {/* Background glow */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400/20 via-cyan-400/10 to-blue-400/20 blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Central animated AI icon */}
              <motion.div
                className="relative z-10"
                variants={floatVariants}
              >
                {/* Pulse waves */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={`wave-${i}`}
                    className="absolute inset-0 rounded-full border-2 border-sky-400/30"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{
                      scale: [1, 1.8, 2.2],
                      opacity: [0.6, 0.3, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.5,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                ))}

                {/* Main circle */}
                <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 shadow-[0_0_40px_rgba(14,165,233,0.4)] flex items-center justify-center">
                  <motion.div variants={micVariants} initial="initial" animate="animate">
                    <Mic2 className="h-12 w-12 text-white" strokeWidth={1.5} />
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating text indicators */}
              <motion.div
                className="absolute left-1/2 top-8 -translate-x-1/2 text-center"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-sky-700">
                  Listening...
                </p>
              </motion.div>

              {/* Right side indicators */}
              <motion.div
                className="absolute right-0 top-1/4 space-y-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { label: 'Confidence', value: '78%', color: 'from-green-400 to-emerald-500' },
                  { label: 'Clarity', value: '82%', color: 'from-blue-400 to-sky-500' },
                  { label: 'Content', value: '71%', color: 'from-purple-400 to-violet-500' },
                ].map((metric, i) => (
                  <motion.div
                    key={metric.label}
                    custom={i}
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: (idx) => ({
                        opacity: 1,
                        x: 0,
                        transition: { delay: idx * 0.15 },
                      }),
                    }}
                    className={`rounded-lg bg-gradient-to-r ${metric.color} px-3 py-2 shadow-md`}
                  >
                    <p className="text-xs font-bold text-white">{metric.label}</p>
                    <p className="text-sm font-black text-white">{metric.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Features */}
            <FadeUp delay={0.1}>
              <div className="space-y-6">
                {features.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      custom={i}
                      variants={featureVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-50px' }}
                      className="mm-surface-panel rounded-xl border border-sky-200/40 p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <motion.div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-cyan-500 text-white shadow-md"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <Icon className="h-6 w-6" strokeWidth={1.5} />
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-foreground">{feature.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                  className="pt-4"
                >
                  <Link
                    to="/tools/voice-interview"
                    className="inline-flex items-center gap-2 rounded-xl mm-btn-primary mm-cta-glow min-h-[48px] px-8 py-3 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl"
                  >
                    Try AI Mock Interview <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </div>
            </FadeUp>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
