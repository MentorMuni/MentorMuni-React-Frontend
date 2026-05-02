import React, { useEffect, useState } from 'react';
import CTAButtons from './CTAButtons';
import { PRIMARY_CTA_LABEL } from '../constants/brandCopy';
import { Check } from 'lucide-react';

/**
 * Legacy marketing hero — aligned with homepage light canvas (`section-main` / `--bg-primary`).
 * Prefer homepage.jsx hero for the main site; this remains for optional reuse.
 */
const HeroSection = () => {
  const [heroSrc, setHeroSrc] = useState(null);

  useEffect(() => {
    import('../assets/hero-brand-banner.png').then((m) => setHeroSrc(m.default));
  }, []);

  return (
    <section className="section-main relative flex min-h-[90vh] items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40" aria-hidden="true">
        <div className="absolute left-0 top-0 h-96 w-96 animate-blob rounded-full bg-sky-300/30 mix-blend-multiply blur-3xl filter" />
        <div className="animation-delay-2000 absolute right-0 top-1/4 h-80 w-80 animate-blob rounded-full bg-cyan-200/40 mix-blend-multiply blur-3xl filter" />
        <div className="animation-delay-4000 absolute bottom-0 left-1/3 h-72 w-72 animate-blob rounded-full bg-primary/15 mix-blend-multiply blur-3xl filter" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 md:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cta/35 bg-warning-bg/80 px-4 py-2">
              <span className="text-sm font-semibold text-warning-text">✓ Built for Your Success</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl">
                Get Job Ready in Tech
              </h1>
              <p className="text-xl font-bold text-primary md:text-2xl">Prepare for interviews, land your role</p>
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground">
              AI analyzes your resume, skills, and interview readiness in under 3 minutes. Get a personalized roadmap to bridge the gap between where you are and where you want to be.
            </p>

            <div className="rounded-xl border border-border bg-secondary/80 p-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Built for:</strong> 3rd &amp; 4th year students • Fresh graduates • Professionals with 0–5 years experience • Career switchers
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
              <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/25">
                <Check className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-900">
                  Try all tools for free — <span className="text-emerald-700">No signup or credit card required</span>
                </p>
                <p className="mt-1 text-xs text-emerald-800/90">3 free attempts on every assessment tool</p>
              </div>
            </div>

            <div className="pt-4">
              <CTAButtons
                primaryText={PRIMARY_CTA_LABEL}
                primaryHref="/start-assessment"
                secondaryText="Analyze My Resume"
                secondaryHref="/resume-analyzer"
              />
            </div>

            <div className="border-t border-border pt-6">
              <p className="mb-3 text-xs text-muted-foreground">What you&apos;ll get from a free assessment:</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {['Interview Readiness Score', 'Resume ATS Score', 'Personalized Roadmap', 'Skill Gap Analysis'].map((label) => (
                  <span key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-cta" aria-hidden />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative hidden items-center justify-center lg:flex">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-accent-soft/60 to-primary/10 blur-2xl" />
            <div className="relative w-full max-w-md min-h-[300px] animate-float">
              {heroSrc ? (
                <img
                  src={heroSrc}
                  alt="AI-Powered Career Analysis Tools"
                  className="h-auto w-full rounded-2xl drop-shadow-2xl"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="aspect-video w-full rounded-2xl border border-border bg-secondary/80" />
              )}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default HeroSection;
