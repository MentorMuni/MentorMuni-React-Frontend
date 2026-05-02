import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, BarChart3, Mail, ArrowRight, CheckCircle, Building2, Target } from 'lucide-react';

const recruiterContact = '/contact?topic=recruiters';

const ForRecruiters = () => {
  return (
    <div className="min-h-screen mm-site-theme overflow-x-hidden text-foreground">
      <section className="mm-marketing-hero-backdrop border-b border-border">
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-14 pt-20 text-center md:pb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-warning-bg/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-warning-text">
            <Building2 size={14} className="text-cta" aria-hidden />
            For Hiring Teams
          </div>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">
            Hire <span className="mm-gradient-text-cta">interview-ready</span> engineers
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Access pre-vetted engineering talent with verified skills, readiness scores, and structured assessment data.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        {/* Features Grid */}
        <div className="mb-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)] transition-all hover:border-cta/30 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-accent-soft">
              <Users size={24} className="text-cta" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">Pre-vetted talent pool</h3>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              Access candidates who have completed our interview readiness assessment with verified skill scores.
            </p>
            <Link
              to={recruiterContact}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cta transition-colors hover:text-warning-text"
            >
              Talk to us <ArrowRight size={14} />
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)] transition-all hover:border-cta/30 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-accent-soft">
              <BarChart3 size={24} className="text-cta" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">Skill analytics</h3>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              View detailed skill assessments, topic breakdowns, and performance signals for your hiring workflow.
            </p>
            <Link
              to={recruiterContact}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cta transition-colors hover:text-warning-text"
            >
              Request details <ArrowRight size={14} />
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)] transition-all hover:border-cta/30 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-accent-soft">
              <Target size={24} className="text-cta" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">Targeted matching</h3>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              Find candidates by specific skills, readiness bands, and college — matched to your job requirements.
            </p>
            <Link
              to={recruiterContact}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cta transition-colors hover:text-warning-text"
            >
              Get started <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* What you get */}
        <div className="mb-14 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)] md:p-10">
          <h2 className="mb-6 text-center text-xl font-bold text-foreground md:text-2xl">What you get with MentorMuni</h2>
          <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
            {[
              'Candidates with verified readiness scores (DSA, System Design, HR)',
              'Detailed skill breakdown by topic — not just a resume',
              'Filter by college, readiness band, and target role',
              'AI mock interview performance data (where available)',
              'Direct introductions — no middlemen',
              'Bulk hiring support for campus drives',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-accent-soft/70 via-background to-secondary p-8 text-center shadow-[var(--shadow-card)] md:p-12">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cta to-cta-mid shadow-lg shadow-button">
            <Briefcase size={26} className="text-white" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">Ready to hire smarter?</h2>
          <p className="mx-auto mb-8 max-w-xl leading-relaxed text-muted-foreground">
            Tell us your hiring needs — we&apos;ll share how MentorMuni can help you find interview-ready engineering talent.
          </p>
          <Link
            to={recruiterContact}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-8 py-4 font-bold text-white shadow-button transition-colors hover:bg-cta-hover"
          >
            Schedule a conversation
            <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">
            Or email us directly at{' '}
            <a href="mailto:hire@mentormuni.com" className="font-medium text-cta hover:underline">
              hire@mentormuni.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForRecruiters;
