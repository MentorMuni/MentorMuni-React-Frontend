import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Check, Copy, Share2 } from 'lucide-react';

/* ─── Helpers ───────────────────────────────────────────────── */
const scoreColor = (s) => s >= 75 ? '#4ade80' : s >= 50 ? '#fbbf24' : '#f87171';
const barColor   = (s) => s >= 70 ? 'bg-green-500' : s >= 45 ? 'bg-amber-500' : 'bg-red-500';

const getVerdict = (s) => {
  if (s >= 75) return { label: 'Interview Ready',  cls: 'bg-green-500/15 text-green-400 border border-green-500/30' };
  if (s >= 50) return { label: 'Needs Work',        cls: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' };
  return              { label: 'Not Ready Yet',     cls: 'bg-red-500/15  text-red-400   border border-red-500/30'   };
};

const getVerdictText = (s) => {
  if (s >= 75) return "You're well prepared — a few focused sessions will push you to 90+.";
  if (s >= 50) return "You have gaps that interviewers will find. Targeted prep over 2–3 weeks fixes most of them.";
  return "Don't panic — most students start here. 4 weeks of structured prep changes everything.";
};

/* ─── Animated score ring ───────────────────────────────────── */
function ScoreRing({ score }) {
  const SIZE = 180, STROKE = 12;
  const R    = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const [offset, setOffset] = useState(CIRC);
  const color = scoreColor(score);

  useEffect(() => {
    const t = setTimeout(() => setOffset(CIRC * (1 - score / 100)), 100);
    return () => clearTimeout(t);
  }, [score, CIRC]);

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke="#1e293b" strokeWidth={STROKE} />
        <circle
          cx={SIZE/2} cy={SIZE/2} r={R}
          fill="none" stroke={color} strokeWidth={STROKE} strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-white tabular-nums" style={{ color }}>{score}</span>
        <span className="text-xs text-slate-500 mt-0.5">out of 100</span>
      </div>
    </div>
  );
}

/* ─── Animated bar ──────────────────────────────────────────── */
function ScoreBar({ label, value, delay }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-300 font-medium">{label}</span>
        <span className="font-bold text-white">{value}/100</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor(value)}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Share card (rendered as DOM for html2canvas) ─────────── */
const ShareCard = React.forwardRef(({ score, role }, ref) => (
  <div ref={ref} style={{
    background: '#fffdf8', border: '1px solid #ff9500',
    borderRadius: 16, padding: 32, width: 480, fontFamily: 'sans-serif',
  }}>
    <p style={{ color: '#818cf8', fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
      MENTORMUNI · INTERVIEW READINESS
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
      <div style={{
        width: 96, height: 96, borderRadius: '50%',
        border: `4px solid ${scoreColor(score)}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 36, fontWeight: 900, color: scoreColor(score) }}>{score}</span>
        <span style={{ fontSize: 10, color: '#64748b' }}>/100</span>
      </div>
      <div>
        <p style={{ color: '#fff', fontSize: 20, fontWeight: 900, margin: 0 }}>
          {getVerdict(score).label}
        </p>
        <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>Role: {role}</p>
      </div>
    </div>
    <p style={{ color: '#64748b', fontSize: 11 }}>
      Check your interview readiness at <strong style={{ color: '#818cf8' }}>mentormuni.com</strong>
    </p>
  </div>
));
ShareCard.displayName = 'ShareCard';

/* ─── Main page ─────────────────────────────────────────────── */
export default function ResultPage() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const shareRef   = useRef(null);

  const [copied,   setCopied]   = useState(false);
  const [wlPhone,  setWlPhone]  = useState('');
  const [wlJoined, setWlJoined] = useState(false);

  // Accept data from router state OR localStorage fallback
  const data = location.state || (() => {
    try { return JSON.parse(localStorage.getItem('mm_last_result') || 'null'); } catch { return null; }
  })();

  useEffect(() => {
    if (!data) navigate('/start-assessment', { replace: true });
    else if (location.state) localStorage.setItem('mm_last_result', JSON.stringify(location.state));
  }, []);

  if (!data) return null;

  const { totalScore = 0, breakdown = {}, role = 'Student', gaps = [] } = data;
  const { dsa = 0, systemDesign = 0, communication = 0, projects = 0 } = breakdown;
  const verdict = getVerdict(totalScore);

  const BARS = [
    { label: 'DSA & Problem Solving',   value: dsa },
    { label: 'System Design',           value: systemDesign },
    { label: 'Communication & HR',      value: communication },
    { label: 'Project & Experience',    value: projects },
  ];

  // Generate gaps from breakdown if not provided
  const displayGaps = gaps.length ? gaps : [
    dsa < 50          ? 'DSA fundamentals — you are missing core patterns (arrays, trees, DP)' : null,
    systemDesign < 50 ? 'System Design — concepts like load balancing, caching, and DB scaling are weak' : null,
    communication < 50? 'Communication — you freeze or over-explain; need structured answer frameworks' : null,
    projects < 50     ? 'Project depth — you cannot explain technical decisions in your own projects clearly' : null,
  ].filter(Boolean).slice(0, 3);

  const shareText = `My Interview Readiness Score: ${totalScore}/100. Check yours free at mentormuni.com`;

  const handleShareWA  = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  const handleShareLI  = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://mentormuni.com')}&summary=${encodeURIComponent(shareText)}`, '_blank');
  const handleCopy     = () => {
    navigator.clipboard.writeText(`https://mentormuni.com/start-assessment`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!shareRef.current) return;
    try {
      // Load html2canvas dynamically
      if (!window.html2canvas) {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const canvas = await window.html2canvas(shareRef.current, { backgroundColor: '#fffdf8', scale: 2 });
      const link = document.createElement('a');
      link.download = `mentormuni-score-${totalScore}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (e) {
      console.error('html2canvas error:', e);
    }
  };

  const handleWaitlist = () => {
    const digits = wlPhone.replace(/\D/g, '');
    if (digits.length < 10) return;
    const entry = { phone: `+91${digits}`, score: totalScore, role, timestamp: new Date().toISOString() };
    localStorage.setItem('mm_waitlist_joined', JSON.stringify(entry));
    setWlJoined(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1A1A1A] font-sans antialiased py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Score ring + verdict ── */}
        <div className="bg-white border border-[#F0ECE0] rounded-2xl p-8 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-5 font-medium">Your Interview Readiness Score</p>
          <ScoreRing score={totalScore} />
          <div className="mt-4 mb-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${verdict.cls}`}>
              {verdict.label}
            </span>
          </div>
          <p className="text-slate-300 text-sm max-w-sm mx-auto mt-2">{getVerdictText(totalScore)}</p>
          <p className="text-xs text-slate-600 mt-3">Role assessed: {role}</p>
        </div>

        {/* ── Score breakdown bars ── */}
        <div className="bg-white border border-[#F0ECE0] rounded-2xl p-6">
          <h2 className="font-bold text-white text-sm mb-5">Score breakdown</h2>
          <div className="space-y-4">
            {BARS.map((b, i) => (
              <ScoreBar key={b.label} label={b.label} value={b.value} delay={300 + i * 200} />
            ))}
          </div>
        </div>

        {/* ── Critical gaps ── */}
        {displayGaps.length > 0 && (
          <div className="bg-red-500/8 border border-red-500/20 rounded-2xl p-6">
            <h2 className="font-bold text-white text-sm mb-4">Your {displayGaps.length} critical gaps to fix</h2>
            <ul className="space-y-3">
              {displayGaps.map((g, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="text-red-400 font-bold mt-0.5 shrink-0">→</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Waitlist CTA ── */}
        <div className="bg-[#FF9500]/10 border border-[#FF9500]/35 rounded-2xl p-6">
          {wlJoined ? (
            <div className="text-center py-2">
              <div className="w-10 h-10 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
                <Check size={20} className="text-green-400" />
              </div>
              <p className="font-bold text-white mb-1">You're on the list!</p>
              <p className="text-slate-300 text-sm">We'll WhatsApp you when mentorship opens — with your 30% discount link.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Early access waitlist</p>
              <h3 className="text-lg font-bold text-white mb-1">
                Students at {totalScore}/100 reach 85+ in 3–4 weeks with a mentor.
              </h3>
              <p className="text-slate-300 text-sm mb-4">
                Join the waitlist now — early access opens before the public and includes 30% off the full program.
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">+91</span>
                  <input
                    type="tel" value={wlPhone}
                    onChange={e => setWlPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                    placeholder="WhatsApp number"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0DCCF] bg-white/5 text-white placeholder-slate-500 text-sm outline-none focus:border-[#FF9500] transition-colors"
                  />
                </div>
                <button onClick={handleWaitlist}
                  className="flex items-center gap-1.5 bg-[#FF9500] hover:bg-[#E88600] text-white font-bold text-sm px-4 py-3 rounded-xl transition-all whitespace-nowrap">
                  Join Waitlist <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── Share card ── */}
        <div className="bg-white border border-[#F0ECE0] rounded-2xl p-6">
          <h2 className="font-bold text-white text-sm mb-2">Share your result</h2>
          <p className="text-slate-500 text-xs mb-5">Challenge your friends or show recruiters you took the test.</p>

          {/* Hidden card rendered for html2canvas */}
          <div className="overflow-hidden" style={{ height: 0, pointerEvents: 'none', position: 'absolute', left: -9999 }}>
            <ShareCard ref={shareRef} score={totalScore} role={role} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button onClick={handleShareWA}
              className="flex items-center justify-center gap-2 bg-green-600/15 hover:bg-green-600/25 border border-green-500/20 text-green-400 font-semibold text-sm py-3 rounded-xl transition-all">
              <Share2 size={14} /> WhatsApp
            </button>
            <button onClick={handleShareLI}
              className="flex items-center justify-center gap-2 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/20 text-blue-400 font-semibold text-sm py-3 rounded-xl transition-all">
              <Share2 size={14} /> LinkedIn
            </button>
            <button onClick={handleCopy}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/8 border border-[#E0DCCF] text-slate-300 font-semibold text-sm py-3 rounded-xl transition-all">
              <Copy size={14} /> {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
          <button onClick={handleDownload}
            className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors py-2">
            ↓ Download score card as image
          </button>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/start-assessment"
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/8 border border-[#E0DCCF] text-slate-300 hover:text-white font-semibold text-sm py-3 rounded-xl transition-all">
            Retake assessment
          </Link>
          <Link to="/mentors"
            className="flex-1 flex items-center justify-center gap-2 bg-[#FF9500] hover:bg-[#E88600] text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-[0_4px_14px_rgba(255,149,0,0.25)]">
            Book free mentor session <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
