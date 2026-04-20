import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Mail,
  Phone,
  Building2,
  AlertCircle,
  Sparkles,
  Mic2,
  Brain,
  Timer,
  BookOpen,
  Percent,
  Cpu,
  Coins,
  X,
  PartyPopper,
  Check,
  Quote,
  Target,
  Layers,
  Zap,
  RefreshCw,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const MM_FIELD_INVALID =
  'border-2 border-red-500 bg-red-50 ring-2 ring-red-500/25 focus:border-red-600 focus:ring-2 focus:ring-red-500/35';
const MM_FIELD_VALID =
  'border border-border hover:border-border focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/30';

const ASSESSMENT_FOCUS_APTITUDE = 'aptitude';
const ASSESSMENT_FOCUS_SKILL = 'skill';

function posterAsset(filename) {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  return `${base}MentorMuni-React-Frontend/images/poster-carousel/${filename}`;
}

/** HR / placement + skill — students & grads */
function PlacementEngagement({ isSkillMode }) {
  const hrPrompts = [
    { q: 'What are your strengths?', hint: 'One strength + proof (project, metric, impact).' },
    { q: 'What is your weakness?', hint: 'Real gap + what you did to improve — not “I work too hard.”' },
    { q: 'Tell me about yourself.', hint: '60s: present → proof → what you want next.' },
    { q: 'What are your hobbies?', hint: 'Tie to discipline: consistency, learning, teamwork — not just a list.' },
  ];

  const clearTips = [
    'STAR for stories: Situation → Task → Action → Result.',
    'Pause 1s before answering — reads as thoughtful, not unsure.',
    'Ask one smart question at the end (team, stack, success in role).',
  ];

  return (
    <div className="space-y-6">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#C2410C] ring-1 ring-orange-200/80">
          <Target className="h-3.5 w-3.5" aria-hidden />
          {isSkillMode ? 'Skill + HR' : 'Interview & placement'}
        </div>
        <h3 className="mt-3 text-lg font-black tracking-tight text-foreground sm:text-xl">
          HR prompts you can rehearse in your head
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          For <span className="font-semibold text-foreground">1st–4th year</span> and{' '}
          <span className="font-semibold text-foreground">graduates</span> — use this screen while we build your set. No
          memorised essay — just clarity.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {hrPrompts.map((item, i) => (
          <motion.div
            key={item.q}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            className="group relative overflow-hidden rounded-2xl border border-[#E8E4DC] bg-gradient-to-br from-white to-[#FFFBF5] p-4 shadow-sm ring-1 ring-black/[0.03] transition hover:shadow-md"
          >
            <Quote className="absolute -right-1 -top-1 h-16 w-16 text-orange-100/90" aria-hidden />
            <p className="relative text-[13px] font-bold text-foreground">{item.q}</p>
            <p className="relative mt-2 text-xs leading-relaxed text-muted-foreground">{item.hint}</p>
          </motion.div>
        ))}
      </div>

      {/* Pictorial strip — reels → readiness */}
      <div className="overflow-hidden rounded-3xl border border-orange-200/70 bg-[#0c0a09] shadow-xl ring-1 ring-black/5">
        <div className="grid md:grid-cols-[1.15fr_1fr]">
          <div className="relative min-h-[200px]">
            <img
              src={posterAsset('readiness.jpg')}
              alt="From endless scrolling to focused interview readiness"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" aria-hidden />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" aria-hidden />
            <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange-200/95">1st–4th year · grads</p>
              <p className="mt-2 font-black leading-[1.15] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.5)] text-2xl sm:text-3xl">
                From reels to readiness
              </p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">
                Replace passive scrolling with one intentional story about your project or internship — that’s what panels
                remember.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4 bg-gradient-to-br from-[#1a1512] to-[#2d2419] p-5 sm:p-6">
            <div className="relative h-28 overflow-hidden rounded-2xl border border-white/10 sm:h-32">
              <img
                src={posterAsset('mock-interview.jpg')}
                alt=""
                className="h-full w-full object-cover opacity-90"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" aria-hidden />
              <p className="absolute bottom-2 left-3 right-3 text-xs font-bold text-white drop-shadow">Practice like it’s real</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-200/80">Tips to clear</p>
              <ul className="mt-2 space-y-2">
                {clearTips.map((t) => (
                  <li key={t} className="flex gap-2 text-xs leading-relaxed text-white/88">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" strokeWidth={2.5} aria-hidden />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Aptitude — tricks + light interaction */
function AptitudeEngagement() {
  const [revealed, setRevealed] = useState({ a: false, b: false });
  const reduceMotion = useReducedMotion();

  const tricks = [
    {
      Icon: Percent,
      title: 'Ballpark first',
      body: 'Get the order of magnitude before algebra — wrong units are the #1 slip.',
      accent: 'from-cyan-500/15 to-sky-400/10',
    },
    {
      Icon: BookOpen,
      title: 'Eliminate silly options',
      body: 'Cross out answers that break scale, sign, or units — then compare what’s left.',
      accent: 'from-violet-500/12 to-fuchsia-400/8',
    },
    {
      Icon: Timer,
      title: '2-minute move-on',
      body: 'Stuck? Mark and skip — aptitude rewards coverage across the full set.',
      accent: 'from-amber-500/15 to-orange-400/10',
    },
    {
      Icon: Brain,
      title: 'Pattern before proof',
      body: 'Sequences: try differences, ratios, pairs — then verify one step.',
      accent: 'from-emerald-500/12 to-teal-400/8',
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-cyan-900 ring-1 ring-cyan-200/80">
          <Zap className="h-3.5 w-3.5" aria-hidden />
          Aptitude warm-up
        </div>
        <h3 className="mt-3 text-lg font-black tracking-tight text-foreground sm:text-xl">Tricks for faster, calmer solves</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Easy questions become easier when you have a default method — try these while you wait.
        </p>
      </header>

      <div className="relative overflow-hidden rounded-3xl border border-cyan-200/50 bg-gradient-to-br from-cyan-50 via-white to-sky-50 p-1 shadow-inner">
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
          {tricks.map(({ Icon, title, body, accent }, i) => (
            <motion.div
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className={`relative overflow-hidden rounded-2xl border border-cyan-100/80 bg-gradient-to-br ${accent} p-4`}
            >
              <div className="flex gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-cyan-100">
                  <Icon className="h-6 w-6 text-cyan-800" strokeWidth={1.6} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[140px] bg-slate-900 sm:min-h-[180px]">
            <img src={posterAsset('planner.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-95" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/80 to-transparent" aria-hidden />
            <p className="absolute bottom-4 left-4 right-4 text-sm font-bold leading-snug text-white drop-shadow">
              Quick checks — tap to reveal. No pressure; just engagement.
            </p>
          </div>
          <div className="space-y-4 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-800">Try in your head</p>
            <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-3">
              <p className="text-sm font-semibold text-foreground">If 12 machines make 12 widgets in 12 minutes…</p>
              <p className="mt-1 text-xs text-muted-foreground">How long for one machine to make one widget?</p>
              <button
                type="button"
                onClick={() => setRevealed((r) => ({ ...r, a: !r.a }))}
                className="mt-2 text-xs font-bold text-cyan-700 underline underline-offset-2 hover:text-cyan-900"
              >
                {revealed.a ? 'Hide' : 'Reveal hint'}
              </button>
              {revealed.a && (
                <p className="mt-2 text-xs font-medium text-foreground">Often <strong>12 minutes</strong> — think rates per machine, not “divide by 12” blindly.</p>
              )}
            </div>
            <div className="rounded-xl border border-border bg-[#FAFAFA] p-3">
              <p className="text-sm font-semibold text-foreground">What’s 15% of 240?</p>
              <button
                type="button"
                onClick={() => setRevealed((r) => ({ ...r, b: !r.b }))}
                className="mt-2 text-xs font-bold text-[#EA580C] underline underline-offset-2"
              >
                {revealed.b ? 'Hide' : 'Show approach'}
              </button>
              {revealed.b && (
                <p className="mt-2 text-xs text-foreground">
                  10% = 24, 5% = 12 → <strong>36</strong>. Split percentages instead of raw multiplication.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Professionals — AI, Claude, tokens */
function ProfessionalEngagement() {
  const [dailyMsgs, setDailyMsgs] = useState(25);
  const [tokensPerMsg, setTokensPerMsg] = useState(600);
  const [usdPerMillion, setUsdPerMillion] = useState(3);
  const [usesClaudeDaily, setUsesClaudeDaily] = useState(null);

  const monthlyUsd = useMemo(() => {
    const tokens = dailyMsgs * tokensPerMsg * 30;
    return (tokens / 1_000_000) * usdPerMillion;
  }, [dailyMsgs, tokensPerMsg, usdPerMillion]);

  return (
    <div className="space-y-6">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-violet-900 ring-1 ring-violet-200/80">
          <Cpu className="h-3.5 w-3.5" aria-hidden />
          Working professionals
        </div>
        <h3 className="mt-3 text-lg font-black tracking-tight text-foreground sm:text-xl">AI, roles &amp; real costs</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A honest frame for the “will AI take my job?” question — plus why token limits matter for how you work.
        </p>
      </header>

      <div className="overflow-hidden rounded-3xl border border-violet-200/70 bg-gradient-to-br from-violet-950 via-[#2e1064] to-fuchsia-950 p-[1px] shadow-xl">
        <div className="rounded-[23px] bg-gradient-to-br from-violet-50 to-fuchsia-50/30 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-violet-200/50 sm:h-auto sm:w-40 sm:shrink-0">
              <img src={posterAsset('hr-technical.jpg')} alt="" className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-violet-950/25" aria-hidden />
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-black text-violet-950">
                <Shield className="h-4 w-4 text-violet-600" aria-hidden />
                Will AI take your job?
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                The sharper threat is <strong className="text-foreground">task commoditisation</strong>: summarising,
                boilerplate code, first drafts. Roles that add judgment, ownership, and verification stay sticky. Ignoring
                AI is riskier than using it badly — the gap widens weekly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
        <p className="text-sm font-bold text-foreground">Do you use Claude (or similar) daily?</p>
        <p className="mt-1 text-xs text-muted-foreground">Just for awareness — your estimate below drives the toy calculator.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { id: true, label: 'Yes, most workdays' },
            { id: false, label: 'Occasionally / not really' },
          ].map(({ id, label }) => (
            <button
              key={String(id)}
              type="button"
              onClick={() => {
                setUsesClaudeDaily(id);
                if (id) {
                  setDailyMsgs(40);
                  setTokensPerMsg(800);
                } else {
                  setDailyMsgs(12);
                  setTokensPerMsg(400);
                }
              }}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                usesClaudeDaily === id
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4">
        <div className="flex gap-3">
          <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
          <div>
            <p className="text-sm font-bold text-foreground">Context &amp; “memory” expire</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Long chats hit token limits — older turns drop or get summarised. That’s why <strong>interviews</strong> (and
              our mocks) use <strong>structured turns</strong>, not infinite scroll chat. Same idea: clarity beats volume.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Coins className="h-4 w-4 text-amber-600" />
          Rough monthly token cost (Claude-style blend)
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Adjust sliders — pricing varies by model; this is a directional ballpark, not a bill.
        </p>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[11px] font-semibold text-muted-foreground">Messages per day — {dailyMsgs}</span>
            <input
              type="range"
              min={5}
              max={120}
              value={dailyMsgs}
              onChange={(e) => setDailyMsgs(Number(e.target.value))}
              className="mt-2 w-full accent-violet-600"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold text-muted-foreground">Avg tokens / message — {tokensPerMsg}</span>
            <input
              type="range"
              min={200}
              max={4000}
              step={100}
              value={tokensPerMsg}
              onChange={(e) => setTokensPerMsg(Number(e.target.value))}
              className="mt-2 w-full accent-violet-600"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold text-muted-foreground">$ / 1M tokens (your guess)</span>
            <input
              type="range"
              min={1}
              max={15}
              step={0.5}
              value={usdPerMillion}
              onChange={(e) => setUsdPerMillion(Number(e.target.value))}
              className="mt-2 w-full accent-amber-600"
            />
            <span className="mt-1 block text-center text-xs tabular-nums text-muted-foreground">${usdPerMillion.toFixed(1)} / 1M</span>
          </label>
        </div>
        <motion.div
          key={monthlyUsd}
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="mt-4 rounded-xl bg-gradient-to-r from-amber-100 to-orange-50 px-4 py-3 text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900/80">Estimated / month</p>
          <p className="text-2xl font-black tabular-nums text-amber-950">
            ≈ ${monthlyUsd.toFixed(2)}
          </p>
          <p className="text-[10px] text-muted-foreground">Illustrative only · not financial advice</p>
        </motion.div>
      </div>
    </div>
  );
}

function PreparingTopBanner() {
  const pillars = [
    { title: 'Personalised set', sub: 'Tailored to what you told us' },
    { title: 'AI in real interviews', sub: 'Panels use tools — practice should too' },
    { title: 'Mock + prep', sub: 'MentorMuni AI mock interviews' },
  ];
  return (
    <motion.div
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -16, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      className="sticky top-0 z-50 border-b border-orange-200/90 bg-white/90 shadow-lg shadow-orange-950/10 backdrop-blur-md"
      role="status"
      aria-live="polite"
    >
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#FFF4E6] via-white to-[#FFF8EE]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `repeating-linear-gradient(-60deg, transparent, transparent 12px, rgba(234,88,12,0.06) 12px, rgba(234,88,12,0.06) 13px)`,
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-3.5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="flex min-w-0 items-start gap-3">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF9500] to-[#EA580C] text-white shadow-lg shadow-orange-500/30">
                <Sparkles className="h-5 w-5" aria-hidden />
                <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C2410C]">Preparing</p>
                <p className="mt-0.5 text-base font-black tracking-tight text-foreground sm:text-lg">
                  We’re building your personalised questions
                </p>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Interviews are increasingly <strong className="text-foreground">AI-assisted</strong> — so why wouldn’t
                  your practice be? Good prep takes <strong className="text-foreground">time and effort</strong>. Stay
                  calm; use this moment to fill your details and skim the coach panel.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#9A3412] shadow-sm ring-1 ring-orange-100">
                <Mic2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                AI mock interviews
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground shadow-sm ring-1 ring-border">
                <Layers className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Structured preparation
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-900 ring-1 ring-emerald-200/80">
                <Timer className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Good things take time — breathe
              </span>
            </div>
          </div>
          <div className="mt-4 grid gap-2 border-t border-orange-100/80 pt-4 sm:grid-cols-3">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-white/80 bg-white/60 px-3 py-2.5 text-center shadow-sm backdrop-blur-sm sm:text-left"
              >
                <p className="text-[11px] font-bold text-foreground">{p.title}</p>
                <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{p.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ReadyGateModal({ open, onClose, onConfirm, isProfessional }) {
  const reduceMotion = useReducedMotion();

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return undefined;
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="prep-ready-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="presentation"
            className="absolute inset-0 bg-black/50 backdrop-blur-[3px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-[1.75rem] border border-orange-200/90 bg-white shadow-[0_24px_80px_-20px_rgba(0,0,0,0.35)]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-20 rounded-full p-2 text-muted-foreground transition hover:bg-black/5 hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
            {!isProfessional ? (
              <div className="relative aspect-[16/9] min-h-[160px] w-full bg-[#0f0f0f] sm:aspect-[2/1] sm:min-h-[200px]">
                <img
                  src={posterAsset('readiness.jpg')}
                  alt="From reels to readiness — student placement prep"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" aria-hidden />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5 sm:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange-200/95">Students · 1st–4th year · grads</p>
                  <p className="mt-2 font-black leading-tight text-white text-2xl sm:text-3xl [text-shadow:0_2px_20px_rgba(0,0,0,0.6)]">
                    From reels to readiness
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[2/1] min-h-[140px] w-full bg-slate-900">
                <img
                  src={posterAsset('mock-interview.jpg')}
                  alt="Professional interview practice"
                  className="h-full w-full object-cover opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 to-slate-950/20" aria-hidden />
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-200/90">Professional</p>
                  <p className="mt-1 text-lg font-black text-white sm:text-xl">Calm answers. Real signal.</p>
                </div>
              </div>
            )}
            <div className="p-6 sm:p-8">
              <div className="mb-2 flex items-center gap-2 text-[#EA580C]">
                <PartyPopper className="h-5 w-5" aria-hidden />
                <span className="text-xs font-bold uppercase tracking-wider">Your set is ready</span>
              </div>
              <h2 id="prep-ready-title" className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {isProfessional ? 'Ready for your reality check?' : 'Are you ready to check the reality?'}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {isProfessional
                  ? 'AI screens and human panels both reward specificity. Take a breath — then answer like it counts.'
                  : 'Honest beats perfect. When you start, answer the way you would in a real round — this is your practice lane.'}
              </p>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border-2 border-border bg-white px-5 py-3.5 text-sm font-bold text-muted-foreground transition hover:bg-[#FAFAFA]"
                >
                  Not yet
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="rounded-xl bg-gradient-to-r from-[#FF9500] to-[#EA580C] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:brightness-[1.05] active:scale-[0.99]"
                >
                  I’m ready — start the test
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PrepLoungePanel({
  planLoading,
  evaluationPlan,
  error,
  profile,
  setProfile,
  validationErrors = {},
  setValidationErrors,
  onStartTest,
  onRetry,
  onBackEdit,
}) {
  const qCount = Array.isArray(evaluationPlan) ? evaluationPlan.length : 0;
  const ready = !planLoading && qCount > 0 && !error;
  const isPro = profile?.userCategory === 'professional';
  const mode = profile?.assessmentMode;
  const isSkillMode = mode === ASSESSMENT_FOCUS_SKILL;

  const [showReadyModal, setShowReadyModal] = useState(false);

  useEffect(() => {
    if (ready) setShowReadyModal(true);
  }, [ready]);

  const handleStartClick = () => {
    if (typeof onStartTest === 'function') onStartTest();
  };

  const handleModalConfirm = () => {
    setShowReadyModal(false);
    handleStartClick();
  };

  const engagement = useMemo(() => {
    if (mode === ASSESSMENT_FOCUS_APTITUDE) return <AptitudeEngagement />;
    if (isPro) return <ProfessionalEngagement />;
    return <PlacementEngagement isSkillMode={isSkillMode} />;
  }, [mode, isPro, isSkillMode]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FFFDF8] font-sans">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,149,0,0.12),transparent)]"
        aria-hidden
      />

      <AnimatePresence mode="wait">{planLoading && <PreparingTopBanner />}</AnimatePresence>

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-3 lg:mb-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#B45309]">Wait-time coach</p>
            <p className="mt-1 text-sm text-muted-foreground">Stay engaged — your details + tips run in parallel.</p>
          </div>
          {planLoading && (
            <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-orange-100 sm:block" aria-hidden>
              <motion.div
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#FF9500] to-amber-400"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start xl:grid-cols-[minmax(0,1.15fr)_420px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="order-2 rounded-3xl border border-[#E6E0D6] bg-white/95 p-5 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.2)] ring-1 ring-black/[0.04] backdrop-blur-sm sm:p-7 lg:order-1"
          >
            {engagement}
          </motion.div>

          <div className="order-1 space-y-5 lg:order-2">
            <div className="rounded-3xl border border-border bg-white p-6 shadow-lg shadow-black/[0.04]">
              <p className="text-xs font-black uppercase tracking-wider text-[#B45309]">Prep lounge</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {planLoading ? 'Your test is being prepared' : ready ? 'You’re all set' : 'We couldn’t generate questions'}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {planLoading
                  ? 'Add your contact details here — we’ll keep generating in the background. Scroll the coach panel for HR, aptitude, or AI tips.'
                  : `${qCount} personalised question${qCount === 1 ? '' : 's'} ready when you are.`}
              </p>
              {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
            </div>

            {profile && setProfile && (
              <div className="rounded-3xl border border-[#FFD9A8]/90 bg-gradient-to-b from-white to-[#FFFBF7] p-5 shadow-md sm:p-6">
                <h2 className="text-sm font-black text-foreground">Your details</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Required before you start. We use this to reach you and calibrate your assessment.
                </p>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-foreground" htmlFor="prep-lounge-email">
                      <Mail className="h-3.5 w-3.5 text-[#FF9500]" aria-hidden />
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="prep-lounge-email"
                      type="email"
                      autoComplete="email"
                      value={profile.email ?? ''}
                      onChange={(e) => {
                        setProfile((p) => ({ ...p, email: e.target.value }));
                        setValidationErrors?.((prev) => (prev.email ? { ...prev, email: '' } : prev));
                      }}
                      data-mm-invalid={validationErrors.email ? 'true' : undefined}
                      className={`w-full rounded-xl bg-white px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-hint ${
                        validationErrors.email ? MM_FIELD_INVALID : MM_FIELD_VALID
                      }`}
                      placeholder="you@example.com"
                    />
                    {validationErrors.email && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {validationErrors.email}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-foreground" htmlFor="prep-lounge-phone">
                      <Phone className="h-3.5 w-3.5 text-[#FF9500]" aria-hidden />
                      WhatsApp / phone <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="prep-lounge-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={profile.contactNumber ?? ''}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setProfile((p) => ({ ...p, contactNumber: digits }));
                        setValidationErrors?.((prev) => (prev.phone ? { ...prev, phone: '' } : prev));
                      }}
                      data-mm-invalid={validationErrors.phone ? 'true' : undefined}
                      className={`w-full rounded-xl bg-white px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-hint ${
                        validationErrors.phone ? MM_FIELD_INVALID : MM_FIELD_VALID
                      }`}
                      placeholder="10-digit number"
                    />
                    {validationErrors.phone && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {validationErrors.phone}
                      </div>
                    )}
                  </div>
                  {!isPro && (
                    <div className="space-y-2">
                      <label
                        className="flex items-center gap-2 text-xs font-bold text-foreground"
                        htmlFor="prep-lounge-college"
                      >
                        <Building2 className="h-3.5 w-3.5 text-[#FF9500]" aria-hidden />
                        College / university <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="prep-lounge-college"
                        type="text"
                        value={profile.collegeName ?? ''}
                        onChange={(e) => {
                          setProfile((p) => ({ ...p, collegeName: e.target.value }));
                          setValidationErrors?.((prev) => (prev.collegeName ? { ...prev, collegeName: '' } : prev));
                        }}
                        data-mm-invalid={validationErrors.collegeName ? 'true' : undefined}
                        className={`w-full rounded-xl bg-white px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-hint ${
                          validationErrors.collegeName ? MM_FIELD_INVALID : MM_FIELD_VALID
                        }`}
                        placeholder="e.g. IIT Madras"
                      />
                      {validationErrors.collegeName && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          {validationErrors.collegeName}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-border bg-white p-5 shadow-md">
              {ready ? (
                <button
                  type="button"
                  onClick={() => setShowReadyModal(true)}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#FF9500] to-[#EA580C] py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-105 active:scale-[0.99]"
                >
                  Appear for test
                </button>
              ) : error ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="w-full rounded-2xl border-2 border-[#FF9500] bg-[#FFF8EE] py-3.5 text-sm font-bold text-[#B45309]"
                >
                  Try generating again
                </button>
              ) : (
                <div className="space-y-3 text-center">
                  <div className="relative mx-auto h-10 w-10">
                    <div className="absolute inset-0 rounded-full border-2 border-[#FF9500]/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#FF9500] animate-spin" />
                  </div>
                  <p className="text-sm font-bold text-foreground">Generating your questions…</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    This usually takes a moment. Keep reading the coach — it’s built to make the wait feel shorter.
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={onBackEdit}
                className="mt-4 w-full text-center text-sm font-semibold text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                Edit my assessment answers
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReadyGateModal
        open={showReadyModal && ready}
        onClose={() => setShowReadyModal(false)}
        onConfirm={handleModalConfirm}
        isProfessional={isPro}
      />
    </div>
  );
}
