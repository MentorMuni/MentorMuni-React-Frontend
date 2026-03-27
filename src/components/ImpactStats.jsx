import React from 'react';
import { Users, Target, Zap } from 'lucide-react';

const ImpactStats = () => {
  const stats = [
    {
      number: "200+",
      label: "Students Mentored",
      description: "Active learners preparing for tech careers",
      icon: Users,
      color: "indigo",
      bgColor: "bg-[#FF9500]/10",
      borderColor: "border-[#FF9500]/25",
      iconColor: "text-[#FF9500]"
    },
    {
      number: "85%",
      label: "Got Interview Calls",
      description: "After completing our interview readiness program",
      icon: Target,
      color: "cyan",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      iconColor: "text-cyan-400"
    },
    {
      number: "50+",
      label: "Companies Cracked",
      description: "Tech companies our students joined",
      icon: Zap,
      color: "emerald",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      iconColor: "text-emerald-400"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Trusted by Students Preparing for Tech Careers
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Real outcomes from real students using MentorMuni to ace their tech interviews
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} ${stat.borderColor} border rounded-2xl p-10 text-center hover:border-opacity-60 transition-all hover:shadow-lg hover:shadow-black/20`}
              >
                {/* Icon Container */}
                <div className="flex justify-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
                    <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                  </div>
                </div>

                {/* Number */}
                <div className={`text-5xl md:text-6xl font-black ${stat.iconColor} mb-2`}>
                  {stat.number}
                </div>

                {/* Label */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-slate-300 text-sm">
            These numbers are growing every day. <span className="text-[#CC7000] font-semibold">You could be next.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
