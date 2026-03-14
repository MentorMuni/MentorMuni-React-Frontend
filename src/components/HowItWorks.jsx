import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, ClipboardCheck, Compass, ArrowRight } from 'lucide-react';

const steps = [
  { key: 'resume', title: 'Resume Analysis', description: 'AI analyzes your resume and identifies improvement areas.', icon: FileText },
  { key: 'skills', title: 'Skill Gap Detection', description: 'Compare your profile with industry requirements to find missing skills.', icon: TrendingUp },
  { key: 'interview', title: 'Interview Readiness', description: 'Measure how prepared you are for technical interviews and soft skills.', icon: ClipboardCheck },
  { key: 'roadmap', title: 'Career Roadmap', description: 'Get a personalized preparation plan and mentor guidance.', icon: Compass }
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-6 section-dark">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-on-dark">How MentorMuni Prepares You for Tech Jobs</h2>
          <p className="mt-3 text-on-dark-sub max-w-2xl mx-auto">A step-by-step AI diagnostic that identifies your gaps and prepares you for interviews.</p>
        </div>

        {/* Timeline - responsive: horizontal on desktop, 2x2 on tablet, vertical on mobile */}
        <div className="relative">
          {/* Horizontal connector for desktop */}
          <div className="hidden lg:block absolute left-8 right-8 top-24 h-1 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.key} className="relative">
                  <div className="card-dark p-6 text-center flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))' }}>
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-on-dark mb-2">{s.title}</h3>
                    <p className="text-on-dark-sub text-sm">{s.description}</p>
                  </div>

                  {/* Connector arrow for mobile/tablet */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex lg:hidden items-center justify-center mt-3">
                      <div className="w-0.5 h-8 bg-border-color mr-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/start-assessment" className="btn-primary px-6 py-3 rounded-lg font-semibold">
            Start the AI Diagnostic
            <ArrowRight className="w-4 h-4 inline-block ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
