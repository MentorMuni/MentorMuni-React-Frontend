import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, BarChart3, Mail, ArrowRight } from 'lucide-react';

const recruiterContact = '/contact';

const ForRecruiters = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase size={40} className="text-[#FF9500]" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">For Recruiters</h1>
          </div>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Access pre-vetted tech talent with verified skills and interview-ready profiles
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700 hover:border-[#FF9500]/50 transition-colors">
            <Users size={32} className="text-[#FF9500] mb-4" />
            <h3 className="text-xl font-bold mb-3">Pre-vetted talent pool</h3>
            <p className="text-slate-400 mb-6">
              Access candidates who have passed our interview readiness assessment.
            </p>
            <Link
              to={recruiterContact}
              className="text-[#FF9500] hover:text-[#FFB347] font-semibold inline-flex items-center gap-2 transition-colors"
            >
              Talk to us <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700 hover:border-[#FF9500]/50 transition-colors">
            <BarChart3 size={32} className="text-[#FF9500] mb-4" />
            <h3 className="text-xl font-bold mb-3">Skill analytics</h3>
            <p className="text-slate-400 mb-6">
              View skill assessments and performance signals we can share for hiring workflows.
            </p>
            <Link
              to={recruiterContact}
              className="text-[#FF9500] hover:text-[#FFB347] font-semibold inline-flex items-center gap-2 transition-colors"
            >
              Request details <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700 hover:border-[#FF9500]/50 transition-colors">
            <Mail size={32} className="text-[#FF9500] mb-4" />
            <h3 className="text-xl font-bold mb-3">Direct outreach</h3>
            <p className="text-slate-400 mb-6">
              Connect with our team to explore partnerships and candidate introductions.
            </p>
            <Link
              to={recruiterContact}
              className="text-[#FF9500] hover:text-[#FFB347] font-semibold inline-flex items-center gap-2 transition-colors"
            >
              Get started <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-[#FF9500] to-[#E88600] p-[2px] shadow-lg shadow-black/20">
          <div className="bg-slate-900 rounded-2xl p-10 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Hire interview-ready talent</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              MentorMuni helps you engage engineering candidates verified through structured readiness checks.
              Tell us your hiring needs—we&apos;ll follow up from the contact form.
            </p>
            <Link
              to={recruiterContact}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF9500] hover:bg-[#E88600] px-8 py-3.5 font-semibold text-white transition-colors shadow-[0_4px_14px_rgba(255,149,0,0.35)]"
            >
              Schedule a conversation
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForRecruiters;
