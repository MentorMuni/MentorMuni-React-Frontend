import React, { useRef, useState } from 'react';
import { Share2, Linkedin, Download, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReadinessShareCard from './ReadinessShareCard';
import { percentileAheadFromScore } from '../../utils/readinessPercentile';
import { addLeaderboardOptIn } from '../../utils/leaderboardStorage';
import { getInterviewReadinessShareUrl, buildWhatsAppChallengeMessage } from '../../utils/readinessShare';

async function loadHtml2Canvas() {
  if (window.html2canvas) return window.html2canvas;
  await new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });
  return window.html2canvas;
}

export default function ReadinessSharePanel({
  score,
  readinessLabel = '',
  modeLabel = '',
  roleLabel = 'Student',
  college = '',
  branch = '',
  segment = 'final_year',
  className = '',
}) {
  const shareRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(false);
  const [optInSaved, setOptInSaved] = useState(false);
  const optInSubmittedRef = useRef(false);
  const [collegeInput, setCollegeInput] = useState(college);
  const [branchInput, setBranchInput] = useState(branch);

  const percentileAhead = percentileAheadFromScore(score);
  const shareMessage = buildWhatsAppChallengeMessage(score, readinessLabel, modeLabel);
  const shareUrl = getInterviewReadinessShareUrl();

  const handleDownload = async () => {
    if (!shareRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = await loadHtml2Canvas();
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#0f172a',
        scale: 1,
        width: 1080,
        height: 1920,
      });
      const link = document.createElement('a');
      link.download = `mentormuni-readiness-${score}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Share card export failed:', e);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* ignore */
    }
  };

  const trySaveOptIn = (checked, collegeName, branchName) => {
    if (!checked || optInSubmittedRef.current) return;
    const c = collegeName.trim();
    if (!c) return;
    addLeaderboardOptIn({
      readinessScore: score,
      college: c,
      branch: branchName.trim() || undefined,
      segment,
    });
    optInSubmittedRef.current = true;
    setOptInSaved(true);
  };

  const handleLeaderboardOptIn = (checked) => {
    setLeaderboardOptIn(checked);
    if (checked) trySaveOptIn(true, collegeInput, branchInput);
  };

  return (
    <div className={className}>
      <div className="mb-4 rounded-2xl border border-[#FF9500]/35 bg-gradient-to-br from-[#FFF4E0]/90 to-white px-5 py-4 text-center sm:text-left">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C2410C]">
          Your standing
        </p>
        <p className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
          You&apos;re ahead of{' '}
          <span className="text-[#FF9500]">{percentileAhead}%</span> of students
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Directional estimate from your score band — share your card and challenge your batch.
        </p>
      </div>

      <div
        className="pointer-events-none fixed opacity-0"
        style={{ left: -10000, top: 0 }}
        aria-hidden
      >
        <ReadinessShareCard
          ref={shareRef}
          score={score}
          percentileAhead={percentileAhead}
          roleLabel={roleLabel}
          readinessLabel={readinessLabel}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-brand-whatsapp px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-brand-whatsapp-hover sm:min-w-[9rem] sm:flex-none"
        >
          <Share2 size={14} aria-hidden />
          Share to WhatsApp
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-brand-linkedin px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-brand-linkedin-hover sm:min-w-[9rem] sm:flex-none"
        >
          <Linkedin size={14} aria-hidden />
          Share to LinkedIn
        </a>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="mm-btn-secondary inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold sm:min-w-[9rem] sm:flex-none"
        >
          <Download size={14} aria-hidden />
          {downloading ? 'Generating…' : 'Download card'}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="mm-btn-secondary inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold sm:min-w-[9rem] sm:flex-none"
        >
          <Copy size={14} aria-hidden />
          {copied ? 'Copied!' : 'Copy message'}
        </button>
      </div>

      <div className="mt-5 rounded-xl border border-border bg-surface-muted/80 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={leaderboardOptIn}
            onChange={(e) => handleLeaderboardOptIn(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-cta focus:ring-cta"
          />
          <span className="text-sm text-foreground">
            <span className="font-semibold">Opt in to the public leaderboard</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Show your score on the{' '}
              <Link to="/leadership-board" className="font-semibold text-cta underline-offset-2 hover:underline">
                leadership board
              </Link>{' '}
              (by college). Off by default — you choose.
            </span>
          </span>
        </label>
        {leaderboardOptIn && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <input
              type="text"
              value={collegeInput}
              onChange={(e) => {
                setCollegeInput(e.target.value);
                trySaveOptIn(leaderboardOptIn, e.target.value, branchInput);
              }}
              placeholder="College name (required)"
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-cta"
            />
            <input
              type="text"
              value={branchInput}
              onChange={(e) => setBranchInput(e.target.value)}
              placeholder="Branch (optional)"
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-cta"
            />
          </div>
        )}
        {optInSaved && (
          <p className="mt-2 text-xs font-semibold text-emerald-700">
            Saved — your score will appear on the board for your college.
          </p>
        )}
      </div>
    </div>
  );
}
