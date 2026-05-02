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
    <div className="min-h-screen mm-site-theme overflow-x-hidden">
      {/* Hero — same cool mesh as homepage / tools (mentorMuniTheme: .mm-marketing-hero-backdrop) */}
      <section className="mm-marketing-hero-backdrop border-b border-border">
        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-12 pt-20">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cta-mid" />
              <span className="text-xs font-bold uppercase tracking-widest text-cta">Interview Prep</span>
            </div>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cta/25 bg-cta/10">
                    <Mic size={22} className="text-cta" />
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                    Mock <span className="mm-gradient-text-cta">Interviews</span>
                  </h1>
                </div>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                  Practice with real-time evaluation and feedback aligned to campus and off-campus tech rounds — same
                  visual language as the rest of MentorMuni.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {[
                  { icon: Sparkles, label: 'AI + mentor path' },
                  { icon: Target, label: 'Role-matched' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5"
                  >
                    <Icon size={13} className="text-cta" />
                    <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* Feature cards */}
      <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-12 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, cta, href }) => (
              <div
                key={title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:border-cta/40 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-cta/15 bg-cta/10">
                  <Icon size={20} className="text-cta" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                <Link
                  to={href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-cta transition-colors hover:text-warning-text"
                >
                  {cta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent-soft/70 via-background to-secondary shadow-[var(--shadow-card)]">
            <div className="px-6 py-10 text-center md:px-10 md:py-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cta/30 bg-cta/10 px-3 py-1 text-xs font-bold text-warning-text">
                <Sparkles size={12} />
                Coming soon
              </div>
              <h2 className="mb-3 text-2xl font-black text-foreground md:text-3xl">Full mock interview platform</h2>
              <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Live mentors, AI evaluation, and performance analytics — built for engineering students in India. Be among
                the first to get access.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/waitlist"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-lg shadow-button transition-all hover:bg-cta-hover"
                >
                  Join the waitlist
                  <ChevronRight size={16} />
                </Link>
                <Link
                  to="/start-assessment"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-cta/45 bg-card px-6 py-3 text-sm font-semibold text-cta transition-all hover:border-cta-mid/60 hover:bg-accent-soft/80"
                >
                  Check interview readiness — Free
                </Link>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default MockInterviews;
