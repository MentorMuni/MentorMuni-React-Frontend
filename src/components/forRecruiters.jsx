import React from 'react';
import { Briefcase, Users, BarChart3, Mail, ArrowRight } from 'lucide-react';

const ForRecruiters = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase size={40} className="text-blue-400" />
            <h1 className="text-5xl font-bold">For Recruiters</h1>
          </div>
          <p className="text-xl text-slate-300 mb-8">
            Access pre-vetted tech talent with verified skills and interview-ready profiles
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-colors">
            <Users size={32} className="text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Pre-Vetted Talent Pool</h3>
            <p className="text-slate-400 mb-6">
              Access candidates who have passed our rigorous interview readiness assessment.
            </p>
            <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2">
              Browse Talent <ArrowRight size={16} />
            </button>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-colors">
            <BarChart3 size={32} className="text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Skill Analytics</h3>
            <p className="text-slate-400 mb-6">
              View detailed skill assessments and performance metrics for each candidate.
            </p>
            <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2">
              View Analytics <ArrowRight size={16} />
            </button>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-colors">
            <Mail size={32} className="text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Direct Outreach</h3>
            <p className="text-slate-400 mb-6">
              Connect directly with qualified candidates ready for interviews and placements.
            </p>
            <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2">
              Get Started <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-[#E88600] p-1 rounded-2xl">
          <div className="bg-slate-900 p-12 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Hire Interview-Ready Talent</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              MentorMuni connects you with pre-vetted engineering talent verified through our 
              AI-powered interview readiness assessment. Reduce hiring time and improve quality of hires.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-[#E88600] px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForRecruiters;
