import React from 'react';
import { CheckCircle2, Zap } from 'lucide-react';

const FreeTrialBanner = () => {
  const benefits = [
    {
      icon: CheckCircle2,
      text: "3 Free Resume Analysis",
      description: "Optimize before you apply"
    },
    {
      icon: CheckCircle2,
      text: "3 Free Interview Assessments",
      description: "Practice with real-time feedback"
    },
    {
      icon: CheckCircle2,
      text: "No Credit Card Required",
      description: "Start immediately"
    }
  ];

  return (
    <section className="py-12 md:py-16 px-6 bg-gradient-to-r from-[#FF9500]/5 via-purple-500/5 to-blue-500/5 border-y border-[#FF9500]/25">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <Zap className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Start for Free
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-[#FF9500]/35 hover:border-[#FF9500]/60 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-[0_4px_14px_rgba(255,149,0,0.25)] flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="mb-4">
                  <Icon className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>

                {/* Main Text */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                  {benefit.text}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-300">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Trust Statement */}
        <div className="mt-12 text-center">
          <p className="text-slate-300 text-sm max-w-2xl mx-auto">
            Join <span className="text-[#CC7000] font-semibold">200+ students</span> who are already using MentorMuni to prepare for their dream tech roles. 
            No commitment. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreeTrialBanner;
