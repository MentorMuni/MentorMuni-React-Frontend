import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Brain, ClipboardCheck, TrendingUp, ArrowRight, Gift } from 'lucide-react';
import {
  READINESS_TEST_COUPON_BADGE,
  READINESS_TEST_COUPON_OFFER_HEADLINE,
  READINESS_TEST_COUPON_OFFER_HOW,
} from '../constants/brandCopy';
import LimitedRewardLabel from './LimitedRewardLabel';

const Tools = () => {
  const tools = [
    {
      id: 1,
      title: 'Resume ATS checker',
      description:
        'See how applicant systems score your resume—keywords, structure, and what is quietly filtering you out before a human reads it.',
      icon: FileText,
      color: 'orange',
      href: '/resume-analyzer',
      highlights: ['ATS score', 'Keyword gaps', 'Format fixes'],
    },
    {
      id: 2,
      title: 'Skill gap analyzer',
      description:
        'Compare your skills to what your target role expects. Get a prioritized gap list and a learning direction—not a generic syllabus.',
      icon: Brain,
      color: 'cyan',
      href: '/skill-gap-analyzer',
      highlights: ['Role benchmark', 'Gap map', 'Next steps'],
    },
    {
      id: 3,
      title: 'Interview readiness score',
      description:
        'A short assessment across DSA, system design, and HR. One score out of 100 plus concrete gaps—so you know what to fix first.',
      icon: ClipboardCheck,
      color: 'purple',
      href: '/interview-readiness-tools',
      highlights: ['~5 minutes', 'No signup', 'Instant breakdown'],
    },
    {
      id: 4,
      title: 'Mentor guidance',
      description:
        '1:1 support from people who have cleared the same rounds you are preparing for—aligned to your stack and timeline.',
      icon: TrendingUp,
      color: 'emerald',
      href: '/learning-paths',
      highlights: ['1:1 sessions', 'Roadmap', 'Placement focus'],
    },
  ];

  const colorMap = {
    orange: {
      bg: 'bg-[#FF9500]/10',
      border: 'border-[#FF9500]/25',
      text: 'text-[#E88600]',
      hover: 'hover:border-[#FF9500]/50',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/25',
      text: 'text-cyan-700',
      hover: 'hover:border-cyan-500/40',
    },
    purple: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/25',
      text: 'text-violet-700',
      hover: 'hover:border-violet-500/40',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/25',
      text: 'text-emerald-700',
      hover: 'hover:border-emerald-500/40',
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-20 pb-20">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[min(55vh,420px)] bg-gradient-to-b from-[#FF9500]/[0.09] to-transparent -z-10" aria-hidden />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#CC7000] mb-3">
            Free tools · Same mission as the rest of MentorMuni
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] mb-4 tracking-tight leading-tight">
            Know your gaps before the shortlist does
          </h1>
          <p className="text-base md:text-lg text-[#666666] leading-relaxed">
            Measure first, then fix what filters you out—without guessing where to start.
          </p>
        </motion.div>

        <div className="mb-10 max-w-3xl mx-auto rounded-2xl border border-orange-200/70 bg-gradient-to-r from-amber-50/95 to-[#FFF8EE] px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF9500] to-amber-600 text-white shadow-sm">
              <Gift size={20} strokeWidth={2} />
            </span>
            <div>
              <div className="mb-1.5 w-fit">
                <LimitedRewardLabel />
              </div>
              <p className="text-sm font-bold leading-tight text-[#1A1A1A]">{READINESS_TEST_COUPON_OFFER_HEADLINE}</p>
              <p className="mt-1 text-xs font-medium leading-snug text-[#666666]">{READINESS_TEST_COUPON_OFFER_HOW}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            const c = colorMap[tool.color];

            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
              <Link
                to={tool.href}
                className={`group block h-full rounded-2xl border bg-white p-7 shadow-card transition-all ${c.border} ${c.hover} hover:shadow-lg hover:-translate-y-0.5`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border ${c.bg} ${c.border}`}
                >
                  <Icon className={`h-6 w-6 ${c.text}`} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#CC7000] transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed mb-5">{tool.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {tool.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="text-xs px-2.5 py-1 rounded-full bg-[#FFF8EE] border border-[#F0ECE0] text-[#555555] font-medium"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className={`inline-flex items-center gap-2 font-semibold text-sm ${c.text}`}>
                  Open tool
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-14 rounded-2xl border border-[#F0ECE0] bg-[#FFF8EE] px-6 py-8 text-center"
        >
          <p className="text-sm text-[#666666] mb-5 max-w-xl mx-auto">
            Start with the <span className="font-semibold text-[#1A1A1A]">readiness score</span> to see where you stand in minutes —{' '}
            <span className="font-semibold text-[#9A3412]">{READINESS_TEST_COUPON_BADGE}</span>.
            Other tools stay free to try with fair usage limits.
          </p>
          <Link
            to="/start-assessment"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF9500] px-8 py-3.5 font-bold text-white shadow-button transition-all hover:bg-[#E88600]"
          >
            Check my readiness — free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Tools;
