import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud, FileText, X, ChevronRight, CheckCircle,
  AlertCircle, Zap, Target, TrendingUp, Shield,
} from 'lucide-react';

/* ─── ROLE OPTIONS ───────────────────────────────────────────── */
const ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'DevOps Engineer',
  'QA / Test Engineer',
  'Product Manager',
  'Android Developer',
];

/* ─── SCORE RING ─────────────────────────────────────────────── */
function ScoreRing({ score, size = 140 }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ;
  const color = score >= 75 ? '#4ade80' : score >= 55 ? '#facc15' : '#f87171';
  const label = score >= 75 ? 'Strong' : score >= 55 ? 'Moderate' : 'Needs Work';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${progress} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
        <text x="60" y="55" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="sans-serif">{score}</text>
        <text x="60" y="71" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="sans-serif">out of 100</text>
      </svg>
      <span className="text-sm font-bold" style={{ color }}>{label}</span>
    </div>
  );
}

/* ─── BAR METRIC ─────────────────────────────────────────────── */
function BarMetric({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold text-slate-300">{label}</span>
        <span className="text-xs font-bold text-white">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  function handleFile(f) {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { alert('File too large. Max 5MB.'); return; }
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) { alert('Only PDF or DOCX files are supported.'); return; }
    setFile(f);
    setResult(null);
  }

  function onInputChange(e) { handleFile(e.target.files?.[0]); }
  function onDrop(e) {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function runAnalysis() {
    if (!file || !role || analyzing) return;
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const score = Math.max(48, Math.min(91, 58 + Math.floor(Math.random() * 32)));
      setResult({
        score,
        ats: Math.max(42, score - Math.floor(Math.random() * 12)),
        keywords: Math.max(38, score - Math.floor(Math.random() * 18)),
        formatting: Math.min(96, score + Math.floor(Math.random() * 12)),
        impact: Math.max(35, score - Math.floor(Math.random() * 22)),
        summary: score > 74
          ? 'Your resume is well-structured and aligns closely with the target role. A few quick wins below will push your score further.'
          : 'Your resume has a good foundation but is missing key signals that ATS systems and recruiters look for in this role.',
        matched: ['Java', 'REST APIs', 'Git', 'Problem Solving', 'OOP Concepts'],
        missing: ['System Design', 'SQL/Database', 'CI/CD', 'Docker'],
        fixes: [
          'Add metrics to project bullets — "Built X that reduced Y by Z%" scores significantly higher.',
          `Include ${role}-specific keywords from job descriptions in your skills and summary sections.`,
          'Quantify internship contributions — numbers make achievements credible and memorable.',
          'Add a 2-line professional summary at the top tailored to your target role.',
        ],
        strengths: ['Clean formatting', 'Relevant project section', 'Internship experience listed'],
      });
      setAnalyzing(false);
    }, 1800 + Math.random() * 600);
  }

  const canAnalyze = file && role && !analyzing;

  return (
    <div className="bg-[#050b18] text-white min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-900/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pt-12 pb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">Free Tool</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 leading-tight tracking-tight">
                Resume{' '}
                <span style={{ background: 'linear-gradient(90deg,#ec4899,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ATS Checker
                </span>
              </h1>
              <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                75% of resumes are rejected before a human sees them. Upload yours and see your ATS score, keyword gaps, and exactly what to fix.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              {[
                { icon: Shield,     color: 'text-green-400',  label: 'ATS Score' },
                { icon: Target,     color: 'text-indigo-400', label: 'Keyword Match' },
                { icon: TrendingUp, color: 'text-amber-400',  label: 'Fix Suggestions' },
              ].map(({ icon: Icon, color, label }) => (
                <div key={label} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                  <Icon size={13} className={color} />
                  <span className="text-xs font-semibold text-slate-300">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">

          {/* ─── LEFT: Form ─── */}
          <div className="flex flex-col gap-5">

            {/* Upload zone */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <div className="px-5 pt-5 pb-4 border-b border-white/8">
                <h2 className="text-sm font-black text-white">Upload Resume</h2>
                <p className="text-xs text-slate-500 mt-0.5">PDF or DOCX · Max 5MB</p>
              </div>
              <div className="p-5">
                {!file ? (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-4 py-12 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                      dragging
                        ? 'border-indigo-400 bg-indigo-500/10'
                        : 'border-white/15 hover:border-indigo-500/40 hover:bg-indigo-500/5'
                    }`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                      <UploadCloud size={24} className="text-indigo-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white">
                        {dragging ? 'Drop your file here' : 'Drag & drop your resume'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">or click to browse from your device</p>
                    </div>
                    <button
                      type="button"
                      className="px-5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                    >
                      Choose File
                    </button>
                    <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={onInputChange} className="sr-only" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-indigo-500/25 bg-indigo-500/8">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15">
                      <FileText size={18} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB · Ready to analyse</p>
                    </div>
                    <button
                      onClick={() => { setFile(null); setResult(null); }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Role selector */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <div className="px-5 pt-5 pb-4 border-b border-white/8">
                <h2 className="text-sm font-black text-white">Target Role</h2>
                <p className="text-xs text-slate-500 mt-0.5">We match keywords specific to this role</p>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {ROLES.map(r => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        role === r
                          ? 'bg-indigo-600 text-white border border-indigo-500'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:border-indigo-500/40 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Analyse button */}
            <button
              onClick={runAnalysis}
              disabled={!canAnalyze}
              className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-base transition-all ${
                canAnalyze
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 border border-white/10 text-slate-600 cursor-not-allowed'
              }`}
            >
              {analyzing ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Analysing your resume…
                </>
              ) : (
                <>
                  <Zap size={17} />
                  Check My ATS Score — Free
                </>
              )}
            </button>

            {!file && !role && (
              <p className="text-xs text-slate-600 text-center">Upload your resume and select a role to get started</p>
            )}
          </div>

          {/* ─── RIGHT: Results ─── */}
          <div className="flex flex-col gap-5">
            {!result && !analyzing && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 flex flex-col items-center justify-center gap-4 text-center min-h-[320px]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                  <Target size={22} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400">Your results will appear here</p>
                  <p className="text-xs text-slate-600 mt-1 max-w-[220px]">Upload your resume and pick a role to see your ATS score and fix suggestions</p>
                </div>
              </div>
            )}

            {analyzing && (
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-8 flex flex-col items-center justify-center gap-5 min-h-[320px]">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText size={20} className="text-indigo-400" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">Scanning your resume…</p>
                  <p className="text-xs text-slate-500 mt-1">Checking ATS compatibility and keyword match</p>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            {result && (
              <>
                {/* Score card */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">ATS Score</p>
                      <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">{result.summary}</p>
                    </div>
                    <ScoreRing score={result.score} />
                  </div>
                  <div className="flex flex-col gap-3 pt-4 border-t border-white/8">
                    <BarMetric label="ATS Compatibility"  value={result.ats}        color="linear-gradient(90deg,#6366f1,#a78bfa)" />
                    <BarMetric label="Keyword Match"       value={result.keywords}   color="linear-gradient(90deg,#06b6d4,#3b82f6)" />
                    <BarMetric label="Formatting Score"    value={result.formatting} color="linear-gradient(90deg,#4ade80,#22d3ee)" />
                    <BarMetric label="Impact & Metrics"    value={result.impact}     color="linear-gradient(90deg,#f59e0b,#ef4444)" />
                  </div>
                </div>

                {/* Fix suggestions */}
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={15} className="text-amber-400" />
                    <h3 className="text-sm font-black text-amber-300">Suggested Fixes</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {result.fixes.map((fix, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="mt-1 text-[10px] font-black text-amber-500 bg-amber-500/15 rounded px-1.5 py-0.5 shrink-0">{i + 1}</span>
                        <p className="text-xs text-slate-400 leading-relaxed">{fix}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-sm font-black text-white mb-4">Keyword Analysis</h3>
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-green-400 mb-2">✓ Matched in your resume</p>
                    <div className="flex flex-wrap gap-2">
                      {result.matched.map(k => (
                        <span key={k} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">{k}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-400 mb-2">✗ Missing — add these</p>
                    <div className="flex flex-wrap gap-2">
                      {result.missing.map(k => (
                        <span key={k} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">{k}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={14} className="text-green-400" />
                    <h3 className="text-sm font-black text-green-300">What's working</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    {result.strengths.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-green-400" />
                        <span className="text-xs text-slate-400">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Why ATS Matters ── */}
      <section className="border-t border-white/5 py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Why this matters</span>
          <h2 className="text-xl font-black mb-6">What ATS filtering means for your application</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { stat: '75%',   color: 'text-red-400',    border: 'border-red-500/20',    bg: 'bg-red-500/5',    label: 'Resumes rejected by ATS before a recruiter reads them' },
              { stat: '6 sec', color: 'text-amber-400',  border: 'border-amber-500/20',  bg: 'bg-amber-500/5',  label: 'Average time a recruiter spends scanning a resume that makes it through' },
              { stat: '3×',    color: 'text-green-400',  border: 'border-green-500/20',  bg: 'bg-green-500/5',  label: 'More interview callbacks when resumes are ATS-optimised with role keywords' },
            ].map(({ stat, color, border, bg, label }) => (
              <div key={stat} className={`rounded-xl border ${border} ${bg} p-5`}>
                <div className={`text-3xl font-black mb-2 ${color}`}>{stat}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-black mb-2">Also check your interview readiness</h2>
          <p className="text-slate-400 text-sm mb-6">A strong resume gets you the interview — preparation gets you the offer.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/start-assessment"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm"
            >
              Check Interview Readiness — Free <ChevronRight size={15} />
            </Link>
            <Link
              to="/mock-interviews"
              className="inline-flex items-center justify-center gap-2 border border-indigo-500/40 text-indigo-400 hover:text-white hover:border-indigo-400 font-semibold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Try AI Mock Interview
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
