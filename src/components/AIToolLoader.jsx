import React, { useEffect, useState, useRef } from 'react';

const defaultSteps = [
  'Analyzing Resume...',
  'Scanning Skills...',
  'Comparing with 5000 job descriptions...',
  'Detecting missing technologies...',
  'Generating career insights...'
];

export default function AIToolLoader({ steps = defaultSteps, interval = 1200, showProgress = true }) {
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let id;
    if (running) {
      id = setInterval(() => {
        setIndex((i) => {
          if (i >= steps.length - 1) {
            clearInterval(id);
            setRunning(false);
            return i;
          }
          return i + 1;
        });
      }, interval);
    }
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [running, steps.length, interval]);

  const progress = Math.round(((index + 1) / steps.length) * 100);

  return (
    <div className="p-6 card-elevated max-w-xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-700/20">
          <svg className="w-6 h-6 text-primary animate-spin-slow" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
            <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="text-on-dark font-semibold">{steps[index]}</div>
          <div className="text-on-dark-sub text-sm mt-1">This may take a minute — AI is comparing across thousands of real job postings.</div>
        </div>
      </div>

      {showProgress && (
        <div className="mt-4">
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
            <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-on-dark-sub text-xs mt-2">{progress}% complete</div>
        </div>
      )}
    </div>
  );
}
