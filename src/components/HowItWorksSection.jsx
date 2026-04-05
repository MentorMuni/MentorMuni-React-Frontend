import React from 'react';
import { FileText, TrendingUp, Users, ArrowRight } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      step: 1,
      title: 'Upload Your Resume',
      description: 'AI analyzes your resume, experience, and skills to understand your current profile.',
      icon: FileText,
      color: 'indigo',
      bgColor: 'bg-[#FF9500]/10',
      borderColor: 'border-[#FF9500]/25',
      iconColor: 'text-[#FF9500]'
    },
    {
      step: 2,
      title: 'Discover Your Skill Gap',
      description: 'Compare your profile with real industry expectations and identify missing skills.',
      icon: TrendingUp,
      color: 'cyan',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      iconColor: 'text-cyan-400'
    },
    {
      step: 3,
      title: 'Prepare with Mentors',
      description: 'Get a personalized roadmap and interview preparation guidance from industry mentors.',
      icon: Users,
      color: 'purple',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      iconColor: 'text-purple-400'
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/50 border-y border-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            How MentorMuni Works
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Follow a simple 3-step process to become interview ready and land your dream tech job.
          </p>
        </div>

        {/* Steps Container */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line (desktop only) */}
          <div className="hidden md:block absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF9500] via-cyan-500 to-purple-500 -z-10" />

          {steps.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className={`${item.bgColor} border ${item.borderColor} rounded-xl p-8 backdrop-blur-sm hover:border-${item.color}-500/40 transition-all hover:shadow-lg hover:shadow-${item.color}-500/20`}>
                  {/* Step Number Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center text-white text-xl font-black`}>
                      {item.step}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`mb-6 p-4 rounded-lg ${item.bgColor} w-fit`}>
                    <IconComponent className={`${item.iconColor}`} size={32} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Arrow to next step (mobile only) */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center mt-6">
                      <ArrowRight size={24} className="text-muted-foreground rotate-90" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            Ready to start your journey?
          </p>
          <a
            href="#get-started"
            className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-[#FF9500] to-blue-500 text-white font-semibold hover:scale-105 transition-transform"
          >
            Start Free Assessment
          </a>
        </div>
      </div>
    </section>
  );
}
