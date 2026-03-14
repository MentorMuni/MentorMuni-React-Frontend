import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Brain, ClipboardCheck, TrendingUp, ArrowRight } from 'lucide-react';

const Tools = () => {
  const tools = [
    {
      id: 1,
      title: "Resume Analyzer",
      description: "Get your resume scored for ATS compatibility. See exactly what's holding you back from recruiter discovery.",
      icon: FileText,
      color: "indigo",
      href: "/resume-analyzer",
      highlights: ["ATS Score", "Keyword Analysis", "Format Optimization"]
    },
    {
      id: 2,
      title: "Skill Gap Analyzer",
      description: "Compare your skills with industry requirements for your target role. Get a detailed roadmap to close gaps.",
      icon: Brain,
      color: "cyan",
      href: "/skill-gap-analyzer",
      highlights: ["Skills Assessment", "Industry Benchmarking", "Learning Plan"]
    },
    {
      id: 3,
      title: "Interview Readiness",
      description: "Evaluate your interview preparation with AI-powered mock interviews and get instant feedback.",
      icon: ClipboardCheck,
      color: "purple",
      href: "/start-assessment",
      highlights: ["Mock Interviews", "Real-time Feedback", "Score Tracking"]
    },
    {
      id: 4,
      title: "Mentor Guidance",
      description: "Get personalized guidance from experienced mentors who have cracked top tech companies.",
      icon: TrendingUp,
      color: "emerald",
      href: "/learning-paths",
      highlights: ["1:1 Mentorship", "Career Roadmap", "Job Placement Support"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F1F5F9] pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Powerful Tools for Career Success
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to prepare for tech interviews and land your dream job
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const colorMap = {
              indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400" },
              cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400" },
              purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
              emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" }
            };
            const colors = colorMap[tool.color];

            return (
              <Link
                key={tool.id}
                to={tool.href}
                className={`${colors.bg} ${colors.border} border rounded-2xl p-8 hover:border-opacity-60 transition-all hover:shadow-lg hover:shadow-black/20 group`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-white mb-2">{tool.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">{tool.description}</p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tool.highlights.map((highlight) => (
                    <span key={highlight} className="text-xs px-3 py-1 rounded-full bg-slate-700/50 text-slate-300">
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className={`inline-flex items-center gap-2 ${colors.text} font-semibold text-sm group-hover:gap-3 transition-all`}>
                  Try now
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-slate-300 mb-6">
            All tools are free to start: <span className="text-emerald-300 font-semibold">3 attempts each</span>
          </p>
          <Link
            to="/start-assessment"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Tools;
