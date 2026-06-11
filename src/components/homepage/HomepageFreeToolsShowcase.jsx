import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BarChart2,
  Mic,
  FileSearch,
  Brain,
  GraduationCap,
  BookOpen,
  Cpu,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PRIMARY_CTA_LABEL } from '../../constants/brandCopy';
import { goToStartAssessment } from '../../utils/startAssessmentNavigation';
import { useNewUI } from '../../context/NewUIContext';
import ScrollReveal from '../layout/ScrollReveal';

const FREE_TOOLS = [
  {
    title: 'Readiness check',
    desc: 'DSA, System Design & HR — scored in ~5 min',
    href: '/interview-readiness-tools',
    icon: BarChart2,
    accent: 'from-sky-500 to-cyan-500',
    span: 2,
    featured: true,
  },
  {
    title: 'AI mock interviews',
    desc: 'Practice with instant AI feedback',
    href: '/mock-interviews',
    icon: Mic,
    accent: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Resume ATS checker',
    desc: 'Keywords, format & what filters you out',
    href: '/resume-analyzer',
    icon: FileSearch,
    accent: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Skill gap analyzer',
    desc: 'Role benchmark vs your skills',
    href: '/skill-gap-analyzer',
    icon: Brain,
    accent: 'from-cyan-600 to-teal-500',
  },
  {
    title: 'Placement tracks',
    desc: 'TCS · Infosys · Wipro patterns',
    href: '/placement-tracks',
    icon: GraduationCap,
    accent: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Free tutorials',
    desc: 'Python, Java, C++, SQL & more',
    href: '/free-tutorials',
    icon: BookOpen,
    accent: 'from-blue-600 to-indigo-500',
  },
  {
    title: 'AI tools for interviews',
    desc: 'Copilot, ChatGPT & Cursor guide',
    href: '/ai-tools',
    icon: Cpu,
    accent: 'from-slate-600 to-sky-600',
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HomepageFreeToolsShowcase() {
  const reduceMotion = useReducedMotion();
  const { newUI } = useNewUI();

  return (
    <ScrollReveal
      as="section"
      className="mm-band mm-marketing-section mm-bento-section border-t border-border"
      aria-labelledby="free-tools-showcase-heading"
    >
      <div className="mm-container relative z-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="mb-10 text-center"
        >
          <p
            className={
              newUI
                ? 'mb-3 inline-flex items-center gap-2 mm-new-ui-chip mm-new-ui-chip--sky px-3 py-1 text-[11px] uppercase tracking-[0.14em]'
                : 'mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#15799F]'
            }
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Free toolkit
          </p>
          <h2
            id="free-tools-showcase-heading"
            className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl"
          >
            Everything free to try —{' '}
            <span className="mm-gradient-text-brand">before you enroll</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Like top SaaS products: start with tools, see your gaps, then level up with mentors when you&apos;re ready.
          </p>
        </motion.div>

        <motion.div
          className="mm-bento-grid"
          variants={reduceMotion ? undefined : container}
          initial={reduceMotion ? false : 'hidden'}
          whileInView={reduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.12 }}
        >
          {FREE_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.href}
                variants={reduceMotion ? undefined : item}
                className={tool.span === 2 ? 'mm-bento-span-2' : ''}
              >
                <Link
                  to={tool.href}
                  className={`mm-card-premium group flex h-full min-h-[140px] flex-col p-5 sm:p-6 ${
                    tool.featured ? 'sm:flex-row sm:items-center sm:gap-6' : ''
                  }`}
                >
                  <div
                    className={`mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.accent} text-white shadow-lg shadow-black/10 transition-transform duration-300 group-hover:scale-110 sm:mb-0`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="mm-card-premium__badge">Free</span>
                      {tool.featured && (
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            newUI ? 'text-sky-300' : 'text-[#1A8FC4]'
                          }`}
                        >
                          Start here
                        </span>
                      )}
                    </div>
                    <h3
                      className={`text-lg font-bold text-foreground transition-colors ${
                        newUI ? 'group-hover:text-sky-300' : 'group-hover:text-[#15799F]'
                      }`}
                    >
                      {tool.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{tool.desc}</p>
                    <span
                      className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${
                        newUI ? 'text-sky-400' : 'text-[#1A8FC4]'
                      }`}
                    >
                      Open tool
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <button
            type="button"
            onClick={goToStartAssessment}
            className="mm-cta-glow mm-btn-interactive mm-btn-primary inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white"
          >
            {PRIMARY_CTA_LABEL}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <Link
            to="/tools"
            className={
              newUI
                ? 'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-500/10 px-6 py-3.5 text-sm font-bold text-sky-200 transition-colors hover:border-sky-400/50 hover:bg-sky-500/20'
                : 'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-[#1A8FC4]/40 bg-white px-6 py-3.5 text-sm font-bold text-[#15799F] transition-colors hover:border-[#1A8FC4] hover:bg-sky-50'
            }
          >
            View all tools
          </Link>
        </motion.div>
      </div>
    </ScrollReveal>
  );
}
