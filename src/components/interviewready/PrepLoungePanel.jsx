import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Flame,
  Share2,
  PartyPopper,
  ArrowRight,
  Loader2,
  Mail,
  Phone,
  Building2,
  AlertCircle,
  X,
} from 'lucide-react';

const MM_FIELD_INVALID =
  'border-2 border-red-500 bg-red-50 ring-2 ring-red-500/25 focus:border-red-600 focus:ring-2 focus:ring-red-500/35';
const MM_FIELD_VALID =
  'border border-border hover:border-border focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/30';

/** Rotating copy — personalized generation, not generic */
const FORGE_LINES = [
  'We’re building your set — not pulling a generic quiz off the shelf.',
  'Calibrating difficulty to your profile, stack, and placement context.',
  'Mixing MCQs, scenarios & yes/no so it feels closer to a real screen.',
  'This wait = your questions only. Worth a few extra seconds.',
  'Panels test clarity under pressure — we’re matching tone to that.',
];

const VIBE_EMOJIS = [
  { id: 'locked', emoji: '🎯', label: 'Locked in' },
  { id: 'coffee', emoji: '☕', label: 'Caffeinated' },
  { id: 'fire', emoji: '🔥', label: 'Main character' },
  { id: 'cool', emoji: '😎', label: 'Chill grind' },
  { id: 'rocket', emoji: '🚀', label: 'Send it' },
];

const FLEX_CHIPS = [
  { id: 'offer', label: 'Dream offer' },
  { id: 'prove', label: 'Prove doubters wrong' },
  { id: 'level', label: 'Level up skills' },
  { id: 'fun', label: 'Just love the chaos' },
];

/**
 * Step after assessment forms: gamified micro-interactions while the plan API runs,
 * then "Appear for test" when questions are ready.
 */
export default function PrepLoungePanel({
  planLoading,
  evaluationPlan,
  error,
  prepLounge,
  setPrepLounge,
  profile,
  setProfile,
  validationErrors = {},
  setValidationErrors,
  onStartTest,
  onRetry,
  onBackEdit,
}) {
  const isPro = profile?.userCategory === 'professional';
  const reduceMotion = useReducedMotion();
  const [lineIdx, setLineIdx] = useState(0);
  /** Popup for contact details while questions generate — reopen after dismiss or on new generation */
  const [detailsModalOpen, setDetailsModalOpen] = useState(true);
  const qCount = Array.isArray(evaluationPlan) ? evaluationPlan.length : 0;
  const ready = !planLoading && qCount > 0 && !error;

  useEffect(() => {
    if (planLoading) setDetailsModalOpen(true);
  }, [planLoading]);

  useEffect(() => {
    if (!detailsModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [detailsModalOpen]);

  useEffect(() => {
    const ms = reduceMotion ? 10000 : 4800;
    const id = window.setInterval(() => {
      setLineIdx((i) => (i + 1) % FORGE_LINES.length);
    }, ms);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const handleShare = async () => {
    const text = 'Taking the MentorMuni interview readiness check — questions built for my profile, not generic drills.';
    const url = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'MentorMuni', text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
      }
    } catch {
      /* dismissed or unsupported */
    }
  };

  const detailsForm =
    profile &&
    setProfile && (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-foreground" htmlFor="prep-email">
            <Mail className="h-3.5 w-3.5 text-[#FF9500]" aria-hidden />
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="prep-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={profile.email ?? ''}
            onChange={(e) => {
              setProfile((p) => ({ ...p, email: e.target.value }));
              setValidationErrors?.((prev) => (prev.email ? { ...prev, email: '' } : prev));
            }}
            placeholder="you@example.com"
            aria-invalid={validationErrors.email ? 'true' : undefined}
            data-mm-invalid={validationErrors.email ? 'true' : undefined}
            className={`w-full rounded-xl bg-white px-4 py-3 text-sm font-normal text-foreground outline-none transition-all placeholder:text-hint ${validationErrors.email ? MM_FIELD_INVALID : MM_FIELD_VALID}`}
          />
          {validationErrors.email && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {validationErrors.email}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-foreground" htmlFor="prep-phone">
            <Phone className="h-3.5 w-3.5 text-[#FF9500]" aria-hidden />
            WhatsApp / phone <span className="text-red-400">*</span>
          </label>
          <input
            id="prep-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={profile.contactNumber ?? ''}
            onChange={(e) => {
              setProfile((p) => ({ ...p, contactNumber: e.target.value }));
              setValidationErrors?.((prev) => (prev.phone ? { ...prev, phone: '' } : prev));
            }}
            placeholder="10+ digit number"
            aria-invalid={validationErrors.phone ? 'true' : undefined}
            data-mm-invalid={validationErrors.phone ? 'true' : undefined}
            className={`w-full rounded-xl bg-white px-4 py-3 text-sm font-normal text-foreground outline-none transition-all placeholder:text-hint ${validationErrors.phone ? MM_FIELD_INVALID : MM_FIELD_VALID}`}
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
            <label className="flex items-center gap-2 text-xs font-bold text-foreground" htmlFor="prep-college">
              <Building2 className="h-3.5 w-3.5 text-[#FF9500]" aria-hidden />
              College / university <span className="text-red-400">*</span>
            </label>
            <input
              id="prep-college"
              type="text"
              value={profile.collegeName ?? ''}
              onChange={(e) => {
                setProfile((p) => ({ ...p, collegeName: e.target.value }));
                setValidationErrors?.((prev) => (prev.collegeName ? { ...prev, collegeName: '' } : prev));
              }}
              placeholder="e.g. IIT Madras, state university…"
              aria-invalid={validationErrors.collegeName ? 'true' : undefined}
              data-mm-invalid={validationErrors.collegeName ? 'true' : undefined}
              className={`w-full rounded-xl bg-white px-4 py-3 text-sm font-normal text-foreground outline-none transition-all placeholder:text-hint ${validationErrors.collegeName ? MM_FIELD_INVALID : MM_FIELD_VALID}`}
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
    );

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#FFFDF8] font-sans"
      role="status"
      aria-live="polite"
      aria-busy={planLoading ? 'true' : 'false'}
    >
      {/* Modal: share details while questions are prepared */}
      <AnimatePresence>
        {detailsModalOpen && profile && setProfile && (
          <motion.div
            key="details-modal"
            className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close details dialog"
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition hover:bg-black/50"
              onClick={() => setDetailsModalOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="prep-details-title"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative z-10 flex max-h-[min(90vh,640px)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-[#FFE4C4] bg-[#FFFCF7] shadow-[0_24px_80px_rgba(0,0,0,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#FFE4C4]/80 bg-gradient-to-r from-[#FFF8EE] to-white px-5 py-4 sm:px-6">
                <div className="min-w-0 text-left">
                  <p id="prep-details-title" className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                    Your details
                  </p>
                  <p className="mt-1 text-sm leading-snug text-muted-foreground">
                    While we prepare your questions, share these — required before you start the test (reports &amp; updates).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailsModalOpen(false)}
                  className="shrink-0 rounded-xl p-2 text-muted-foreground transition hover:bg-black/[0.06] hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{detailsForm}</div>
              <div className="shrink-0 border-t border-[#FFE4C4]/80 bg-white/90 px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => setDetailsModalOpen(false)}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#FF9500] to-[#EA580C] py-3.5 text-sm font-black text-white shadow-[0_8px_24px_rgba(234,88,12,0.3)] transition hover:from-[#EA580C] hover:to-[#C2410C] active:scale-[0.99]"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-16 h-72 w-72 rounded-full bg-[#FF9500]/12 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-fuchsia-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-lg px-4 py-10 pb-28 sm:max-w-xl sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FF9500]/35 bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C2410C] shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Prep lounge
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Your test is being <span className="bg-gradient-to-r from-[#FF9500] to-[#EA580C] bg-clip-text text-transparent">forged</span>
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-muted-foreground">
            Hang here — we’re generating questions for <span className="text-foreground font-semibold">you</span>, not a
            one-size-fits-all mock.
          </p>
        </motion.div>

        {/* Status / generation animation */}
        <div className="relative mx-auto mt-8 max-w-md overflow-hidden rounded-3xl border border-[#FFE4C4]/90 bg-gradient-to-br from-white via-[#FFFCF7] to-[#FFF4E0]/80 p-5 shadow-[0_12px_40px_rgba(255,149,0,0.12)] sm:p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="relative flex h-16 w-16 items-center justify-center">
              {planLoading ? (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#FF9500]/20"
                    animate={reduceMotion ? {} : { scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute inset-1 rounded-full border-2 border-transparent border-t-[#FF9500] border-r-[#FF9500]/40"
                    animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                  />
                  <Zap className="relative z-10 h-7 w-7 text-[#FF9500]" strokeWidth={2.2} aria-hidden />
                </>
              ) : ready ? (
                <motion.div
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30"
                >
                  <PartyPopper className="h-8 w-8 text-white" aria-hidden />
                </motion.div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-200">
                  <Loader2 className="h-8 w-8 animate-spin text-neutral-500" aria-hidden />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                {planLoading ? 'Generating' : ready ? 'Ready' : 'Something off'}
              </p>
              <p className="mt-0.5 text-sm font-bold text-foreground">
                {planLoading
                  ? 'Personalized questions — not a template dump'
                  : ready
                    ? `${qCount} questions · tuned to your profile`
                    : 'We couldn’t finish that request'}
              </p>
            </div>
          </div>

          {planLoading && (
            <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-[#E8E4DC]/80">
              <motion.div
                className="absolute inset-y-0 w-2/5 rounded-full bg-gradient-to-r from-[#FF9500] via-[#FFB347] to-cyan-500"
                initial={false}
                animate={reduceMotion ? { left: '30%' } : { left: ['-40%', '100%'] }}
                transition={reduceMotion ? { duration: 0 } : { duration: 2.2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.p
              key={lineIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="mt-4 min-h-[3rem] text-sm leading-relaxed text-[#333333]"
            >
              {FORGE_LINES[lineIdx]}
            </motion.p>
          </AnimatePresence>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-left text-xs font-medium text-red-800">
              {error}
            </div>
          )}
        </div>

        {/* Reopen details popup if dismissed */}
        {profile && setProfile && !detailsModalOpen && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setDetailsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[#FF9500]/40 bg-white px-4 py-2.5 text-sm font-bold text-[#B45309] shadow-sm transition hover:bg-[#FFF8EE]"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Your details — email, phone{!isPro ? ', college' : ''}
            </button>
          </div>
        )}

        {/* Gamification — pass time while API runs */}
        <div className="mt-8 space-y-6">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-orange-500" aria-hidden />
              Mood for today&apos;s grind
            </p>
            <div className="flex flex-wrap gap-2">
              {VIBE_EMOJIS.map((v) => {
                const on = prepLounge.vibe === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setPrepLounge((s) => ({ ...s, vibe: v.id }))}
                    className={`flex min-w-[4.5rem] flex-col items-center rounded-2xl border px-3 py-2 text-center transition-all ${
                      on
                        ? 'border-[#FF9500] bg-[#FFF4E0] shadow-md shadow-[#FF9500]/15 ring-2 ring-[#FF9500]/25'
                        : 'border-border bg-white/90 hover:border-[#FFB347]/60'
                    }`}
                  >
                    <span className="text-xl" aria-hidden>
                      {v.emoji}
                    </span>
                    <span className="mt-0.5 text-[10px] font-semibold text-muted-foreground">{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="battle-tag" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Battle tag <span className="font-normal normal-case text-hint">(optional)</span>
            </label>
            <input
              id="battle-tag"
              type="text"
              maxLength={24}
              value={prepLounge.battleTag}
              onChange={(e) => setPrepLounge((s) => ({ ...s, battleTag: e.target.value }))}
              placeholder="e.g. TC_or_bust"
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground outline-none transition-all placeholder:font-normal placeholder:text-hint focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/25"
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">What are you chasing?</p>
            <div className="flex flex-wrap gap-2">
              {FLEX_CHIPS.map((c) => {
                const on = prepLounge.flex === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setPrepLounge((s) => ({ ...s, flex: c.id }))}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                      on
                        ? 'border-[#FF9500] bg-[#FFF4E0] text-[#9A3412]'
                        : 'border-border bg-white text-muted-foreground hover:border-[#FFB347]/50'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#FF9500]/40 bg-white/80 py-3 text-sm font-bold text-[#CC7000] transition hover:bg-[#FFF8EE]"
          >
            <Share2 className="h-4 w-4" aria-hidden />
            Hype a friend — share the vibe
          </button>
        </div>

        {/* Sticky CTAs */}
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-[#FFFDF8]/95 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:static sm:mt-10 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <div className="mx-auto flex max-w-md flex-col gap-3 sm:max-w-xl">
            {ready && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onStartTest}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF9500] to-[#EA580C] py-4 text-base font-black text-white shadow-[0_8px_28px_rgba(234,88,12,0.35)] transition hover:from-[#EA580C] hover:to-[#C2410C] active:scale-[0.99]"
              >
                Appear for test
                <ArrowRight className="h-5 w-5" aria-hidden />
              </motion.button>
            )}

            {planLoading && (
              <p className="text-center text-xs font-medium text-muted-foreground">
                Finish the vibes above — your button unlocks when your set is ready.
              </p>
            )}

            {error && (
              <button
                type="button"
                onClick={onRetry}
                className="w-full rounded-xl border-2 border-[#FF9500] bg-white py-3 text-sm font-bold text-[#EA580C] transition hover:bg-[#FFF8EE]"
              >
                Try generating again
              </button>
            )}

            <button
              type="button"
              onClick={onBackEdit}
              className="text-center text-sm font-semibold text-muted-foreground underline decoration-border underline-offset-2 hover:text-foreground"
            >
              ← Edit my assessment answers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
