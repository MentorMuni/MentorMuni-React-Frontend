import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, ClipboardCheck, Compass, ArrowRight, Zap } from 'lucide-react';

const CareerReadinessJourney = () => {
  const steps = [
    {
      number: 1,
      title: "Resume Check",
      description: "Analyze your resume and identify missing keywords, formatting issues, and ATS optimization opportunities that prevent recruiter discovery.",
      icon: FileText,
      color: "indigo",
      href: "/resume-analyzer"
    },
    {
      number: 2,
      title: "Skill Gap Analysis",
      description: "Compare your current skills with real industry job requirements for your target role. See exactly what companies expect and what you're missing.",
      icon: TrendingUp,
      color: "cyan",
      href: "/skill-gap-analyzer"
    },
    {
      number: 3,
      title: "Interview Readiness",
      description: "Evaluate your technical knowledge, communication skills, and interview confidence through AI-powered mock interviews and real-time feedback.",
      icon: ClipboardCheck,
      color: "purple",
      href: "/start-assessment"
    },
    {
      number: 4,
      title: "Mentor Roadmap",
      description: "Get a personalized learning plan from experienced mentors based on your gaps, timeline, and career goals. Track progress and stay accountable.",
      icon: Compass,
      color: "emerald",
      href: "/learning-paths"
    }
  ];

  const colorStyles = {
    indigo: {
      badge: "bg-gradient-to-br from-indigo-600 to-indigo-700",
      icon: "bg-indigo-500/20 text-indigo-400",
      line: "from-indigo-500/30",
      card: "border-indigo-500/20 hover:border-indigo-500/50 hover:shadow-indigo-500/10",
      cta: "text-indigo-400"
    },
    cyan: {
      badge: "bg-gradient-to-br from-cyan-600 to-cyan-700",
      icon: "bg-cyan-500/20 text-cyan-400",
      line: "via-cyan-500/30",
      card: "border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/10",
      cta: "text-cyan-400"
    },
    purple: {
      badge: "bg-gradient-to-br from-purple-600 to-purple-700",
      icon: "bg-purple-500/20 text-purple-400",
      line: "via-purple-500/30",
      card: "border-purple-500/20 hover:border-purple-500/50 hover:shadow-purple-500/10",
      cta: "text-purple-400"
    },
    emerald: {
      badge: "bg-gradient-to-br from-emerald-600 to-emerald-700",
      icon: "bg-emerald-500/20 text-emerald-400",
      line: "to-emerald-500/30",
      card: "border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-emerald-500/10",
      cta: "text-emerald-400"
    }
  };

  return (
    <section className="py-16 md:py-24 px-6 section-dark border-y" style={{ borderColor: 'var(--border-color)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-on-dark mb-4">
            Your Path to Becoming Job Ready
          </h2>
          <p className="text-lg text-on-dark-sub max-w-2xl mx-auto">
            A structured 4-step diagnostic journey designed to transform you into a job-ready tech professional
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-emerald-500/20 opacity-60"></div>

          {/* Steps */}
          {steps.map((step, index) => {
            const style = colorStyles[step.color];
            const Icon = step.icon;

            return (
              <div key={index} className="relative">
                {/* Step Badge */}
                  <div className="flex justify-center mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-on-dark text-xl shadow-lg relative z-10`} style={{ background: `linear-gradient(135deg, var(--primary), var(--secondary))` }}>
                      {step.number}
                    </div>
                  </div>

                {/* Step Card */}
                <Link 
                  to={step.href}
                  className={`card-dark ${style.card || ''} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col h-full group`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4`} style={{ background: 'rgba(99,102,241,0.08)' }}>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-on-dark mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-on-dark-sub text-sm leading-relaxed mb-6 flex-grow">
                    {step.description}
                  </p>

                  {/* CTA */}
                  <div className={`inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all`}>
                    Start here <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-full px-6 py-3 mb-6">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-indigo-200 font-semibold">Takes about 15-20 minutes • Free forever</span>
          </div>
          <Link 
            to="/resume-analyzer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
          >
            Start Your Diagnostic Journey Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CareerReadinessJourney;
