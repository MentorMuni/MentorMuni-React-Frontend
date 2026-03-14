import React from 'react';
import { Briefcase, ExternalLink } from 'lucide-react';

const MentorSection = () => {
  const mentors = [
    {
      id: 1,
      name: "Amit Verma",
      role: "Senior Software Engineer",
      experience: "Ex-Amazon, Ex-Flipkart",
      expertise: "Backend, System Design",
      avatar: "AV",
      bgGradient: "from-blue-600 to-indigo-700",
      borderColor: "border-blue-500/20"
    },
    {
      id: 2,
      name: "Neha Gupta",
      role: "QA Automation Lead",
      experience: "Ex-Microsoft, Ex-Adobe",
      expertise: "Testing, Automation",
      avatar: "NG",
      bgGradient: "from-purple-600 to-pink-700",
      borderColor: "border-purple-500/20"
    },
    {
      id: 3,
      name: "Deepak Sharma",
      role: "Product Manager",
      experience: "Ex-Google, Current Startup CTO",
      expertise: "Product, Growth, Leadership",
      avatar: "DS",
      bgGradient: "from-emerald-600 to-teal-700",
      borderColor: "border-emerald-500/20"
    },
    {
      id: 4,
      name: "Sophia Das",
      role: "Data Scientist",
      experience: "Ex-Netflix, ML Engineer",
      expertise: "Machine Learning, Data",
      avatar: "SD",
      bgGradient: "from-orange-600 to-amber-700",
      borderColor: "border-orange-500/20"
    },
    {
      id: 5,
      name: "Rahul Iyer",
      role: "DevOps & Cloud Architect",
      experience: "Ex-AWS, Ex-IBM",
      expertise: "AWS, Docker, Kubernetes",
      avatar: "RI",
      bgGradient: "from-cyan-600 to-blue-700",
      borderColor: "border-cyan-500/20"
    },
    {
      id: 6,
      name: "Anjali Verma",
      role: "Frontend Engineer",
      experience: "Ex-Stripe, Ex-Uber",
      expertise: "React, Web, Performance",
      avatar: "AV",
      bgGradient: "from-pink-600 to-rose-700",
      borderColor: "border-pink-500/20"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Learn from Industry Mentors
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Get guidance from experienced engineers and tech leaders who have cracked top tech companies
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className={`${mentor.borderColor} border bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl p-8 hover:border-opacity-60 transition-all hover:shadow-lg hover:shadow-black/20 flex flex-col items-center text-center group`}
            >
              {/* Avatar */}
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${mentor.bgGradient} flex items-center justify-center mb-4 flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}
              >
                <span className="text-lg md:text-xl font-black text-white">{mentor.avatar}</span>
              </div>

              {/* Name */}
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                {mentor.name}
              </h3>

              {/* Role */}
              <div className="flex items-center gap-2 mb-3 justify-center">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <p className="text-sm text-slate-300 font-semibold">
                  {mentor.role}
                </p>
              </div>

              {/* Experience */}
              <p className="text-xs text-indigo-300 font-semibold mb-4 px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                {mentor.experience}
              </p>

              {/* Expertise */}
              <p className="text-xs text-slate-400 mb-4 flex-grow">
                <span className="font-semibold text-slate-300">Expertise:</span> {mentor.expertise}
              </p>

              {/* CTA Card appearance for consistency */}
              <div className="w-full pt-4 border-t border-slate-700/50">
                <p className="text-xs text-slate-400">Learn from this mentor</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-slate-300 mb-6">
            All mentors are available to guide you through your preparation journey
          </p>
          <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-indigo-500/20 border border-indigo-500/30">
            <span className="text-sm font-semibold text-indigo-300">Access mentor guidance → Upgrade to Pro</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorSection;
