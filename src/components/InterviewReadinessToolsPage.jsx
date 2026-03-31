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
 * Tools entry for Interview Readiness — warm cream + orange (MentorMuni marketing theme).
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
    <div className="min-h-screen bg-[#FFFDF8] text-[#1A1A1A] relative overflow-hidden">
      {/* Ambient glow — same language as homepage / mock interviews */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[rgba(255,149,0,0.12)] rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[rgba(255,179,71,0.1)] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-10 pb-16 md:pt-14 md:pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium mb-8">
          <Link to="/tools" className="text-[#FF9500] hover:text-[#CC7000] transition-colors">
            Tools
          </Link>
          <ChevronRight size={12} className="text-slate-600" />
          <span className="text-[#666666]">Interview Readiness</span>
        </nav>

        <div className="mb-8 rounded-2xl border border-orange-200/70 bg-gradient-to-r from-amber-50/95 to-orange-50/40 px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF9500] to-amber-600 text-white shadow-sm">
              <Gift size={18} strokeWidth={2} />
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

        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
          {/* Left column */}
          <div className="flex-1 mb-10 lg:mb-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF9500]/30 bg-[#FF9500]/10 px-3 py-1.5 mb-6">
              <Sparkles size={13} className="text-[#FF9500]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#CC7000]">
                Tools · Assessment
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-[2.65rem] font-black leading-[1.1] tracking-tight mb-4">
              Interview Readiness{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg,#CC7000,#FF9500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Check
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mb-8">
              A focused entry from Tools for the same free assessment. About five minutes, no signup — a score
              out of 100 and a clear view of where you stand before your next drive.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: Clock, text: '~5 min' },
                { icon: Layers, text: 'DSA · SD · HR' },
                { icon: BarChart3, text: 'Score + gaps' },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E0DCCF] bg-[#FFF8EE] px-3 py-2 text-xs font-semibold text-[#444444]"
                >
                  <Icon size={14} className="text-[#FF9500]" />
                  {text}
                </span>
              ))}
            </div>

            <Link
              to="/start-assessment?entry=tools"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF9500] hover:bg-[#E88600] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.3)] transition-all"
            >
              Start the assessment
              <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Right column — steps card */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="rounded-2xl border border-[#E0DCCF] bg-white p-6 shadow-lg shadow-black/5">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#E0DCCF]">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF9500]/10 border border-[#FF9500]/25">
                  <ClipboardCheck size={18} className="text-[#FF9500]" />
                </div>
                <span className="text-sm font-bold text-[#1A1A1A]">What happens next</span>
              </div>
              <ol className="space-y-5">
                {steps.map((s) => (
                  <li key={s.n} className="flex gap-4">
                    <span className="font-mono text-[11px] font-bold text-[#FF9500]/80 w-8 shrink-0 pt-0.5">
                      {s.n}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{s.title}</p>
                      <p className="text-xs text-[#666666] leading-relaxed">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link
                to="/start-assessment?entry=tools"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#FF9500]/45 text-[#FF9500] hover:text-white hover:bg-[#E88600]/10 hover:border-[#FFB347]/60 py-3 text-sm font-semibold transition-all"
              >
                Continue to assessment
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
