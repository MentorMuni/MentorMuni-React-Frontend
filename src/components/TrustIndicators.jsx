import React, { useEffect, useRef, useState } from 'react';

const trustStats = [
  { key: 'mentored', target: 200, suffix: '+', label: 'Students Mentored' },
  { key: 'callrate', target: 85, suffix: '%', label: 'Interview Call Rate' },
  { key: 'companies', target: 50, suffix: '+', label: 'Companies Cracked' },
  { key: 'resumes', target: 1000, suffix: '+', label: 'Resume Analyses' },
];

function useOnScreen(ref, rootMargin = '0px') {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return isIntersecting;
}

function CountUp({ target, suffix = '', start }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!start) return;
    const duration = 1200;
    const startTime = performance.now();

    function step(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.floor(eased * target);
      setValue(current);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else setValue(target);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [start, target]);

  return (
    <span aria-hidden="true">
      {value.toLocaleString()}{suffix}
    </span>
  );
}

const TrustIndicators = () => {
  const containerRef = useRef(null);
  const onScreen = useOnScreen(containerRef, '-50px');

  return (
    <section ref={containerRef} className="py-8 section-dark">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-dark">Trusted by Aspiring Tech Professionals</h2>
          <p className="mt-2 text-sm text-on-dark-sub">Helping students and career switchers prepare for real tech interviews.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustStats.map((s) => (
            <div key={s.key} className="card-dark p-6 text-center shadow-sm hover:shadow-lg transition-shadow hover:scale-[1.01] transform-gpu">
              <div className="flex items-center justify-center h-12 w-12 rounded-full mx-auto bg-indigo-600/10 mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-indigo-300">
                  <circle cx="12" cy="12" r="9" stroke="rgba(99,102,241,0.35)" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="text-4xl sm:text-5xl font-extrabold text-orange-400 leading-none">
                <CountUp target={s.target} suffix={s.suffix} start={onScreen} />
              </div>

              <div className="mt-2 text-sm font-medium text-on-dark-sub">{s.label}</div>
            </div>
          ))}
        </div>
        {/* Company logos row - unified inside the same trust section */}
        <div className="mt-8 text-center">
          <div className="text-sm text-on-dark-sub mb-3">Students placed in</div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {['TCS','Infosys','Capgemini','Accenture'].map((c) => (
              <div key={c} className="flex items-center justify-center h-10 px-4 grayscale opacity-70 hover:opacity-100 transition-opacity duration-200 rounded">
                <span className="text-sm font-semibold text-on-dark">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
