import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Brain, TrendingUp } from 'lucide-react';
import { PRIMARY_CTA_LABEL } from '../constants/brandCopy';

const CareerJourney = () => {
  const steps = [
    {
      number: 1,
      title: "Upload & Analyze Your Resume",
      description: "Let AI evaluate your resume against job descriptions. Get your ATS score and understand how recruiters will see you.",
      icon: FileText,
      color: "indigo",
      bgGradient: "from-[#FF9500] to-[#E88600]",
      textColor: "indigo-400",
      borderColor: "indigo-500/20",
      href: "/resume-analyzer"
    },
    {
      number: 2,
      title: "Discover Your Skill Gaps",
      description: "AI identifies exactly what skills you need to land your target role. Get a clear roadmap tailored to your career goals.",
      icon: Brain,
      color: "cyan",
      bgGradient: "from-cyan-600 to-cyan-700",
      textColor: "cyan-400",
      borderColor: "cyan-500/20",
      href: "/skill-gap-analyzer"
    },
    {
      number: 3,
      title: "Measure Interview Readiness",
      description: "Test your knowledge with AI-powered mock interviews. Get detailed feedback and improvement suggestions instantly.",
      icon: TrendingUp,
      color: "purple",
      bgGradient: "from-purple-600 to-purple-700",
      textColor: "purple-400",
      borderColor: "purple-500/20",
      href: "/start-assessment"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            How MentorMuni Works
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Three simple steps to understand where you stand and what's holding you back from your dream tech job
          </p>
        </div>

        {/* Steps Container */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9500]/20 via-cyan-500/20 to-purple-500/20"></div>

          {/* Steps */}
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/20 border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600 transition-all h-full flex flex-col">
                  {/* Step Number Badge */}
                  {step.color === "indigo" && (
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.bgGradient} rounded-full flex items-center justify-center mb-6 flex-shrink-0 relative z-10 shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.2)]`}>
                      <span className="text-2xl font-black text-white">{step.number}</span>
                    </div>
                  )}
                  {step.color === "cyan" && (
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.bgGradient} rounded-full flex items-center justify-center mb-6 flex-shrink-0 relative z-10 shadow-lg shadow-cyan-500/30`}>
                      <span className="text-2xl font-black text-white">{step.number}</span>
                    </div>
                  )}
                  {step.color === "purple" && (
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.bgGradient} rounded-full flex items-center justify-center mb-6 flex-shrink-0 relative z-10 shadow-lg shadow-purple-500/30`}>
                      <span className="text-2xl font-black text-white">{step.number}</span>
                    </div>
                  )}

                  {/* Step Icon */}
                  <div className="mb-4 flex-shrink-0">
                    {step.color === "indigo" && (
                      <div className="w-12 h-12 rounded-xl bg-[#FF9500]/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#FF9500]" />
                      </div>
                    )}
                    {step.color === "cyan" && (
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-cyan-400" />
                      </div>
                    )}
                    {step.color === "purple" && (
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 flex-grow">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* CTA Link */}
                  {step.color === "indigo" && (
                    <Link 
                      to={step.href} 
                      className="inline-flex items-center gap-2 text-[#FF9500] font-semibold text-sm group hover:gap-3 transition-all"
                    >
                      Start now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                  {step.color === "cyan" && (
                    <Link 
                      to={step.href} 
                      className="inline-flex items-center gap-2 text-cyan-400 font-semibold text-sm group hover:gap-3 transition-all"
                    >
                      Start now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                  {step.color === "purple" && (
                    <Link 
                      to={step.href} 
                      className="inline-flex items-center gap-2 text-purple-400 font-semibold text-sm group hover:gap-3 transition-all"
                    >
                      Start now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Below Steps */}
        <div className="mt-14 text-center">
          <p className="text-muted-foreground mb-6">All tools are completely free with your first 3 attempts on each.</p>
          <Link 
            to="/start-assessment" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#E88600] hover:from-[#FF9500] hover:to-[#CC7000] text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group"
          >
            <span>{PRIMARY_CTA_LABEL}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CareerJourney;
