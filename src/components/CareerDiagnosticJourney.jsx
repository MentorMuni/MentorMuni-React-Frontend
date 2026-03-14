import React, { useState } from 'react';
import { FileText, BarChart3, Zap, MapPin, ArrowDown, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

const CareerDiagnosticJourney = () => {
  const [hoveredStep, setHoveredStep] = useState(null);

  const diagnosticSteps = [
    {
      id: 1,
      number: "01",
      title: "Resume Analysis",
      problemQuestion: "Why Your Resume Is Not Getting Interview Calls",
      description: "AI analyzes your resume against 5000+ real job descriptions and tells you exactly what's missing.",
      icon: FileText,
      benefits: ["ATS Score Check", "Content Gap Analysis", "Industry Benchmarking"],
      color: "indigo",
      cta: "Analyze Resume",
      link: "/#/resume-analyzer"
    },
    {
      id: 2,
      number: "02",
      title: "Skill Gap Detection",
      problemQuestion: "Your Skill Gap vs Industry Expectations",
      description: "Discover which technical and soft skills are holding you back from landing your target role.",
      icon: BarChart3,
      benefits: ["Role-Specific Skills", "Priority Ranking", "Learning Timeline"],
      color: "cyan",
      cta: "Find Gaps",
      link: "/#/skill-gap-analyzer"
    },
    {
      id: 3,
      number: "03",
      title: "Interview Readiness",
      problemQuestion: "Are You Ready for Your Next Tech Interview?",
      description: "Get an honest assessment of your technical interview readiness with detailed feedback.",
      icon: Zap,
      benefits: ["DSA Readiness", "System Design Score", "Confidence Level"],
      color: "amber",
      cta: "Check Readiness",
      link: "/#/interview-readiness"
    },
    {
      id: 4,
      number: "04",
      title: "Career Roadmap",
      problemQuestion: "Your Personalized Path to Landing a Tech Job",
      description: "Get a month-by-month roadmap with resources, mentors, and milestones.",
      icon: MapPin,
      benefits: ["Personalized Plan", "Mentor Matching", "Progress Tracking"],
      color: "purple",
      cta: "Get Roadmap",
      link: "/#/learning-paths"
    }
  ];

  const colorMap = {
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "bg-indigo-100 text-indigo-600",
      badge: "bg-indigo-100 text-indigo-700",
      button: "from-indigo-600 to-blue-600",
      dot: "bg-indigo-600",
      hover: "hover:border-indigo-400 hover:shadow-indigo-300"
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      icon: "bg-cyan-100 text-cyan-600",
      badge: "bg-cyan-100 text-cyan-700",
      button: "from-cyan-600 to-blue-600",
      dot: "bg-cyan-600",
      hover: "hover:border-cyan-400 hover:shadow-cyan-300"
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "bg-amber-100 text-amber-600",
      badge: "bg-amber-100 text-amber-700",
      button: "from-amber-600 to-orange-600",
      dot: "bg-amber-600",
      hover: "hover:border-amber-400 hover:shadow-amber-300"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "bg-purple-100 text-purple-600",
      badge: "bg-purple-100 text-purple-700",
      button: "from-purple-600 to-pink-600",
      dot: "bg-purple-600",
      hover: "hover:border-purple-400 hover:shadow-purple-300"
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white via-indigo-50/20 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-semibold text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Diagnosis
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Your AI Career Diagnostic
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
            A guided 4-step journey to identify exactly what you need to land your next tech job.
          </p>
          <p className="text-slate-500 max-w-2xl mx-auto">
            From resume optimization through interview mastery—let our AI diagnose your current state and create a personalized action plan.
          </p>
        </div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden lg:block mb-20">
          {/* Steps Container */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-[120px] left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-cyan-400 via-amber-400 to-purple-400"></div>

            <div className="relative z-10 grid grid-cols-4 gap-6">
              {diagnosticSteps.map((step, index) => {
                const Icon = step.icon;
                const colors = colorMap[step.color];

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center"
                    onMouseEnter={() => setHoveredStep(step.id)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    {/* Step Number Dot */}
                    <div className={`w-16 h-16 rounded-full ${colors.icon} flex items-center justify-center mb-6 border-4 ${
                      hoveredStep === step.id ? 'border-white shadow-lg' : 'border-white'
                    } transition-all duration-300 relative z-20`}>
                      <span className={`text-2xl font-black ${colors.dot === 'bg-indigo-600' ? 'text-indigo-600' : colors.dot === 'bg-cyan-600' ? 'text-cyan-600' : colors.dot === 'bg-amber-600' ? 'text-amber-600' : 'text-purple-600'}`}>
                        {step.number}
                      </span>
                    </div>

                    {/* Card */}
                    <div className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6 w-full transition-all duration-300 ${colors.hover} ${
                      hoveredStep === step.id ? 'shadow-xl -translate-y-2' : 'shadow-md'
                    }`}>
                      {/* Icon */}
                      <div className={`${colors.icon} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6" strokeWidth={1.5} />
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {step.title}
                      </h3>

                      {/* Problem Question */}
                      <p className="text-sm font-semibold text-slate-700 mb-3 line-clamp-2">
                        {step.problemQuestion}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Benefits */}
                      <ul className="mb-6 space-y-2">
                        {step.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <a
                        href={step.link}
                        className={`inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-gradient-to-r ${colors.button} text-white font-bold text-sm rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95`}
                      >
                        <span>{step.cta}</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="lg:hidden mb-20">
          {diagnosticSteps.map((step, index) => {
            const Icon = step.icon;
            const colors = colorMap[step.color];
            const isLast = index === diagnosticSteps.length - 1;

            return (
              <div key={step.id} className="relative mb-8">
                {/* Vertical Connecting Line */}
                {!isLast && (
                  <div className="absolute left-8 top-24 w-1 h-24 bg-gradient-to-b from-indigo-400 to-cyan-400"></div>
                )}

                {/* Step Container */}
                <div className="flex gap-6">
                  {/* Left Side - Number & Icon */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full ${colors.icon} flex items-center justify-center border-4 border-white shadow-md`}>
                      <span className={`text-2xl font-black`}>
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Right Side - Card */}
                  <div className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6 flex-1 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                    {/* Icon */}
                    <div className={`${colors.icon} w-10 h-10 rounded-lg flex items-center justify-center mb-3 inline-block`}>
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {step.title}
                    </h3>

                    {/* Problem Question */}
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      {step.problemQuestion}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Benefits */}
                    <ul className="mb-4 space-y-1">
                      {step.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <a
                      href={step.link}
                      className={`inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-gradient-to-r ${colors.button} text-white font-bold text-sm rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95`}
                    >
                      <span>{step.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white shadow-xl">
            <h3 className="text-3xl md:text-4xl font-black mb-4">
              Ready to Begin Your Career Diagnosis?
            </h3>
            <p className="text-lg text-indigo-100 mb-2 max-w-2xl mx-auto">
              Start your AI-powered career diagnostic journey today.
            </p>
            <p className="text-sm text-indigo-200 mb-8 max-w-2xl mx-auto">
              Get 3 free analyses. No credit card required. Takes just 15 minutes to complete.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#/resume-analyzer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                <span>Start Career Diagnosis</span>
              </a>
              <a
                href="/#/learning-paths"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span>Explore Paths</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-indigo-200 mt-6">
              ✓ 1,350+ students already diagnosed • ✓ 85% improvement rate • ✓ Mentor-backed recommendations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerDiagnosticJourney;
