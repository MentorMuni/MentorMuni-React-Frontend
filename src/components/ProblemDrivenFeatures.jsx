import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, TrendingDown, Clock, Zap } from 'lucide-react';

const ProblemDrivenFeatures = () => {
  const features = [
    {
      id: 1,
      problem: "Why You're Not Getting Interview Calls",
      description: "Your resume might be invisible to recruiters. We analyze it against ATS systems and real job requirements.",
      icon: AlertCircle,
      color: "#EF4444",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      textColor: "text-red-400",
      href: "/resume-analyzer",
      cta: "Analyze My Resume"
    },
    {
      id: 2,
      problem: "What Companies Actually Expect From You",
      description: "The gap between what you know and what your target role requires. We identify exactly what's missing.",
      icon: TrendingDown,
      color: "#F97316",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      textColor: "text-orange-400",
      href: "/skill-gap-analyzer",
      cta: "Check Your Gaps"
    },
    {
      id: 3,
      problem: "Is Your Interview Preparation Really Enough?",
      description: "Test yourself under real interview conditions. Get instant feedback on technical knowledge and communication.",
      icon: Clock,
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      textColor: "text-purple-400",
      href: "/start-assessment",
      cta: "Take Assessment"
    },
    {
      id: 4,
      problem: "Your Personal Roadmap To Success",
      description: "Based on your gaps and goals, get a structured plan from experienced mentors on learning and landing the job.",
      icon: Zap,
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      textColor: "text-emerald-400",
      href: "/assessment-result",
      cta: "Get Your Roadmap"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 bg-gradient-to-b from-slate-900/40 to-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Real Problems. Real Solutions.
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Every student and fresher faces these challenges. Let's tackle them together.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link 
                key={feature.id}
                to={feature.href}
                className={`group relative ${feature.bgColor} ${feature.borderColor} border rounded-2xl p-8 hover:border-opacity-50 transition-all hover:shadow-lg hover:shadow-black/20 active:scale-95`}
              >
                {/* Icon Container */}
                <div className={`w-12 h-12 ${feature.bgColor} border ${feature.borderColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${feature.textColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-slate-100 transition-colors">
                  {feature.problem}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* CTA */}
                <div className={`inline-flex items-center gap-2 ${feature.textColor} font-semibold text-sm group-hover:gap-3 transition-all`}>
                  {feature.cta}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Engagement CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6 text-sm">
            All assessments are free: <span className="text-emerald-300 font-semibold">No signup. No credit card.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemDrivenFeatures;
