import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  Clock,
  Gift,
  Layers,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { READINESS_TEST_COUPON_OFFER_HEADLINE, READINESS_TEST_COUPON_OFFER_HOW } from '../constants/brandCopy';
import LimitedRewardLabel from './LimitedRewardLabel';

/**
 * Tools entry for Interview Readiness — uses global theme only (mentorMuniTheme.css).
 * Same assessment as /start-assessment?entry=tools (skips marketing landing).
 */
export default function InterviewReadinessToolsPage() {
  const steps = [
    {
      n: '01',
      title: 'Answer targeted questions',
      body: 'DSA, System Design, HR — matched to how campus drives actually evaluate you.',
    },
    {
      n: '02',
      title: 'See your score & gaps',
      body: 'A single readiness score with a breakdown — not a vague “you’re good at coding.”',
    },
    {
      n: '03',
      title: 'Know what to fix first',
      body: 'Prioritised gaps so you prep efficiently before placement season peaks.',
    },
  ];

  return (
    <div className="min-h-screen mm-site-theme overflow-x-hidden">
      <section className="mm-marketing-hero-backdrop border-b border-border">
        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-12 pt-10 md:pb-16 md:pt-14">
          <nav className="mb-8 flex items-center gap-2 text-xs font-medium">
          <Link to="/tools" className="text-cta transition-colors hover:text-warning-text">
            Tools
          </Link>
          <ChevronRight size={12} className="text-muted-foreground" />
          <span className="text-muted-foreground">Interview Readiness</span>
          </nav>

          <div className="mb-8 rounded-2xl border border-border bg-gradient-to-r from-accent-soft/90 to-secondary/80 px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cta to-cta-mid text-white shadow-sm">
              <Gift size={18} strokeWidth={2} />
            </span>
            <div>
              <div className="mb-1.5 w-fit">
                <LimitedRewardLabel />
              </div>
              <p className="text-sm font-bold leading-tight text-foreground">{READINESS_TEST_COUPON_OFFER_HEADLINE}</p>
              <p className="mt-1 text-xs font-medium leading-snug text-muted-foreground">{READINESS_TEST_COUPON_OFFER_HOW}</p>
            </div>
          </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
          <div className="mb-10 flex-1 lg:mb-0">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cta/30 bg-cta/10 px-3 py-1.5">
              <Sparkles size={13} className="text-cta" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-warning-text">Tools · Assessment</span>
            </div>

            <h1 className="mb-4 text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl md:text-[2.65rem]">
              Interview Readiness <span className="mm-gradient-text-cta">Check</span>
            </h1>

            <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              A focused entry from Tools for the same free assessment. About five minutes, no signup — a score out of 100
              and a clear view of where you stand before your next drive.
            </p>

            <div className="mb-8 flex flex-wrap gap-3">
              {[
                { icon: Clock, text: '~5 min' },
                { icon: Layers, text: 'DSA · SD · HR' },
                { icon: BarChart3, text: 'Score + gaps' },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-semibold text-muted-foreground"
                >
                  <Icon size={14} className="text-cta" />
                  {text}
                </span>
              ))}
            </div>

            <Link
              to="/start-assessment?entry=tools"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-button-strong transition-all hover:bg-cta-hover"
            >
              Start the assessment
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="w-full shrink-0 lg:w-[380px]">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/5">
              <div className="mb-5 flex items-center gap-2 border-b border-border pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cta/25 bg-cta/10">
                  <ClipboardCheck size={18} className="text-cta" />
                </div>
                <span className="text-sm font-bold text-foreground">What happens next</span>
              </div>
              <ol className="space-y-5">
                {steps.map((s) => (
                  <li key={s.n} className="flex gap-4">
                    <span className="w-8 shrink-0 pt-0.5 font-mono text-[11px] font-bold text-cta/80">{s.n}</span>
                    <div>
                      <p className="mb-1 text-sm font-semibold text-foreground">{s.title}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link
                to="/start-assessment?entry=tools"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-cta/45 py-3 text-sm font-semibold text-cta transition-all hover:border-cta-mid/60 hover:bg-accent-soft/80 hover:text-foreground"
              >
                Continue to assessment
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
