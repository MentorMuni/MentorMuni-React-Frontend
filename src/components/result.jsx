import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Check, Copy, Share2 } from 'lucide-react';
import {
  buildResultShareMessage,
  SITE_SHARE_ASSESSMENT_URL,
  BRAND_MEME_LINE,
} from '../constants/brandCopy';

/* ─── Helpers — light theme, WCAG-friendly contrast ───────────────── */
const scoreColor = (s) => (s >= 75 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626');
const barColor = (s) => (s >= 70 ? 'bg-green-600' : s >= 45 ? 'bg-amber-500' : 'bg-red-500');

const getVerdict = (s) => {
  if (s >= 75)
    return {
      label: 'Interview Ready',
      cls: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    };
  if (s >= 50)
    return {
      label: 'Needs Work',
      cls: 'bg-amber-50 text-amber-900 border border-amber-200/80',
    };
  return {
    label: 'Not Ready Yet',
    cls: 'bg-red-50 text-red-800 border border-red-200/80',
  };
};

const getVerdictText = (s) => {
  if (s >= 75) return "You're well prepared — a few focused sessions will push you to 90+.";
  if (s >= 50) return "You have gaps that interviewers will find. Targeted prep over 2–3 weeks fixes most of them.";
  return "Don't panic — most students start here. 4 weeks of structured prep changes everything.";
};

/* ─── Animated score ring ───────────────────────────────────── */
function ScoreRing({ score }) {
  const SIZE = 180;
  const STROKE = 12;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const [offset, setOffset] = useState(CIRC);
  const color = scoreColor(score);

  useEffect(() => {
    const t = setTimeout(() => setOffset(CIRC * (1 - score / 100)), 100);
    return () => clearTimeout(t);
  }, [score, CIRC]);

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }} aria-hidden>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#e4e4e7" strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black tabular-nums" style={{ color }}>
          {score}
        </span>
        <span className="mt-0.5 text-xs text-muted-foreground">out of 100</span>
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
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-bold tabular-nums text-foreground">{value}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
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
  <div
    ref={ref}
    style={{
      background: '#f8fbff',
      border: '1px solid #ff9500',
      borderRadius: 16,
      padding: 32,
      width: 480,
      fontFamily: 'sans-serif',
    }}
  >
    <p style={{ color: '#ea580c', fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
      MENTORMUNI · INTERVIEW READINESS
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          border: `4px solid ${scoreColor(score)}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 36, fontWeight: 900, color: scoreColor(score) }}>{score}</span>
        <span style={{ fontSize: 10, color: '#64748b' }}>/100</span>
      </div>
      <div>
        <p style={{ color: '#18181b', fontSize: 20, fontWeight: 900, margin: 0 }}>{getVerdict(score).label}</p>
        <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>Role: {role}</p>
      </div>
    </div>
    <p style={{ color: '#64748b', fontSize: 11 }}>
      {BRAND_MEME_LINE} ·{' '}
      <strong style={{ color: '#ea580c' }}>mentormuni.com</strong>
    </p>
  </div>
));
ShareCard.displayName = 'ShareCard';

/* ─── Main page ─────────────────────────────────────────────── */
export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const shareRef = useRef(null);

  const [copied, setCopied] = useState(false);
  const [wlPhone, setWlPhone] = useState('');
  const [wlJoined, setWlJoined] = useState(false);

  const data =
    location.state ||
    (() => {
      try {
        return JSON.parse(localStorage.getItem('mm_last_result') || 'null');
      } catch {
        return null;
      }
    })();

  useEffect(() => {
    if (!data) {
      navigate('/start-assessment', { replace: true });
      return;
    }
    if (location.state) {
      localStorage.setItem('mm_last_result', JSON.stringify(location.state));
    }
  }, [data, navigate, location.state]);

  useEffect(() => {
    if (!data) return;
    const score = data.totalScore ?? 0;
    const title = `Scored ${score}/100 — Interview Readiness | MentorMuni`;
    document.title = title;
    const desc = `${BRAND_MEME_LINE} Your score: ${score}/100. Get yours free in ~5 min — no signup.`;
    const setMeta = (selector, content) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    };
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', desc);
  }, [data]);

  if (!data) return null;

  const { totalScore = 0, breakdown = {}, role = 'Student', gaps = [] } = data;
  const { dsa = 0, systemDesign = 0, communication = 0, projects = 0 } = breakdown;
  const verdict = getVerdict(totalScore);

  const BARS = [
    { label: 'DSA & Problem Solving', value: dsa },
    { label: 'System Design', value: systemDesign },
    { label: 'Communication & HR', value: communication },
    { label: 'Project & Experience', value: projects },
  ];

  const displayGaps = gaps.length
    ? gaps
    : [
        dsa < 50 ? 'DSA fundamentals — you are missing core patterns (arrays, trees, DP)' : null,
        systemDesign < 50
          ? 'System Design — concepts like load balancing, caching, and DB scaling are weak'
          : null,
        communication < 50
          ? 'Communication — you freeze or over-explain; need structured answer frameworks'
          : null,
        projects < 50
          ? 'Project depth — you cannot explain technical decisions in your own projects clearly'
          : null,
      ]
        .filter(Boolean)
        .slice(0, 3);

  const shareMessage = buildResultShareMessage(totalScore, role);

  const handleShareWA = () =>
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank', 'noopener,noreferrer');

  const handleShareLI = () =>
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_SHARE_ASSESSMENT_URL)}`,
      '_blank',
      'noopener,noreferrer'
    );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: `Interview readiness — ${totalScore}/100 | MentorMuni`,
          text: shareMessage,
        });
      }
    } catch (e) {
      if (e?.name !== 'AbortError') handleCopy();
    }
  };

  const handleDownload = async () => {
    if (!shareRef.current) return;
    try {
      if (!window.html2canvas) {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          s.onload = res;
          s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const canvas = await window.html2canvas(shareRef.current, { backgroundColor: '#f8fbff', scale: 2 });
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
    <div className="min-h-screen mm-site-theme px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="mm-card-elevated p-6 text-center sm:p-8">
          <p className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Your Interview Readiness Score
          </p>
          <ScoreRing score={totalScore} />
          <div className="mt-4 mb-2">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${verdict.cls}`}>
              {verdict.label}
            </span>
          </div>
          <p className="typo-body mx-auto mt-2 max-w-sm text-muted-foreground">
            {getVerdictText(totalScore)}
          </p>
          <p className="typo-caption mt-3 text-muted-foreground">Role assessed: {role}</p>
        </div>

        <div className="mm-card-elevated p-6">
          <h2 className="typo-h3 mb-5 text-foreground">Score breakdown</h2>
          <div className="space-y-4">
            {BARS.map((b, i) => (
              <ScoreBar key={b.label} label={b.label} value={b.value} delay={300 + i * 200} />
            ))}
          </div>
        </div>

        {displayGaps.length > 0 && (
          <div className="rounded-2xl border border-red-200/80 bg-red-50/50 p-6 shadow-[var(--shadow-card)]">
            <h2 className="typo-h3 mb-4 text-foreground">
              Your {displayGaps.length} critical gaps to fix
            </h2>
            <ul className="space-y-3">
              {displayGaps.map((g, i) => (
                <li key={i} className="typo-body flex items-start gap-3 text-muted-foreground">
                  <span className="mt-0.5 shrink-0 font-bold text-red-600">→</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-2xl border border-[#FF9500]/35 bg-[#FF9500]/10 p-6 shadow-[var(--shadow-card)]">
          {wlJoined ? (
            <div className="py-2 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-green-200 bg-green-50">
                <Check size={20} className="text-green-700" />
              </div>
              <p className="typo-h3 mb-1 text-foreground">You&apos;re on the list!</p>
              <p className="typo-body text-muted-foreground">
                We&apos;ll WhatsApp you when mentorship opens — with your 30% discount link.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Early access waitlist
              </p>
              <h3 className="typo-h3 mb-1 text-foreground">
                Students at {totalScore}/100 reach 85+ in 3–4 weeks with a mentor.
              </h3>
              <p className="typo-body mb-4 text-muted-foreground">
                Join the waitlist now — early access opens before the public and includes 30% off the full program.
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={wlPhone}
                    onChange={(e) => setWlPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="WhatsApp number"
                    className="mm-focus w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-zinc-400 outline-none transition-colors focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleWaitlist}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#FF9500] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#E88600] active:scale-[0.98] whitespace-nowrap"
                >
                  Join Waitlist <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mm-card-elevated p-6">
          <h2 className="typo-h3 mb-2 text-foreground">Share your result</h2>
          <p className="typo-caption mb-5 text-muted-foreground">
            One-tap message includes your score + a free test link — ready for WhatsApp groups and LinkedIn.
          </p>

          <div
            className="overflow-hidden"
            style={{ height: 0, pointerEvents: 'none', position: 'absolute', left: -9999 }}
          >
            <ShareCard ref={shareRef} score={totalScore} role={role} />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleShareWA}
              className="mm-focus flex min-h-[44px] min-w-[10rem] flex-1 items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50/80 py-3 text-sm font-semibold text-green-800 transition-all hover:bg-green-100 active:scale-[0.98] sm:min-w-0"
            >
              <Share2 size={14} aria-hidden /> WhatsApp
            </button>
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="mm-focus flex min-h-[44px] min-w-[10rem] flex-1 items-center justify-center gap-2 rounded-xl border border-[#FF9500]/40 bg-[#FFF4E0]/90 py-3 text-sm font-semibold text-[#CC7000] transition-all hover:bg-[#FFE8C2] active:scale-[0.98] sm:min-w-0"
              >
                <Share2 size={14} aria-hidden /> Share…
              </button>
            )}
            <button
              type="button"
              onClick={handleShareLI}
              className="mm-focus flex min-h-[44px] min-w-[10rem] flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 py-3 text-sm font-semibold text-blue-800 transition-all hover:bg-blue-100 active:scale-[0.98] sm:min-w-0"
            >
              <Share2 size={14} aria-hidden /> LinkedIn
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="mm-focus flex min-h-[44px] min-w-[10rem] flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-zinc-50 py-3 text-sm font-semibold text-foreground transition-all hover:bg-zinc-100 active:scale-[0.98] sm:min-w-0"
            >
              <Copy size={14} aria-hidden /> {copied ? 'Copied!' : 'Copy message'}
            </button>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            className="mm-focus mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            ↓ Download score card as image
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/start-assessment"
            className="mm-focus flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white py-3 text-sm font-semibold text-foreground transition-all hover:border-[#FFB347] hover:bg-secondary active:scale-[0.98]"
          >
            Retake assessment
          </Link>
          <Link
            to="/mentors"
            className="mm-focus flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF9500] py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.25)] transition-all hover:bg-[#E88600] active:scale-[0.98]"
          >
            Book free mentor session <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
