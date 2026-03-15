import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';

export default function AIMockSection() {
  return (
    <section className="py-20 md:py-28 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4">
          AI Mock Interviews
        </h2>
        <p className="text-slate-600 text-center text-lg max-w-2xl mx-auto mb-16">
          Practice with AI. Get instant feedback on confidence, clarity, and technical correctness.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">AI asks</p>
                <p className="text-slate-500 text-sm">You answer using your microphone</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-slate-700 italic">
                &ldquo;Explain polymorphism in Java.&rdquo;
              </p>
            </div>
            <p className="mt-4 text-slate-500 text-sm">
              Real technical questions. Real-time evaluation.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">AI gives feedback</p>
                <p className="text-slate-500 text-sm">Confidence · Clarity · Technical correctness</p>
              </div>
            </div>
            <ul className="space-y-3">
              {['Confidence', 'Clarity', 'Technical correctness'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/mock-interviews"
              className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Start AI mock interview <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
