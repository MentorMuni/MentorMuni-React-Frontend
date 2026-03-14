import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, ClipboardCheck, Compass, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Resume Check",
      description: "Analyze your resume and identify missing keywords, formatting issues, and ATS optimization opportunities that prevent recruiter discovery.",
      icon: FileText,
      color: "indigo"
    },
    {
      number: 2,
      title: "Skill Gap Analysis",
      description: "Compare your current skills with real industry job requirements for your target role. See exactly what companies expect and what you're missing.",
      icon: TrendingUp,
      color: "cyan"
    },
    {
      number: 3,
      title: "Interview Readiness",
      description: "Evaluate your technical knowledge, communication skills, and interview confidence through AI-powered mock interviews and real-time feedback.",
      icon: ClipboardCheck,
      color: "purple"
    },
    {
      number: 4,
      title: "Mentor Roadmap",
      description: "Get a personalized learning plan from experienced mentors based on your gaps, timeline, and career goals. Track progress and stay accountable.",
      icon: Compass,
      color: "emerald"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F1F5F9] pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Your Path to Becoming Job Ready
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            A structured 4-step diagnostic journey designed to transform you into a job-ready tech professional
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-6 relative mb-14">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/30 via-cyan-500/30 via-purple-500/30 to-emerald-500/30"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const colorClasses = {
              indigo: "from-indigo-600 to-indigo-700",
              cyan: "from-cyan-600 to-cyan-700",
              purple: "from-purple-600 to-purple-700",
              emerald: "from-emerald-600 to-emerald-700"
            };

            return (
              <div key={index} className="text-center">
                {/* Badge */}
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${colorClasses[step.color]} rounded-full flex items-center justify-center font-black text-white text-xl shadow-lg z-10 relative`}>
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/start-assessment"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
