import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, BarChart3, Mail, ArrowRight, CheckCircle, Building2, Target } from 'lucide-react';

const recruiterContact = '/contact?topic=recruiters';

const ForRecruiters = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF8] to-[#FFF8EE] text-foreground">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB347]/40 bg-[#FFF4E0] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#CC7000] mb-4">
            <Building2 size={14} />
            For Hiring Teams
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            Hire <span className="text-[#FF9500]">interview-ready</span> engineers
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Access pre-vetted engineering talent with verified skills, readiness scores, and structured assessment data.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white p-7 rounded-2xl border border-[#F0ECE0] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-[#FFB347]/50 hover:shadow-[0_8px_24px_rgba(255,149,0,0.08)] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FFF4E0] border border-[#F0ECE0] flex items-center justify-center mb-4">
              <Users size={24} className="text-[#FF9500]" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Pre-vetted talent pool</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Access candidates who have completed our interview readiness assessment with verified skill scores.
            </p>
            <Link
              to={recruiterContact}
              className="text-[#FF9500] hover:text-[#E88600] font-semibold text-sm inline-flex items-center gap-1.5 transition-colors"
            >
              Talk to us <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-[#F0ECE0] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-[#FFB347]/50 hover:shadow-[0_8px_24px_rgba(255,149,0,0.08)] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FFF4E0] border border-[#F0ECE0] flex items-center justify-center mb-4">
              <BarChart3 size={24} className="text-[#FF9500]" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Skill analytics</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              View detailed skill assessments, topic breakdowns, and performance signals for your hiring workflow.
            </p>
            <Link
              to={recruiterContact}
              className="text-[#FF9500] hover:text-[#E88600] font-semibold text-sm inline-flex items-center gap-1.5 transition-colors"
            >
              Request details <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-[#F0ECE0] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-[#FFB347]/50 hover:shadow-[0_8px_24px_rgba(255,149,0,0.08)] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FFF4E0] border border-[#F0ECE0] flex items-center justify-center mb-4">
              <Target size={24} className="text-[#FF9500]" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Targeted matching</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Find candidates by specific skills, readiness bands, and college — matched to your job requirements.
            </p>
            <Link
              to={recruiterContact}
              className="text-[#FF9500] hover:text-[#E88600] font-semibold text-sm inline-flex items-center gap-1.5 transition-colors"
            >
              Get started <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* What you get */}
        <div className="bg-white rounded-2xl border border-[#F0ECE0] p-8 md:p-10 mb-14 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-center">What you get with MentorMuni</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              'Candidates with verified readiness scores (DSA, System Design, HR)',
              'Detailed skill breakdown by topic — not just a resume',
              'Filter by college, readiness band, and target role',
              'AI mock interview performance data (where available)',
              'Direct introductions — no middlemen',
              'Bulk hiring support for campus drives',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-foreground-muted">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl border border-[#FFB347]/40 bg-gradient-to-r from-[#FFF8EE] to-[#FFFCF7] p-8 md:p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF9500] to-[#FFB347] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#FF9500]/20">
            <Briefcase size={26} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Ready to hire smarter?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            Tell us your hiring needs — we&apos;ll share how MentorMuni can help you find interview-ready engineering talent.
          </p>
          <Link
            to={recruiterContact}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF9500] hover:bg-[#E88600] px-8 py-4 font-bold text-white transition-colors shadow-[0_4px_14px_rgba(255,149,0,0.30)]"
          >
            Schedule a conversation
            <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">
            Or email us directly at <a href="mailto:hire@mentormuni.com" className="text-[#FF9500] font-medium hover:underline">hire@mentormuni.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForRecruiters;
