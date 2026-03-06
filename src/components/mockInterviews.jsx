import React from 'react';
import { Video, Calendar, Award, ArrowRight } from 'lucide-react';

const MockInterviews = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <a 
          href="/learning-paths"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold mb-8 transition-colors"
        >
          ← Back to Learning Paths
        </a>
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Video size={40} className="text-indigo-400" />
            <h1 className="text-5xl font-bold">Mock Interviews</h1>
          </div>
          <p className="text-xl text-slate-300 mb-8">
            Practice with real-time evaluation and expert feedback
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors">
            <Calendar size={32} className="text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Schedule a Session</h3>
            <p className="text-slate-400 mb-6">
              Book mock interviews with experienced mentors and get real-time feedback.
            </p>
            <button className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-2">
              Learn More <ArrowRight size={16} />
            </button>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors">
            <Video size={32} className="text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Live Practice</h3>
            <p className="text-slate-400 mb-6">
              Practice with AI-powered real-time question generation and instant evaluation.
            </p>
            <button className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-2">
              Start Now <ArrowRight size={16} />
            </button>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors">
            <Award size={32} className="text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Get Certified</h3>
            <p className="text-slate-400 mb-6">
              Complete interview preparations and receive certificates recognized by industry.
            </p>
            <button className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-2">
              Explore <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 p-1 rounded-2xl">
          <div className="bg-slate-900 p-12 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Full mock interview platform with live mentors, AI evaluation, and performance analytics. 
              Be among the first to experience our improved interview prep.
            </p>
            <button className="bg-gradient-to-r from-indigo-600 to-cyan-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterviews;
