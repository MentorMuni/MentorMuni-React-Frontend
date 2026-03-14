import React, { useState, useEffect } from 'react';

const steps = [
  { id: 'resume', title: 'Resume Analysis', activity: 'Analyzing resume...' },
  { id: 'skills', title: 'Skill Gap Detection', activity: 'Scanning skills against 5,000 job descriptions...' },
  { id: 'interview', title: 'Interview Readiness', activity: 'Running mock interview checks...' },
  { id: 'roadmap', title: 'Career Roadmap', activity: 'Synthesizing a personalized roadmap...' },
];

function ActivityBubble({message}){
  return (
    <div className="mt-4 inline-flex items-center gap-3 text-sm text-gray-600">
      <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
      <div>{message}</div>
    </div>
  );
}

export default function CareerDiagnostic(){
  const [current, setCurrent] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | running | done
  const [log, setLog] = useState([]);

  useEffect(()=>{
    let timer;
    if(status === 'running' && current){
      // simulate async progress
      timer = setTimeout(()=>{
        setLog(l => [...l, `${steps.find(s=>s.id===current).title} complete`]);
        const nextIndex = steps.findIndex(s=>s.id===current) + 1;
        if(nextIndex < steps.length){
          setCurrent(steps[nextIndex].id);
        } else {
          setStatus('done');
          setCurrent(null);
        }
      }, 2000);
    }
    return ()=> clearTimeout(timer);
  }, [status, current]);

  function startJourney(){
    setLog([]);
    setCurrent(steps[0].id);
    setStatus('running');
  }

  function renderStep(s, index){
    const active = current === s.id && status === 'running';
    const done = log.some(l => l.startsWith(s.title));
    return (
      <div key={s.id} className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${done ? 'bg-indigo-600 text-white' : active ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
          {index+1}
        </div>
        <div>
          <div className="font-semibold">{s.title}</div>
          <div className="text-sm text-gray-600">{done ? 'Complete' : active ? <ActivityBubble message={s.activity} /> : 'Pending'}</div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold">AI Career Diagnostic — Guided Journey</h3>
        <p className="mt-2 text-gray-600">A step-by-step diagnostic that connects Resume → Skills → Interview → Roadmap. Start the guided flow to get a consolidated career snapshot.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {steps.map((s,i) => renderStep(s,i))}
            <div className="mt-4">
              <button onClick={startJourney} className="px-5 py-3 bg-indigo-600 text-white rounded mr-3">Start diagnostic</button>
              <button onClick={()=>{ setStatus('idle'); setCurrent(null); setLog([]); }} className="px-4 py-2 border rounded">Reset</button>
            </div>
            <div className="mt-4 text-sm text-gray-500">Status: <strong className="text-gray-700">{status === 'idle' ? 'idle' : status === 'running' ? 'running' : 'done'}</strong></div>
          </div>

          <div className="p-4 bg-gray-50 rounded shadow">
            <div className="font-semibold">Live activity</div>
            <div className="mt-3 text-sm text-gray-700 min-h-[120px]">
              {status === 'idle' && <div>Start the diagnostic to see AI activity messages and progress.</div>}
              {status === 'running' && current && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                  <div className="text-sm">{steps.find(s=>s.id===current).activity}</div>
                </div>
              )}
              {log.length>0 && (
                <div className="mt-3 space-y-2">
                  {log.map((l,i) => <div key={i} className="text-sm text-gray-600">{l}</div>)}
                </div>
              )}
              {status === 'done' && <div className="mt-3 text-green-600 font-semibold">Diagnostic complete — view your consolidated report.</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
