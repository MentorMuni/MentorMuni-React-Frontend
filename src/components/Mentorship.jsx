import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, TrendingUp, Award, ArrowRight } from 'lucide-react';

const Mentorship = () => {
  const features = [
    {
      id: 1,
      title: "1:1 Mentor Guidance",
      description: "Get personalized guidance from experienced engineers who have cracked top tech companies.",
      icon: Users,
      color: "indigo"
    },
    {
      id: 2,
      title: "Career Roadmap",
      description: "Create a structured learning plan tailored to your target role, timeline, and career goals.",
      icon: Target,
      color: "cyan"
    },
    {
      id: 3,
      title: "Interview Preparation",
      description: "Intensive interview prep with mock interviews, real-time feedback, and personalized improvement plans.",
      icon: TrendingUp,
      color: "purple"
    },
    {
      id: 4,
      title: "Job Placement Support",
      description: "Get support with application strategy, negotiation tips, and placement into top tech companies.",
      icon: Award,
      color: "emerald"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-muted-foreground pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Learn from Industry Mentors
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Get guidance from experienced engineers and tech leaders who have successfully navigated tech careers
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-14">
          {features.map((feature) => {
            const Icon = feature.icon;
            const colorMap = {
              indigo: { bg: "bg-[#FF9500]/10", border: "border-[#FF9500]/25", icon: "text-[#FF9500]" },
              cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", icon: "text-cyan-400" },
              purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", icon: "text-purple-400" },
              emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "text-emerald-400" }
            };
            const colors = colorMap[feature.color];

            return (
              <div
                key={feature.id}
                className={`${colors.bg} ${colors.border} border rounded-2xl p-8 hover:border-opacity-60 transition-all hover:shadow-lg hover:shadow-black/20`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#FF9500]/20 to-purple-600/20 border border-[#FF9500]/35 rounded-2xl p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Get a Mentor?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Start with our free tools to identify your gaps, then upgrade to access experienced mentors who will guide you to success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/learning-paths"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF9500] to-blue-500 hover:from-[#FF9500] hover:to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Explore Mentorship Programs
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/start-assessment"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-[#FFB347]/50 text-[#CC7000] hover:border-[#FFB347] hover:text-[#CC7000] font-bold transition-all hover:scale-105"
            >
              Start Free Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentorship;
