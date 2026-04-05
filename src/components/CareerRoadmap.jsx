import React from 'react';
import { GraduationCap, Zap, Briefcase, Users, Trophy, ArrowRight } from 'lucide-react';

const CareerRoadmap = () => {
  const roadmapSteps = [
    {
      id: 1,
      title: "Student",
      description: "Identify your starting point and career goal.",
      icon: GraduationCap,
      color: "indigo"
    },
    {
      id: 2,
      title: "Learn Skills",
      description: "Build the essential technical skills.",
      icon: Zap,
      color: "purple"
    },
    {
      id: 3,
      title: "Build Projects",
      description: "Work on real-world projects to strengthen your portfolio.",
      icon: Briefcase,
      color: "blue"
    },
    {
      id: 4,
      title: "Interview Prep",
      description: "Practice technical interviews and improve problem-solving.",
      icon: Users,
      color: "cyan"
    },
    {
      id: 5,
      title: "Get Hired",
      description: "Apply with confidence and land your tech role.",
      icon: Trophy,
      color: "amber"
    }
  ];

  const colorMap = {
    indigo: {
      bg: "bg-[#FFF4E0]",
      border: "border-[#F0ECE0]",
      icon: "bg-[#FFF4E0] text-[#FF9500]",
      hover: "hover:bg-[#FFF4E0]"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "bg-purple-100 text-purple-600",
      hover: "hover:bg-purple-100"
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "bg-blue-100 text-blue-600",
      hover: "hover:bg-blue-100"
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      icon: "bg-cyan-100 text-cyan-600",
      hover: "hover:bg-cyan-100"
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "bg-amber-100 text-amber-600",
      hover: "hover:bg-amber-100"
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Your Journey to a Tech Job
          </h2>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Follow a clear roadmap to go from student to job-ready professional.
          </p>
        </div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden lg:block mb-16">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-[60px] left-0 right-0 h-1 bg-gradient-to-r from-[#FF9500] via-purple-400 to-amber-400 z-0"></div>

            {/* Steps Container */}
            <div className="relative z-10 flex justify-between items-start gap-4">
              {roadmapSteps.map((step, index) => {
                const Icon = step.icon;
                const colors = colorMap[step.color];

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center flex-1 group"
                  >
                    {/* Icon Circle */}
                    <div className={`w-28 h-28 rounded-full ${colors.bg} border-4 ${colors.border} flex items-center justify-center mb-6 transition-all duration-300 ${colors.hover} shadow-lg`}>
                      <Icon className={colors.icon + " w-12 h-12"} strokeWidth={1.5} />
                    </div>

                    {/* Card */}
                    <div className={`${colors.bg} border ${colors.border} rounded-lg p-6 text-center w-full max-w-xs transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1`}>
                      <h3 className="text-lg font-bold text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-sm text-foreground-muted leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Step Number Badge */}
                    <div className="mt-4 inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#FF9500] to-purple-600 text-white text-xs font-bold">
                      {step.id}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="lg:hidden mb-16">
          <div className="relative">
            {roadmapSteps.map((step, index) => {
              const Icon = step.icon;
              const colors = colorMap[step.color];
              const isLast = index === roadmapSteps.length - 1;

              return (
                <div key={step.id} className="mb-8 flex gap-6 relative">
                  {/* Vertical Connecting Line */}
                  {!isLast && (
                    <div className="absolute left-6 top-20 w-1 h-12 bg-gradient-to-b from-[#FF9500] to-purple-400"></div>
                  )}

                  {/* Icon Circle */}
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-full ${colors.bg} border-4 ${colors.border} flex items-center justify-center shadow-lg`}>
                      <Icon className={colors.icon + " w-10 h-10"} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`${colors.bg} border ${colors.border} rounded-lg p-5 flex-1 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {step.title}
                      </h3>
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-[#FF9500] to-purple-600 text-white text-xs font-bold">
                        {step.id}
                      </div>
                    </div>
                    <p className="text-sm text-foreground-muted leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center pt-12 border-t border-slate-200">
          <p className="text-foreground-muted mb-6 max-w-2xl mx-auto">
            Start your transformation today. Our platform guides you through each step with curated content, expert mentorship, and real-world projects.
          </p>
          <a
            href="/#/start-assessment"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            <span>Check my readiness — free</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CareerRoadmap;
