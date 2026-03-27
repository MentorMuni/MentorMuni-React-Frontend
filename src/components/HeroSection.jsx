import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CTAButtons from './CTAButtons';
import { PRIMARY_CTA_LABEL } from '../constants/brandCopy';
import { Check } from 'lucide-react';
// TrustIndicators and CompanyLogos are rendered on the homepage directly beneath the Hero

const HeroSection = () => {
  const [heroSrc, setHeroSrc] = useState(null);

  useEffect(() => {
    import('../assets/hero-brand-banner.png').then((m) => setHeroSrc(m.default));
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden section-main">
      {/* Decorative Gradient Blobs */}
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF9500] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 max-w-xl">
            {/* Confidence Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF9500]/15 border border-[#FFB347]/40">
              <span className="text-sm font-semibold text-[#CC7000]">✓ Built for Your Success</span>
            </div>

            {/* Main Headline - Job Outcome Focused */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-300">
                  Get Job Ready in Tech
                </span>
              </h1>
              <p className="text-xl md:text-2xl font-bold text-blue-300">
                Prepare for interviews, land your role
              </p>
            </div>

            {/* Subheadline - Value Proposition */}
            <p className="text-lg text-slate-300 leading-relaxed">
              AI analyzes your resume, skills, and interview readiness in under 3 minutes. Get a personalized roadmap to bridge the gap between where you are and where you want to be.
            </p>

            {/* Trust Message */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
              <p className="text-sm text-slate-300">
                <strong className="text-white">Built for:</strong> 3rd & 4th year students • Fresh graduates • Professionals with 0–5 years experience • Career switchers
              </p>
            </div>

            {/* Free Usage Highlight */}
            <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex-shrink-0 mt-1">
                <div className="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/30">
                  <Check className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-100">
                  Try all tools for free — <span className="text-emerald-300">No signup or credit card required</span>
                </p>
                <p className="text-xs text-emerald-200 mt-1">3 free attempts on every assessment tool</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4">
              <CTAButtons 
                primaryText={PRIMARY_CTA_LABEL}
                primaryHref="/start-assessment"
                secondaryText="Analyze My Resume"
                secondaryHref="/resume-analyzer"
              />
              {/* Trust indicators and company logos moved to homepage to avoid duplication */}
            </div>

            {/* Social Proof / Quick Stats */}
            <div className="border-t border-slate-700 pt-6">
              <p className="text-xs text-slate-500 mb-3">What you'll get from a free assessment:</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-[#FF9500]" /> Interview Readiness Score
                </span>
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-[#FF9500]" /> Resume ATS Score
                </span>
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-[#FF9500]" /> Personalized Roadmap
                </span>
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-[#FF9500]" /> Skill Gap Analysis
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Illustration/Visual */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF9500]/10 to-blue-600/10 rounded-3xl blur-2xl"></div>
            <div className="relative animate-float w-full max-w-md min-h-[300px]">
              {heroSrc ? (
                <img 
                  src={heroSrc} 
                  alt="AI-Powered Career Analysis Tools" 
                  className="w-full h-auto drop-shadow-2xl rounded-2xl" 
                  loading="eager" 
                  decoding="async" 
                />
              ) : (
                <div className="w-full aspect-video rounded-2xl bg-slate-800/50 border border-slate-700/50" />
              )}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default HeroSection;
