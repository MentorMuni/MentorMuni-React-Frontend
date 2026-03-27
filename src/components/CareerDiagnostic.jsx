import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, ClipboardCheck, Compass, ArrowRight } from 'lucide-react';

const steps = [
  { id: 'resume', title: 'Resume Analysis', activity: 'Analyzing resume...', icon: FileText },
  { id: 'skills', title: 'Skill Gap Detection', activity: 'Scanning skills against 5,000 job descriptions...', icon: TrendingUp },
  { id: 'interview', title: 'Interview Readiness', activity: 'Running mock interview checks...', icon: ClipboardCheck },
  { id: 'roadmap', title: 'Career Roadmap', activity: 'Synthesizing a personalized roadmap...', icon: Compass },
];

function ActivityBubble({ message }) {
  return (
    <div className="mt-4 inline-flex items-center gap-3 text-sm text-slate-400">
      <div className="w-3 h-3 rounded-full bg-[#FFB347] animate-pulse" />
      <span>{message}</span>
    </div>
  );
}

export default function CareerDiagnostic() {
  const [current, setCurrent] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | running | done
  const [log, setLog] = useState([]);

  useEffect(() => {
    let timer;
    if (status === 'running' && current) {
      timer = setTimeout(() => {
        setLog((l) => [...l, `${steps.find((s) => s.id === current).title} complete`]);
        const nextIndex = steps.findIndex((s) => s.id === current) + 1;
        if (nextIndex < steps.length) {
          setCurrent(steps[nextIndex].id);
        } else {
          setStatus('done');
          setCurrent(null);
        }
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [status, current]);

  function startJourney() {
    setLog([]);
    setCurrent(steps[0].id);
    setStatus('running');
  }

  function renderStep(s, index) {
    const active = current === s.id && status === 'running';
    const done = log.some((l) => l.startsWith(s.title));
    const Icon = s.icon;
    return (
      <div key={s.id} className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
            done
              ? 'bg-[#FF9500] text-white'
              : active
                ? 'bg-[#FF9500]/30 text-[#CC7000]'
                : 'bg-slate-700/80 text-slate-400'
          }`}
        >
          {done ? '✓' : index + 1}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-white">{s.title}</div>
          <div className="text-sm text-slate-400">
            {done ? 'Complete' : active ? <ActivityBubble message={s.activity} /> : 'Pending'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-20 px-6 section-dark border-y border-slate-800/60">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-on-dark">
            AI Career Diagnostic — Guided Journey
          </h2>
          <p className="mt-3 text-on-dark-sub max-w-2xl mx-auto">
            A step-by-step diagnostic that connects Resume → Skills → Interview → Roadmap. Get a consolidated career snapshot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {steps.map((s, i) => renderStep(s, i))}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/start-assessment"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#FF9500] hover:bg-[#E88600] text-white font-semibold rounded-lg transition-all"
              >
                Start diagnostic
                <ArrowRight className="w-4 h-4" />
              </Link>
              {status === 'idle' && (
                <button
                  type="button"
                  onClick={startJourney}
                  className="px-4 py-2 border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white rounded-lg text-sm font-medium transition-all"
                >
                  Run demo
                </button>
              )}
              {(status === 'running' || status === 'done') && (
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    setCurrent(null);
                    setLog([]);
                  }}
                  className="px-4 py-2 border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white rounded-lg text-sm font-medium transition-all"
                >
                  Reset
                </button>
              )}
            </div>
            <p className="text-sm text-slate-500">
              Status: <strong className="text-slate-400">{status}</strong>
            </p>
          </div>

          <div className="card-dark rounded-xl p-6">
            <div className="font-semibold text-white mb-3">Live activity</div>
            <div className="min-h-[120px] text-sm text-slate-400">
              {status === 'idle' && (
                <p>Start the diagnostic to see AI activity and progress.</p>
              )}
              {status === 'running' && current && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#FFB347] animate-pulse shrink-0" />
                  <span>{steps.find((s) => s.id === current).activity}</span>
                </div>
              )}
              {log.length > 0 && (
                <div className="mt-3 space-y-2">
                  {log.map((l, i) => (
                    <div key={i} className="text-slate-400">{l}</div>
                  ))}
                </div>
              )}
              {status === 'done' && (
                <p className="mt-3 text-emerald-400 font-semibold">
                  Diagnostic complete — view your consolidated report.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
