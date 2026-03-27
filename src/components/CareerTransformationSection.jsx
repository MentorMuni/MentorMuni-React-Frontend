import React from 'react';
import { XCircle, Zap, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { PRIMARY_CTA_LABEL } from '../constants/brandCopy';

const CareerTransformationSection = () => {
  const transformationStages = [
    {
      id: 1,
      title: 'Where You Are Today',
      icon: XCircle,
      items: [
        'Confused about which tech role fits your skills',
        'Not getting interview calls despite applying',
        'Unsure what skills top companies actually need',
        'Struggling with DSA and system design questions'
      ]
    },
    {
      id: 2,
      title: 'What MentorMuni Diagnoses',
      icon: Zap,
      items: [
        'AI analyzes your resume against industry standards',
        'Identifies your skill gaps vs job requirements',
        'Measures your interview readiness level',
        'Recommends a personalized learning path'
      ]
    },
    {
      id: 3,
      title: 'Where You Can Be',
      icon: CheckCircle,
      items: [
        'Job-ready with industry-level technical skills',
        'Confident and prepared for tech interviews',
        'Landing offers from your target companies',
        'Building a sustainable career in tech'
      ]
    }
  ];

  return (
    <section className="py-20 px-6 section-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-on-dark font-semibold text-sm mb-6" style={{ background: 'rgba(99,102,241,0.06)' }}>
            <Sparkles className="w-4 h-4 text-primary" />
            Career Transformation Journey
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-on-dark mb-6">Transform Your Career Into Tech</h2>

          <p className="text-xl text-on-dark-sub max-w-3xl mx-auto">
            MentorMuni doesn't just give you tools—it transforms you from uncertain to job-ready through AI diagnosis and personalized guidance.
          </p>
        </div>

        <div className="hidden lg:block mb-16">
          <div className="grid grid-cols-3 gap-8 items-start">
            {transformationStages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={stage.id}>
                  <div className="card-dark rounded-2xl p-8 hover:shadow-xl transition-all duration-300 h-full group">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(99,102,241,0.08)' }}>
                      <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-2xl font-black text-on-dark mb-6">{stage.title}</h3>

                    <ul className="space-y-4">
                      {stage.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <span className="text-xs font-bold text-on-dark">•</span>
                          </div>
                          <span className="text-on-dark-sub text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <span className="font-bold text-sm text-on-dark">
                        {index === 0 && '❌ The Current Reality'}
                        {index === 1 && '🔍 Our Assessment Process'}
                        {index === 2 && '✅ Your Transformed Future'}
                      </span>
                    </div>
                  </div>

                  {index < transformationStages.length - 1 && (
                    <div className="flex justify-center -mx-4 mt-8">
                      <ArrowRight className="w-8 h-8 text-[#FF9500] transform rotate-0 font-bold" strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:hidden mb-16">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF9500]/30 to-purple-600/30" />

            <div className="space-y-8">
              {transformationStages.map((stage) => {
                const Icon = stage.icon;
                return (
                  <div key={stage.id} className="relative pl-24">
                    <div className="absolute left-0 w-16 h-16 rounded-full flex items-center justify-center shadow-lg z-10" style={{ background: 'rgba(99,102,241,0.08)', border: '4px solid rgba(255,255,255,0.03)' }}>
                      <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                    </div>

                    <div className="card-dark rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                      <h3 className="text-xl font-bold text-on-dark mb-4">{stage.title}</h3>

                      <ul className="space-y-3">
                        {stage.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-bold mt-1 text-on-dark">•</span>
                            <span className="text-on-dark-sub text-sm leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                        <span className="font-bold text-xs text-on-dark">{stage.id === 1 ? '❌ The Current Reality' : stage.id === 2 ? '🔍 Our Assessment Process' : '✅ Your Transformed Future'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card-elevated p-12 mb-12">
          <h3 className="text-2xl font-black mb-8 text-center text-on-dark">Why MentorMuni Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black mb-3">🎯</div>
              <h4 className="font-bold mb-2 text-on-dark">AI-Powered Diagnosis</h4>
              <p className="text-on-dark-sub text-sm">Our AI understands exactly what companies need from tech candidates and assesses you against those standards.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-3">📈</div>
              <h4 className="font-bold mb-2 text-on-dark">Personalized Roadmap</h4>
              <p className="text-on-dark-sub text-sm">Get a customized learning path based on your gaps, not generic courses everyone else takes.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-3">👥</div>
              <h4 className="font-bold mb-2 text-on-dark">Real Mentor Guidance</h4>
              <p className="text-on-dark-sub text-sm">Learn from mentors who have walked the path you're taking and landed jobs at top tech companies.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-3xl font-black text-on-dark mb-4">Ready to Begin Your Transformation?</h3>
          <p className="text-on-dark-sub mb-8 max-w-2xl mx-auto text-lg">Start with our free AI assessment and discover exactly where you stand and what you need to reach your dream tech job.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#/resume-analyzer" className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold">
              <span>Analyze My Resume (Free)</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </a>

            <a href="/#/start-assessment" className="btn-secondary inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold">Check my readiness — free</a>
          </div>

          <p className="text-sm text-on-dark-sub mt-6">✓ 1,350+ students transformed • ✓ 85% got interview calls • ✓ No credit card required</p>
        </div>
      </div>
    </section>
  );
};

export default CareerTransformationSection;
