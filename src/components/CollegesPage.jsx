import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import SiteFooter from './layout/SiteFooter';
import InnerRouteShell from './new-ui/InnerRouteShell';
import FadeUp from './layout/FadeUp';
import ScrollReveal from './layout/ScrollReveal';
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  BarChart3,
  Clock,
  Zap,
  Target,
  BookOpen,
  Phone,
  MessageCircle,
} from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ═══════════════════════════════════════════════════════════════
// ROI HERO SECTION
// ═══════════════════════════════════════════════════════════════
function CollegeHeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50/60 pt-16 pb-12 md:pt-24 md:pb-20">
      {/* Animated background */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-blue-200/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-emerald-200/15 blur-[80px]" />

      <div className="mm-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700 mb-6">
            <TrendingUp size={14} />
            For College TPOs
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-foreground mb-6 tracking-tight">
            Improve Your College Placements by{' '}
            <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              40% in 90 Days
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            200+ colleges already transform their placement outcomes. Real data. Real results. Real confidence in student readiness.
          </p>

          {/* Hero Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10"
          >
            {[
              { stat: '40%', label: 'Faster Placements', color: 'from-blue-400 to-cyan-400' },
              { stat: '87%', label: 'Higher Clear Rate', color: 'from-emerald-400 to-teal-400' },
              { stat: '2-3x', label: 'Better Offers', color: 'from-violet-400 to-purple-400' },
            ].map((item, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <div className={`rounded-xl border border-white/80 bg-gradient-to-br ${item.color}/10 p-4 backdrop-blur-sm`}>
                  <p className="text-3xl font-black text-foreground mb-1">{item.stat}</p>
                  <p className="text-xs font-bold uppercase text-muted-foreground">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <a
            href="https://calendly.com/mentormuni"
            target="_blank"
            rel="noopener noreferrer"
            className="mm-btn-primary mm-cta-glow inline-flex items-center gap-2 rounded-xl px-8 py-4 text-white font-bold"
          >
            Book 30-Min Strategy Call <ArrowRight size={18} />
          </a>
          <button className="mm-btn-secondary border-2 border-blue-600/80 rounded-xl px-6 py-4 text-blue-600 font-bold inline-flex items-center gap-2 transition hover:bg-secondary">
            Download ROI Report <BarChart3 size={18} />
          </button>
        </motion.div>

        {/* Trust Indicators - Anonymized */}
        <FadeUp delay={0.4}>
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-6">
              Trusted by 200+ Colleges Nationwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {['Tier-1 Colleges', 'Engineering Institutes', 'Private Universities', 'State Universities', 'Professional Programs'].map((category, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
                >
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  {category}
                </motion.span>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROBLEM SECTION - Validate TPO Pain
// ═══════════════════════════════════════════════════════════════
function ProblemSection() {
  const problems = [
    {
      icon: Users,
      title: 'Invisible Student Prep',
      metric: 'You discover who\'s ready on interview day',
      impact: '← Too late to intervene. Lower offers.',
      color: 'from-rose-400 to-red-500',
    },
    {
      icon: Clock,
      title: 'Manual Assessment Takes 6+ Weeks',
      metric: 'Dead time before prep actually starts',
      impact: '← Students lose momentum. Confidence drops.',
      color: 'from-orange-400 to-amber-500',
    },
    {
      icon: BarChart3,
      title: 'Inconsistent Quality Across Batch',
      metric: 'Top students excel, average students get lost',
      impact: '← Wide placement variance. Harder to show ROI.',
      color: 'from-purple-400 to-violet-500',
    },
    {
      icon: BookOpen,
      title: 'No Data for Stakeholders',
      metric: 'Can\'t prove improvement to AICTE/management',
      impact: '← Harder budget justification next year.',
      color: 'from-indigo-400 to-blue-500',
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t bg-gradient-to-b from-white to-slate-50/40">
      <div className="mm-container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-rose-50/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-rose-700 mb-4">
            <Target size={14} />
            The Reality
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Most Colleges Struggle With 4 Critical Challenges
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You know these problems. Your students do too. Here\'s what changes with Mentor Muni.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {problems.map((problem, idx) => {
            const Icon = problem.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <div className={`rounded-2xl border-2 border-${problem.color.split('-')[1]}-200 bg-gradient-to-br ${problem.color}/10 p-6 hover:shadow-lg transition-shadow`}>
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${problem.color} text-white shrink-0`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-lg mb-2">{problem.title}</h3>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">{problem.metric}</p>
                      <p className="text-xs leading-relaxed text-foreground/80">{problem.impact}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SOLUTION SECTION - 90-Day Timeline
// ═══════════════════════════════════════════════════════════════
function SolutionSection() {
  const phases = [
    {
      days: 'Days 0-7',
      title: 'Smart Onboarding',
      tpoActions: ['Invite batch', 'Set company targets', 'Configure roles'],
      systemDoes: 'Assigns personalized prep path per student',
      studentSees: 'Resume check + quick assessment',
      tpoSees: '87 enrolled, 23 flagged for early help',
      metric: 'Real-time enrollment tracking',
      color: 'from-sky-400 to-cyan-400',
    },
    {
      days: 'Days 8-45',
      title: 'Intensive Prep Phase',
      tpoActions: ['Monitor progress', 'Identify students needing help', 'Check weekly reports'],
      systemDoes: 'AI assessments + mock interviews + 24/7 buddy support',
      studentSees: 'Personalized study plan + daily practice',
      tpoSees: '45 students 50%+ ready • 12 need intervention • Top 10 interview-ready',
      metric: 'Weekly readiness percentage updates',
      color: 'from-violet-400 to-purple-400',
    },
    {
      days: 'Days 46-90',
      title: 'Placement Execution',
      tpoActions: ['Track interview outcomes', 'Collect feedback', 'Prepare analytics report'],
      systemDoes: 'Final readiness checks + HR communication practice',
      studentSees: 'Interview-ready confirmation',
      tpoSees: '78 students cleared 1st round • Avg offer: 8.2 LPA • Time-to-offer: 14 days',
      metric: 'Live placement tracking dashboard',
      color: 'from-emerald-400 to-teal-400',
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t bg-gradient-to-b from-white via-blue-50/20 to-white">
      <div className="mm-container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-700 mb-4">
            <Zap size={14} />
            The Solution
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            90-Day Placement Transformation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            College-first timeline. Minimal TPO overhead. Maximum student outcomes.
          </p>
        </motion.div>

        <div className="space-y-6">
          {phases.map((phase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`rounded-2xl border-2 border-${phase.color.split('-')[1]}-200 bg-gradient-to-r ${phase.color}/5 overflow-hidden`}
            >
              {/* Timeline header */}
              <div className={`px-6 py-4 bg-gradient-to-r ${phase.color}/20 border-b-2 border-${phase.color.split('-')[1]}-200`}>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className={`text-sm font-bold uppercase tracking-[0.15em] text-${phase.color.split('-')[1]}-700 mb-1`}>
                      {phase.days}
                    </p>
                    <h3 className="text-xl font-bold text-foreground">{phase.title}</h3>
                  </div>
                  <div className={`px-4 py-2 rounded-lg bg-gradient-to-br ${phase.color}/80 text-white`}>
                    <p className="text-xs font-bold text-white/90">{phase.metric}</p>
                  </div>
                </div>
              </div>

              {/* Timeline content */}
              <div className="p-6 grid md:grid-cols-2 gap-8">
                {/* Left: What happens */}
                <div>
                  <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">What System Does</p>
                    <p className="text-base font-semibold text-foreground">{phase.systemDoes}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">Student Sees</p>
                    <p className="text-base font-semibold text-foreground">{phase.studentSees}</p>
                  </div>
                </div>

                {/* Right: What TPO sees */}
                <div>
                  <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">TPO Actions</p>
                    <ul className="space-y-2">
                      {phase.tpoActions.map((action, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">TPO Dashboard Shows</p>
                    <div className={`rounded-lg border-2 border-${phase.color.split('-')[1]}-200 bg-${phase.color.split('-')[1]}-50 p-3`}>
                      <p className="text-sm font-semibold text-foreground">{phase.tpoSees}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// LIVE TPO DASHBOARD DEMO
// ═══════════════════════════════════════════════════════════════
function DashboardDemoSection() {
  return (
    <ScrollReveal as="section" className="py-16 md:py-24 border-t bg-gradient-to-b from-white to-blue-50/30 mm-scroll-reveal--scale">
      <div className="mm-container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-700 mb-4">
            <BarChart3 size={14} />
            Real-Time Visibility
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Live TPO Dashboard: Know Student Readiness 24 Hours After Mock
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No dashboards to build. No weekly excel sheets. Real-time insights into your entire batch.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border-2 border-blue-200/80 bg-gradient-to-br from-blue-50 via-white to-cyan-50/60 shadow-2xl overflow-hidden"
        >
          {/* Dashboard Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-white/90">Batch Dashboard</p>
                <h3 className="text-2xl font-bold">2024 Placement Cohort</h3>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/90">Status: Day 45/90</p>
                <p className="text-xl font-bold">87% Ready for Interview</p>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-8 space-y-8">
            {/* Key Metrics */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">Key Metrics</p>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { label: 'Ready for Interview', value: '87%', trend: '↑ 12% this week', color: 'from-emerald-400 to-teal-400' },
                  { label: 'Students Prepped', value: '45', trend: '↑ 5 since Friday', color: 'from-sky-400 to-cyan-400' },
                  { label: 'Flagged for Help', value: '12', trend: 'Needs intervention', color: 'from-amber-400 to-orange-400' },
                  { label: 'Avg Mock Score', value: '7.2/10', trend: '↑ Improving daily', color: 'from-violet-400 to-purple-400' },
                ].map((metric, idx) => (
                  <motion.div key={idx} variants={itemVariants} className={`rounded-xl border-2 border-white/80 bg-gradient-to-br ${metric.color}/10 p-4`}>
                    <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">{metric.label}</p>
                    <p className="text-[11px] text-foreground/70">{metric.trend}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Skill Gap Analysis */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">Batch Skill Gap Analysis</p>
              <div className="space-y-4">
                {[
                  { skill: 'Communication Clarity', percentage: 68, status: 'Needs Work', color: 'from-rose-400 to-red-400' },
                  { skill: 'Coding Fundamentals', percentage: 82, status: 'Strong', color: 'from-emerald-400 to-teal-400' },
                  { skill: 'System Design', percentage: 71, status: 'Improving', color: 'from-amber-400 to-orange-400' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{item.skill}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">{item.percentage}%</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">{item.status}</span>
                      </div>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 + 0.3, duration: 1 }}
                        className={`h-full bg-gradient-to-r ${item.color}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Items */}
            <div className="p-4 rounded-xl border-2 border-emerald-200/80 bg-emerald-50/50">
              <p className="text-sm font-bold text-emerald-700 mb-3">🎯 Recommended Actions for TPO</p>
              <ul className="space-y-2">
                {[
                  'Focus: 12 flagged students need 1:1 communication coaching (2 weeks plan)',
                  'Monitor: Top 10 students are interview-ready—can start placement talks',
                  'Track: System Design weak area—recommend pattern-based practice',
                ].map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Export & Share */}
            <div className="flex flex-wrap gap-3 justify-between items-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                💾 Auto-syncs with your HRMS / TMS
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg border border-border bg-white text-foreground font-semibold text-sm hover:bg-secondary transition">
                  Export to CSV
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition">
                  Share with Admin
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </ScrollReveal>
  );
}

// ═══════════════════════════════════════════════════════════════
// CASE STUDIES SECTION
// ═══════════════════════════════════════════════════════════════
function CaseStudiesSection() {
  const cases = [
    {
      college: 'Partner College 1',
      before: { placement: '67%', offers: 'Avg 6.8 LPA' },
      after: { placement: '91%', offers: 'Avg 8.4 LPA' },
      improvement: '36% placement boost',
      quote: 'Real data-driven insights helped us make confident decisions for our placement program',
      color: 'from-sky-400 to-cyan-400',
    },
    {
      college: 'Partner College 2',
      before: { placement: 'Avg 6.2 LPA', time: '60 days to placement' },
      after: { placement: 'Avg 8.1 LPA', time: '28 days to placement' },
      improvement: '30% salary increase',
      quote: 'Students demonstrated more systematic preparation and confidence in interviews',
      color: 'from-emerald-400 to-teal-400',
    },
    {
      college: 'Partner College 3',
      before: { clear: '82% interview clear', feedback: 'Generic feedback' },
      after: { clear: '94% interview clear', feedback: 'Specific skill feedback' },
      improvement: '15% interview clear rate',
      quote: 'Most transparent and data-backed placement program we\'ve implemented',
      color: 'from-violet-400 to-purple-400',
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t bg-gradient-to-b from-white to-slate-50/40">
      <div className="mm-container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700 mb-4">
            <TrendingUp size={14} />
            Proof
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How We\'ve Transformed College Placements
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {cases.map((item, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <div className={`relative group h-full rounded-2xl border-2 border-${item.color.split('-')[1]}-200 bg-gradient-to-br ${item.color}/10 p-6 hover:shadow-lg transition-all`}>
                <div className="space-y-5">
                  {/* Header */}
                  <div>
                    <p className={`text-sm font-bold uppercase tracking-[0.1em] text-${item.color.split('-')[1]}-700 mb-2`}>
                      {item.college}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.improvement}</p>
                  </div>

                  {/* Before/After */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-white/60 p-3">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Before</p>
                      <div className="space-y-1">
                        {Object.entries(item.before).map(([k, v]) => (
                          <div key={k} className="text-xs text-foreground/70">
                            <span className="font-semibold text-foreground">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={`rounded-lg bg-gradient-to-br ${item.color}/20 p-3 border border-${item.color.split('-')[1]}-200`}>
                      <p className="text-[10px] font-bold uppercase text-foreground mb-2">After</p>
                      <div className="space-y-1">
                        {Object.entries(item.after).map(([k, v]) => (
                          <div key={k} className="text-xs">
                            <span className="font-bold text-foreground">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm italic text-muted-foreground">
                      "{item.quote}"
                    </p>
                    <p className="text-xs font-semibold text-foreground mt-2">— TPO, {item.college}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// WHAT YOU GET SECTION
// ═══════════════════════════════════════════════════════════════
function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: 'Real-Time Batch Dashboard',
      description: 'Live readiness tracking with zero manual effort',
      benefit: 'Know student status 24h after mock',
      color: 'from-sky-400 to-cyan-400',
    },
    {
      icon: Users,
      title: 'Automated Skill Assessment',
      description: '5 standardized test types across all students',
      benefit: 'Identify weak students early',
      color: 'from-emerald-400 to-teal-400',
    },
    {
      icon: Zap,
      title: 'AI-Powered Mock Interviews',
      description: 'Unlimited practice for all students 24/7',
      benefit: 'Students prep 5-10x more without faculty burden',
      color: 'from-violet-400 to-purple-400',
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Skill gap reports, cohort trends, year-over-year',
      benefit: 'Data for AICTE reporting and council meetings',
      color: 'from-amber-400 to-orange-400',
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t bg-gradient-to-b from-blue-50/20 via-white to-white">
      <div className="mm-container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-700 mb-4">
            <Zap size={14} />
            What You Get
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Everything Your College Needs
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <div className={`rounded-2xl border-2 border-white/80 bg-gradient-to-br ${feature.color}/10 p-6 hover:shadow-lg transition-shadow`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} text-white shrink-0`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-lg">{feature.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                  <p className="text-sm font-semibold text-foreground">{feature.benefit}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// IMPLEMENTATION SECTION
// ═══════════════════════════════════════════════════════════════
function ImplementationSection() {
  return (
    <section className="py-16 md:py-24 border-t bg-gradient-to-b from-white to-emerald-50/30">
      <div className="mm-container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700 mb-4">
            <Clock size={14} />
            Simple Implementation
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Live in Your College in 48 Hours
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Zero code. Zero hassle. One CSV upload away from real-time insights.
          </p>
        </motion.div>

        <div className="space-y-6 max-w-3xl mx-auto">
          {[
            {
              step: 1,
              title: 'Connect Your Students (2 hours)',
              action: 'Send us student CSV',
              tpo: 'We validate and setup',
              metric: 'All students onboarded in TMS',
            },
            {
              step: 2,
              title: 'Configure Company Targets (1 hour)',
              action: 'Set roles and target packages',
              tpo: 'We configure in dashboard',
              metric: 'Custom prep paths auto-assigned',
            },
            {
              step: 3,
              title: 'Launch to Students (30 min)',
              action: 'Send invite email to batch',
              tpo: 'Students onboard themselves',
              metric: 'Dashboard live with real data by Day 3',
            },
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="relative"
            >
              <div className="absolute left-0 top-8 flex flex-col items-center z-10">
                <div className="h-8 w-8 rounded-full border-3 border-white bg-gradient-to-br from-emerald-400 to-teal-400 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                  {step.step}
                </div>
                {idx < 2 && (
                  <div className="w-1 h-16 bg-gradient-to-b from-emerald-400 to-emerald-200 mt-2" />
                )}
              </div>

              <div className="ml-16 rounded-2xl border-2 border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white p-6 hover:shadow-lg transition-shadow">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-emerald-700 mb-2">What TPO Does</p>
                    <p className="text-base font-semibold text-foreground">{step.action}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-emerald-700 mb-2">What We Do</p>
                    <p className="text-base font-semibold text-foreground">{step.tpo}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-emerald-700 mb-2">Outcome</p>
                    <p className="text-base font-semibold text-foreground">{step.metric}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 p-6 rounded-2xl border-2 border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-white text-center"
        >
          <p className="text-lg font-bold text-foreground mb-2">Result: Full system live with real data by Day 3</p>
          <p className="text-sm text-muted-foreground">No implementation costs. No technical overhead. Just results.</p>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// FINAL CTA SECTION
// ═══════════════════════════════════════════════════════════════
function FinalCTASection() {
  return (
    <ScrollReveal as="section" className="py-16 md:py-24 border-t bg-gradient-to-b from-blue-50/40 via-white to-white mm-scroll-reveal--scale">
      <div className="mm-container max-w-3xl mx-auto text-center">
        <FadeUp>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Ready to Transform Your<br />
            <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              College Placements?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a 30-minute strategy call with our team. See the dashboard live. Understand your placement potential in your college context.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="https://calendly.com/mentormuni"
              target="_blank"
              rel="noopener noreferrer"
              className="mm-btn-primary mm-cta-glow inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-white font-bold"
            >
              Book 30-Min Strategy Call <ArrowRight size={18} />
            </a>
            <a
              href="tel:+919876543210"
              className="mm-btn-secondary border-2 border-blue-600/80 inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-blue-600 font-bold transition hover:bg-secondary"
            >
              <Phone size={18} />
              Call Directly
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            Or join our <button className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-700 border-0 bg-transparent p-0 cursor-pointer">next group demo on Thursday</button>
          </p>
        </FadeUp>

        {/* Social Proof */}
        <FadeUp delay={0.2}>
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-6">
              200+ colleges improving placements this year
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm font-semibold text-muted-foreground">
              {['40% faster placements', 'On avg 90% clear rate', '2-3x better offers', 'Real-time visibility'].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="p-3 rounded-lg bg-secondary/50"
                >
                  {stat}
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </ScrollReveal>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function CollegesPage() {
  usePageMeta({
    title: 'For Colleges | Mentor Muni - Improve Placements by 40%',
    description: 'Transform your college placements. Real-time dashboard. 90% interview clear rate. 40% faster placements. Trusted by 200+ colleges.',
    keywords: 'college placement, TPO, placement mentor, campus hiring, student readiness',
  });

  return (
    <InnerRouteShell scope="marketing">
      <div className="mm-colleges-root mm-site-theme relative overflow-x-hidden">
        <CollegeHeroSection />
        <ProblemSection />
        <SolutionSection />
        <DashboardDemoSection />
        <CaseStudiesSection />
        <FeaturesSection />
        <ImplementationSection />
        <FinalCTASection />
        <SiteFooter />
      </div>
    </InnerRouteShell>
  );
}
