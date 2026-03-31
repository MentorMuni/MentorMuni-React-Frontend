import React from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  Calendar,
  Award,
  ArrowRight,
  ChevronRight,
  Mic,
  Sparkles,
  Target,
} from 'lucide-react';

const MockInterviews = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Schedule a Session',
      desc: 'Book mock interviews with experienced mentors and get structured, actionable feedback.',
      cta: 'Join waitlist',
      href: '/waitlist',
    },
    {
      icon: Video,
      title: 'Live Practice',
      desc: 'AI-powered questions and real-time evaluation so you hear how you sound under pressure.',
      cta: 'Check readiness first',
      href: '/start-assessment',
    },
    {
      icon: Award,
      title: 'Track Progress',
      desc: 'See strengths and gaps across DSA, system design, and HR — not generic scores.',
      cta: 'See how it works',
      href: '/how-it-works',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1A1A1A]">
      {/* Ambient background — matches homepage / resume analyzer */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[rgba(255,149,0,0.12)] rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[rgba(255,179,71,0.1)] rounded-full blur-[100px]" />
      </div>

      <div className="relative">
        {/* Hero */}
        <section className="border-b border-[#F0ECE0]">
          <div className="max-w-5xl mx-auto px-6 pt-14 pb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB347] animate-pulse" />
              <span className="text-xs font-bold text-[#FF9500] uppercase tracking-widest">Interview Prep</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF9500]/10 border border-[#FF9500]/25">
                    <Mic size={22} className="text-[#FF9500]" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1A1A1A]">
                    Mock{' '}
                    <span
                      style={{
                        background: 'linear-gradient(90deg,#CC7000,#FF9500)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Interviews
                    </span>
                  </h1>
                </div>
                <p className="text-[#555555] text-base max-w-xl leading-relaxed">
                  Practice with real-time evaluation and feedback aligned to campus and off-campus tech rounds — same visual language as the rest of MentorMuni.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                {[
                  { icon: Sparkles, label: 'AI + mentor path' },
                  { icon: Target, label: 'Role-matched' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 rounded-lg border border-[#E0DCCF] bg-[#FFF8EE] px-3 py-1.5"
                  >
                    <Icon size={13} className="text-[#FF9500]" />
                    <span className="text-xs font-semibold text-[#444444]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {features.map(({ icon: Icon, title, desc, cta, href }) => (
              <div
                key={title}
                className="group rounded-2xl border border-[#E0DCCF] bg-white p-6 shadow-sm transition-all hover:border-[#FF9500]/40 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF9500]/10 border border-[#FF9500]/15 mb-4">
                  <Icon size={20} className="text-[#FF9500]" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{title}</h3>
                <p className="text-sm text-[#666666] leading-relaxed mb-5">{desc}</p>
                <Link
                  to={href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF9500] hover:text-[#CC7000] transition-colors"
                >
                  {cta} <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>

          {/* Coming soon — indigo theme only (no cyan strip) */}
          <div className="rounded-2xl border border-[#FF9500]/25 bg-[#FF9500]/[0.06] overflow-hidden">
            <div className="px-6 py-10 md:px-10 md:py-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF9500]/30 bg-[#FF9500]/10 px-3 py-1 text-xs font-bold text-[#CC7000] mb-4">
                <Sparkles size={12} />
                Coming soon
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A] mb-3">Full mock interview platform</h2>
              <p className="text-[#555555] text-sm max-w-2xl mx-auto leading-relaxed mb-8">
                Live mentors, AI evaluation, and performance analytics — built for engineering students in India. Be among the first to get access.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/waitlist"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF9500] hover:bg-[#E88600] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all"
                >
                  Join the waitlist
                  <ChevronRight size={16} />
                </Link>
                <Link
                  to="/start-assessment"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FF9500]/45 bg-white/80 text-[#FF9500] hover:bg-[#FFF4E0] hover:border-[#FFB347]/60 px-6 py-3 text-sm font-semibold transition-all"
                >
                  Check interview readiness — Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterviews;
