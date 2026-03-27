import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, BarChart3, Mic, ArrowRight } from 'lucide-react';
import LandingFooter from './landing/LandingFooter';
import { PRIMARY_CTA_LABEL, PRODUCT_READINESS_SCORE } from '../constants/brandCopy';

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: PRODUCT_READINESS_SCORE,
    description: 'Know where you stand in 5 minutes. Get a clear readiness score.',
    href: '/start-assessment',
    cta: 'Take free test',
  },
  {
    icon: BarChart3,
    title: 'Placement Readiness Score',
    description: 'See your placement probability and areas to improve.',
    href: '/start-assessment',
    cta: 'Get my score',
  },
  {
    icon: Mic,
    title: 'AI Mock Interviews',
    description: 'Practice with AI and get instant feedback on your answers.',
    href: '/mock-interviews',
    cta: 'Start mock',
  },
];

export default function ForStudentsPage() {
  return (
    <div className="min-h-screen bg-surface font-sans">
      <section className="relative py-20 md:py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8EE]/80 via-white to-[#FFFDF8]/60 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
            For Students
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Interview readiness test, placement score, and AI mock interviews. Everything you need to crack placements.
          </p>
          <Link
            to="/start-assessment"
            className="mt-10 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg shadow-soft hover:shadow-card transition-all"
          >
            {PRIMARY_CTA_LABEL}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 text-center mb-12">
            Your path to placement
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, description, href, cta }) => (
              <div
                key={title}
                className="flex flex-col p-6 rounded-2xl border border-slate-200 bg-white shadow-soft hover:shadow-card transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="text-slate-600 text-sm mt-2 flex-grow">{description}</p>
                <Link
                  to={href}
                  className="mt-4 inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
                >
                  {cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
