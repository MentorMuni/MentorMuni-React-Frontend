import React from 'react';
import { XCircle, Zap, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const CareerTransformationSection = () => {
  const transformationStages = [
    {
      id: 1,
      title: "Where You Are Today",
      icon: XCircle,
      color: "red",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconBg: "bg-red-100 text-red-600",
      textColor: "text-red-700",
      pain_points: [
        "Confused about which tech role fits your skills",
        "Not getting interview calls despite applying",
        "Unsure what skills top companies actually need",
        "Struggling with DSA and system design questions"
      ]
    },
    {
      id: 2,
      title: "What MentorMuni Diagnoses",
      icon: Zap,
      color: "amber",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconBg: "bg-amber-100 text-amber-600",
      textColor: "text-amber-700",
      features: [
        "AI analyzes your resume against industry standards",
        "Identifies your skill gaps vs job requirements",
        "Measures your interview readiness level",
        "Recommends personalized learning path"
      ]
    },
    {
      id: 3,
      title: "Where You Can Be",
      icon: CheckCircle,
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconBg: "bg-green-100 text-green-600",
      textColor: "text-green-700",
      outcomes: [
        "Job-ready with industry-level technical skills",
        "Confident and prepared for tech interviews",
        "Landing offers from your target companies",
        "Building sustainable career in tech"
      ]
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-semibold text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Career Transformation Journey
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Transform Your Career Into Tech
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            MentorMuni doesn't just give you tools—it transforms you from uncertain to job-ready through AI diagnosis and personalized guidance.
          </p>
        </div>

        {/* Desktop Timeline View */}
        <div className="hidden lg:block mb-16">
          {/* Transformation Cards with Arrows */}
          <div className="grid grid-cols-3 gap-8 items-start">
            {transformationStages.map((stage, index) => {
              const Icon = stage.icon;
              const items = stage.pain_points || stage.features || stage.outcomes;

              return (
                <div key={stage.id}>
                  {/* Card */}
                  <div className={`${stage.bgColor} border-2 ${stage.borderColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full group`}>
                    {/* Icon */}
                    <div className={`${stage.iconBg} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8" strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black text-slate-900 mb-6">
                      {stage.title}
                    </h3>

                    {/* Points */}
                    <ul className="space-y-4">
                      {items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className={`${stage.iconBg} w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                            {stage.id === 1 && <span className="text-xs font-bold">✕</span>}
                            {stage.id === 2 && <span className="text-xs font-bold">→</span>}
                            {stage.id === 3 && <span className="text-xs font-bold">✓</span>}
                          </div>
                          <span className="text-slate-700 text-sm leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Bottom Label */}
                    <div className={`mt-8 pt-6 border-t-2 ${stage.borderColor}`}>
                      <span className={`${stage.textColor} font-bold text-sm`}>
                        {stage.id === 1 && "❌ The Current Reality"}
                        {stage.id === 2 && "🔍 Our Assessment Process"}
                        {stage.id === 3 && "✅ Your Transformed Future"}
                      </span>
                    </div>
                  </div>

                  {/* Arrow Between Cards */}
                  {index < transformationStages.length - 1 && (
                    <div className="flex justify-center -mx-4 mt-8">
                      <ArrowRight className="w-8 h-8 text-indigo-600 transform rotate-0 font-bold" strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline View */}
        <div className="lg:hidden mb-16">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 via-amber-400 to-green-400" />

            {/* Mobile Cards */}
            <div className="space-y-8">
              {transformationStages.map((stage) => {
                const Icon = stage.icon;
                const items = stage.pain_points || stage.features || stage.outcomes;

                return (
                  <div key={stage.id} className="relative pl-24">
                    {/* Timeline Dot */}
                    <div className={`absolute left-0 w-16 h-16 ${stage.bgColor} border-4 border-white ${stage.borderColor} rounded-full flex items-center justify-center shadow-lg z-10`}>
                      <Icon className={`w-8 h-8 ${stage.color === 'red' ? 'text-red-600' : stage.color === 'amber' ? 'text-amber-600' : 'text-green-600'}`} strokeWidth={1.5} />
                    </div>

                    {/* Card */}
                    <div className={`${stage.bgColor} border-2 ${stage.borderColor} rounded-xl p-6 shadow-md hover:shadow-lg transition-all`}>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">
                        {stage.title}
                      </h3>

                      <ul className="space-y-3">
                        {items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className={`${stage.textColor} font-bold mt-1`}>•</span>
                            <span className="text-slate-700 text-sm leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className={`mt-4 pt-4 border-t-2 ${stage.borderColor}`}>
                        <span className={`${stage.textColor} font-bold text-xs`}>
                          {stage.id === 1 && "❌ The Current Reality"}
                          {stage.id === 2 && "🔍 Our Assessment Process"}
                          {stage.id === 3 && "✅ Your Transformed Future"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Key Messages Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white shadow-xl mb-12">
          <h3 className="text-2xl font-black mb-8 text-center">
            Why MentorMuni Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black mb-3">🎯</div>
              <h4 className="font-bold mb-2">AI-Powered Diagnosis</h4>
              <p className="text-indigo-100 text-sm">Our AI understands exactly what companies need from tech candidates and assesses you against those standards.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-3">📈</div>
              <h4 className="font-bold mb-2">Personalized Roadmap</h4>
              <p className="text-indigo-100 text-sm">Get a customized learning path based on your gaps, not generic courses everyone else takes.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-3">👥</div>
              <h4 className="font-bold mb-2">Real Mentor Guidance</h4>
              <p className="text-indigo-100 text-sm">Learn from mentors who have walked the path you're taking and landed jobs at top tech companies.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-3xl font-black text-slate-900 mb-4">
            Ready to Begin Your Transformation?
          </h3>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
            Start with our free AI assessment and discover exactly where you stand and what you need to reach your dream tech job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#/resume-analyzer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              <span>Analyze My Resume (Free)</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/#/interview-readiness"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-indigo-600 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-all duration-300"
            >
              Check Interview Readiness
            </a>
          </div>
          <p className="text-sm text-slate-500 mt-6">
            ✓ 1,350+ students transformed • ✓ 85% got interview calls • ✓ No credit card required
          </p>
        </div>
      </div>
    </section>
  );
};

export default CareerTransformationSection;
