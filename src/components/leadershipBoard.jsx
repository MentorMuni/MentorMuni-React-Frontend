import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';
import { PRIMARY_CTA_LABEL } from '../constants/brandCopy';
import { motion } from 'framer-motion';
import {
  Trophy,
  Search,
  Share2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  Crown,
  GraduationCap,
  Globe,
  MessageCircle,
  Twitter,
  Linkedin,
  Link2,
  Check,
  Users,
  School,
  Award,
  Briefcase,
} from 'lucide-react';

const PAGE_SIZE = 10;
/** All‑India view shows only the top N rows (by readiness score). */
const ALL_INDIA_MAX_RESULTS = 15;

/** Audience buckets — matches readiness / profile flows (SQL later). */
const AUDIENCE_SEGMENTS = [
  { id: 'all', label: 'All', short: 'All', Icon: Users },
  { id: 'prefinal', label: 'Pre-final year', short: 'Pre-final', Icon: School },
  { id: 'final_year', label: '4th year graduate', short: '4th year', Icon: Award },
  { id: 'professional', label: 'IT professional', short: 'IT pro', Icon: Briefcase },
];

/** College board: students on campus only (no “All” / no working professionals). */
const COLLEGE_AUDIENCE_SEGMENTS = AUDIENCE_SEGMENTS.filter(
  (s) => s.id === 'prefinal' || s.id === 'final_year'
);

function segmentChipClass(id) {
  if (id === 'prefinal') return 'border-cyan-500/40 bg-cyan-500/10 text-cyan-700';
  if (id === 'final_year') return 'border-violet-500/40 bg-violet-500/10 text-violet-700';
  return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700';
}

/** Populated from API / SQL later — empty until real opt-ins exist. */
const MOCK_LEADERS = [];

function rankBadgeMeta(globalRank) {
  if (globalRank === 1) return { label: '1st', className: 'from-amber-400 via-yellow-300 to-amber-500 text-amber-950 shadow-amber-500/40', icon: Crown };
  if (globalRank === 2) return { label: '2nd', className: 'from-slate-300 via-slate-100 to-slate-400 text-foreground shadow-slate-400/35', icon: Trophy };
  if (globalRank === 3) return { label: '3rd', className: 'from-orange-400 via-amber-700 to-orange-600 text-amber-50 shadow-orange-600/35', icon: Trophy };
  if (globalRank <= 10) return { label: 'Top 10', className: 'from-fuchsia-500/90 to-violet-600 text-white shadow-fuchsia-500/30', icon: Sparkles };
  return null;
}

export default function LeadershipBoard() {
  const [mode, setMode] = useState('general');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [collegeQuery, setCollegeQuery] = useState('');
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Leadership Board · MentorMuni';
  }, []);

  useEffect(() => {
    setPage(1);
  }, [mode, collegeQuery, audienceFilter]);

  /** College mode cannot use “All” or IT professional — snap to pre-final. */
  useEffect(() => {
    if (mode === 'college' && (audienceFilter === 'all' || audienceFilter === 'professional')) {
      setAudienceFilter('prefinal');
    }
  }, [mode, audienceFilter]);

  const effectiveAudience = useMemo(() => {
    if (mode === 'college' && (audienceFilter === 'all' || audienceFilter === 'professional')) {
      return 'prefinal';
    }
    return audienceFilter;
  }, [mode, audienceFilter]);

  const audienceSegmentsForUi = useMemo(
    () => (mode === 'college' ? COLLEGE_AUDIENCE_SEGMENTS : AUDIENCE_SEGMENTS),
    [mode]
  );

  const filtered = useMemo(() => {
    let list = [...MOCK_LEADERS];
    if (effectiveAudience !== 'all') {
      list = list.filter((r) => r.segment === effectiveAudience);
    }
    if (mode === 'college') {
      const q = collegeQuery.trim().toLowerCase();
      if (!q) return [];
      list = list.filter((r) => r.college.toLowerCase().includes(q));
    }
    list = list.sort((a, b) => b.readinessScore - a.readinessScore);
    if (mode === 'general') {
      list = list.slice(0, ALL_INDIA_MAX_RESULTS);
    }
    return list;
  }, [mode, collegeQuery, effectiveAudience]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE) || 1);
  const safePage = Math.min(page, totalPages);
  const pageSlice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText =
    "MentorMuni's Leadership Board — take the readiness check and help fill the scoreboard.";

  const handleShare = (target) => {
    const encoded = encodeURIComponent(shareText);
    const url = encodeURIComponent(shareUrl);
    const urls = {
      whatsapp: `https://wa.me/?text=${encoded}%20${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${encoded}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    if (target === 'copy') {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
      return;
    }
    window.open(urls[target], '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF8] to-[#FFF8EE] text-foreground pt-[4.75rem] pb-16">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#FF9500]/8 blur-[100px]" />
        <div className="absolute right-0 top-40 h-[380px] w-[380px] rounded-full bg-fuchsia-400/8 blur-[90px]" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-cyan-400/6 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        {/* hero */}
        <div className="pt-8 sm:pt-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#FFB347]/30 bg-[#FFF4E0] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#CC7000]"
          >
            <Flame className="h-3.5 w-3.5 text-[#FF9500]" aria-hidden />
            Open leaderboard · Be early
          </motion.div>
          <h1 className="mt-5 font-black tracking-tight text-[2rem] leading-[1.1] sm:text-5xl text-foreground">
            Leadership Board
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            We&apos;re a startup building in public — this scoreboard starts empty without you. Take the Interview
            Readiness check and be among the first names on the board.
          </p>
          <button
            type="button"
            onClick={goToStartAssessment}
            className="mx-auto mt-5 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF9500] to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:from-[#E88600] hover:to-orange-700"
          >
            {PRIMARY_CTA_LABEL}
          </button>
        </div>

        {/* mode toggle */}
        <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <div className="flex rounded-2xl border border-border bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setMode('general')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:flex-initial sm:px-6 ${
                mode === 'general'
                  ? 'bg-gradient-to-r from-[#FF9500] to-[#E88600] text-white shadow-lg shadow-orange-500/25'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Globe className="h-4 w-4" aria-hidden />
              All‑India
            </button>
            <button
              type="button"
              onClick={() => setMode('college')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:flex-initial sm:px-6 ${
                mode === 'college'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-lg shadow-fuchsia-500/25'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <GraduationCap className="h-4 w-4" aria-hidden />
              College board
            </button>
          </div>
        </div>

        {/* Audience — filters board by student / professional segment */}
        <div className="mx-auto mt-6 max-w-3xl">
          <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Audience
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {audienceSegmentsForUi.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setAudienceFilter(id)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition sm:text-[13px] ${
                  effectiveAudience === id
                    ? mode === 'college'
                      ? 'border-fuchsia-500/50 bg-fuchsia-500/15 text-fuchsia-700 shadow-[0_0_20px_-8px_rgba(192,38,211,0.3)]'
                      : 'border-[#FF9500]/50 bg-[#FF9500]/15 text-[#CC7000] shadow-[0_0_20px_-8px_rgba(255,149,0,0.3)]'
                    : 'border-border bg-white text-muted-foreground hover:border-[#FFB347]/50 hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
                {label}
              </button>
            ))}
          </div>
          <p className="mx-auto mt-2 max-w-md text-center text-[11px] leading-relaxed text-muted-foreground">
            {mode === 'college'
              ? 'College leaderboard: pre-final vs final year — search a college to see ranks.'
              : 'All‑India: filter by everyone, pre-final, final year, or IT professionals.'}
          </p>
        </div>

        {/* college search — college board only (SQL-backed directory later) */}
        {mode === 'college' && (
          <div className="mx-auto mt-6 max-w-md">
            <label className="block">
              <span className="mb-2 block text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Search college by name
              </span>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={2}
                  aria-hidden
                />
                <input
                  type="search"
                  value={collegeQuery}
                  onChange={(e) => setCollegeQuery(e.target.value)}
                  placeholder="Type to filter — SQL + full directory soon"
                  className="w-full rounded-2xl border border-border bg-white py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-fuchsia-500/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                />
              </div>
            </label>
          </div>
        )}

        {/* share */}
        <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Share2 className="h-3.5 w-3.5" aria-hidden />
            Share the board
          </span>
          <button
            type="button"
            onClick={() => handleShare('whatsapp')}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-500/20"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden />
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => handleShare('twitter')}
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-500/20"
          >
            <Twitter className="h-3.5 w-3.5" aria-hidden />
            X
          </button>
          <button
            type="button"
            onClick={() => handleShare('linkedin')}
            className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-500/20"
          >
            <Linkedin className="h-3.5 w-3.5" aria-hidden />
            LinkedIn
          </button>
          <button
            type="button"
            onClick={() => handleShare('copy')}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-[#FFF4E0]"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Link2 className="h-3.5 w-3.5" aria-hidden />}
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>

        {/* list */}
        <div className="mt-10 rounded-3xl border border-border bg-white p-1 shadow-sm">
          <div className="flex flex-col gap-1 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-foreground">
              <Trophy className="h-5 w-5 shrink-0 text-[#FF9500]" aria-hidden />
              <span>
                {mode === 'college' ? 'College leaderboard' : 'National leaderboard'}
                {effectiveAudience !== 'all' && (
                  <span className="font-semibold text-muted-foreground">
                    {' '}
                    ·{' '}
                    {AUDIENCE_SEGMENTS.find((s) => s.id === effectiveAudience)?.label}
                  </span>
                )}
              </span>
            </div>
            {filtered.length > 0 && (
              <span className="rounded-full bg-[#FFF4E0] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#CC7000]">
                Page {safePage} / {totalPages}
              </span>
            )}
          </div>

          {mode === 'college' && !collegeQuery.trim() && (
            <div className="px-6 py-16 text-center">
              <Sparkles className="mx-auto h-10 w-10 text-fuchsia-500" aria-hidden />
              <p className="mt-4 text-lg font-bold text-foreground">Pick a college to unlock the board</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Search by name — we&apos;ll plug in a live directory + SQL soon. For now, try{' '}
                <button
                  type="button"
                  className="text-fuchsia-600 underline decoration-fuchsia-500/50 underline-offset-2"
                  onClick={() => setCollegeQuery('NIT Trichy')}
                >
                  NIT Trichy
                </button>{' '}
                or{' '}
                <button
                  type="button"
                  className="text-fuchsia-600 underline decoration-fuchsia-500/50 underline-offset-2"
                  onClick={() => setCollegeQuery('BITS')}
                >
                  BITS
                </button>
                .
              </p>
            </div>
          )}

          {mode === 'college' && collegeQuery.trim() && filtered.length === 0 && (
            <div className="px-6 py-14 text-center text-sm text-muted-foreground">
              No entries for this college yet — the board is empty until students opt in.
            </div>
          )}

          {mode === 'general' && filtered.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="text-base font-semibold text-foreground">Board is empty</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                No rankings yet. Take the Interview Readiness check to be among the first on the list.
              </p>
            </div>
          )}

          {(mode === 'general' || (collegeQuery.trim() && filtered.length > 0)) && filtered.length > 0 && (
              <ul className="divide-y divide-[#F0ECE0]">
                {pageSlice.map((row, i) => {
                  const globalRank = (safePage - 1) * PAGE_SIZE + i + 1;
                  const badge = rankBadgeMeta(globalRank);
                  const IconComp = badge?.icon;
                  return (
                    <li
                      key={row.id}
                      className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
                    >
                      <div className="flex items-center gap-3 sm:w-28 sm:shrink-0">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF9500] to-[#E88600] font-black tabular-nums text-lg text-white shadow-sm">
                          {globalRank}
                        </span>
                        {badge && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide shadow-lg ${badge.className}`}
                          >
                            {IconComp && <IconComp className="h-3 w-3" aria-hidden />}
                            {badge.label}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-foreground">{row.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{row.handle}</p>
                        <span
                          className={`mt-1 inline-block w-fit rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${segmentChipClass(row.segment)}`}
                        >
                          {AUDIENCE_SEGMENTS.find((s) => s.id === row.segment)?.short ?? row.segment}
                        </span>
                        {mode === 'college' && (
                          <p className="mt-1 truncate text-[11px] text-muted-foreground sm:hidden">{row.college}</p>
                        )}
                      </div>
                      {mode === 'college' && (
                        <p className="hidden text-sm text-muted-foreground sm:block sm:max-w-[140px] sm:truncate">{row.college}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                        <span className="inline-flex items-center gap-1 rounded-lg border border-[#FF9500]/30 bg-[#FF9500]/10 px-2 py-1 text-xs font-bold tabular-nums text-[#CC7000]">
                          {row.readinessScore} / 100
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                          <Flame className="h-3.5 w-3.5" aria-hidden />
                          {row.streak} streak
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

          {/* pagination */}
          {(mode === 'general' || (collegeQuery.trim() && filtered.length > 0)) && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 border-t border-border px-4 py-4">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-white px-3 py-2 text-xs font-bold text-foreground disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Prev
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`h-9 min-w-[2.25rem] rounded-xl text-xs font-bold transition ${
                      n === safePage
                        ? 'bg-gradient-to-r from-[#FF9500] to-[#E88600] text-white shadow-lg shadow-orange-500/20'
                        : 'border border-border bg-white text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-white px-3 py-2 text-xs font-bold text-foreground disabled:opacity-30"
              >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-[11px] text-muted-foreground">
          Showing preview rows until enough students opt in — then this becomes your live board.
        </p>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="text-sm font-semibold text-[#FF9500] underline decoration-[#FF9500]/40 underline-offset-4 hover:text-[#E88600]"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
