import React, { useEffect, useState, useMemo, useCallback, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Mail,
  Phone,
  Building2,
  AlertCircle,
  Sparkles,
  Brain,
  Target,
  Zap,
  Quote,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Percent,
  BookOpen,
  Timer,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
} from 'lucide-react';
import { READINESS_CHECK_PRODUCT_NOUN, HERO_PROOF_STAT } from '../../constants/brandCopy';

const MM_FIELD_INVALID =
  'mm-focus w-full rounded-xl border-2 border-red-500 bg-red-50 py-3.5 pl-11 pr-4 text-sm outline-none ring-2 ring-red-500/25 focus:border-red-600 focus:ring-2 focus:ring-red-500/35';
const MM_FIELD_VALID =
  'mm-focus w-full rounded-xl border border-border bg-white px-4 py-3.5 pl-11 text-sm text-foreground outline-none transition-[border-color,box-shadow] hover:border-border focus:border-cta focus:ring-2 focus:ring-cta/25';

const ASSESSMENT_FOCUS_APTITUDE = 'aptitude';
const ASSESSMENT_FOCUS_SKILL = 'skill';

const FLOW_STEPS = [
  { id: 'details', label: 'Details', short: 'Contact' },
  { id: 'generating', label: 'Build', short: 'Questions' },
  { id: 'ready', label: 'Start', short: 'Test' },
];

const PLACEMENT_COMPANIES = ['TCS', 'Infosys', 'Nagarro', 'Persistent', 'Capgemini', 'Accenture'];

const PLACEMENT_POSTERS = [
  { file: 'readiness.jpg', caption: 'Readiness score & gaps' },
  { file: 'mock-interview.jpg', caption: 'Mock interview reps' },
  { file: 'mentorship.jpg', caption: 'Mentor guidance' },
  { file: 'hr-technical.jpg', caption: 'HR + technical prep' },
];

const BUILD_STAGES = [
  'Reading your profile',
  'Matching question patterns',
  'Personalising difficulty',
  'Finalising your set',
];

const EASE_STANDARD = [0.2, 0, 0, 1];

function posterAsset(filename) {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  return `${base}MentorMuni-React-Frontend/images/poster-carousel/${filename}`;
}

function getModeLabel(mode, isSkillMode) {
  if (mode === ASSESSMENT_FOCUS_APTITUDE) return 'Aptitude readiness';
  if (isSkillMode || mode === ASSESSMENT_FOCUS_SKILL) return 'Skill readiness';
  return 'Interview readiness';
}

function getTipSectionTitle(mode, isSkillMode) {
  if (mode === ASSESSMENT_FOCUS_APTITUDE) return 'While you wait — aptitude';
  if (isSkillMode || mode === ASSESSMENT_FOCUS_SKILL) return 'While you wait — skill & HR';
  return 'While you wait — interviews';
}

function getWaitingTipSlides(mode, isSkillMode, isPro) {
  if (mode === ASSESSMENT_FOCUS_APTITUDE) {
    return [
      { icon: Percent, tag: 'Quant', title: 'Estimate before you calculate', body: 'Ballpark magnitude first — wrong orders stand out before exact math.' },
      { icon: BookOpen, tag: 'Elimination', title: 'Drop unlikely options', body: 'Cross out answers that break units or common sense — often down to two choices.' },
      { icon: Timer, tag: 'Pacing', title: 'Two-minute rule', body: 'Stuck? Mark your best guess and move on — coverage matters in campus tests.' },
      { icon: Brain, tag: 'Logic', title: 'Pattern first', body: 'Spot the rule on series/logic items, then verify on the next term.' },
    ];
  }
  if (isPro) {
    return [
      { icon: Brain, tag: 'Structure', title: 'Clear signal', body: 'Situation → Action → Result with metrics. You own crisp delivery.' },
      { icon: Target, tag: 'Role fit', title: 'Mirror the JD', body: 'Weave 2–3 role keywords into each story — specificity wins.' },
      { icon: Zap, tag: 'Delivery', title: 'Pause, then answer', body: 'A brief pause reads as confidence. Answer in short chunks.' },
    ];
  }
  const interviewTips = [
    { icon: Quote, tag: 'HR', title: 'Tell me about yourself', body: '60s: present → one proof → what you want next.' },
    { icon: Target, tag: 'Strengths', title: 'Proof, not adjectives', body: 'One strength + one metric beats listing five traits.' },
    { icon: Sparkles, tag: 'Weakness', title: 'Growth story', body: 'Real gap + what you did to improve — not “I work too hard.”' },
    { icon: CheckCircle2, tag: 'STAR', title: 'End with impact', body: 'Situation → Task → Action → Result. Panels remember outcomes.' },
  ];
  if (isSkillMode) {
    return [
      { icon: Zap, tag: 'Depth', title: 'One skill, deep focus', body: 'Fundamentals, traps, and applied scenarios for your chosen skill.' },
      ...interviewTips.slice(0, 3),
    ];
  }
  return interviewTips;
}

/** Material-style linear stepper with connected track */
function LinearStepper({ phaseIndex, reduceMotion }) {
  const progressPct = phaseIndex < 0 ? 0 : ((phaseIndex + 0.5) / FLOW_STEPS.length) * 100;

  return (
    <nav aria-label="Progress" className="mb-6 w-full">
      <div className="relative mb-4 h-1 overflow-hidden rounded-full bg-border">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cta to-[#1A8FC4]"
          initial={false}
          animate={{ width: `${Math.min(100, Math.max(8, progressPct))}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: EASE_STANDARD }}
          role="progressbar"
          aria-valuenow={Math.round(progressPct)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <ol className="grid grid-cols-3 gap-2">
        {FLOW_STEPS.map((step, i) => {
          const done = i < phaseIndex;
          const active = i === phaseIndex;
          return (
            <li
              key={step.id}
              className={`flex flex-col items-center text-center ${active ? 'text-foreground' : 'text-muted-foreground'}`}
              aria-current={active ? 'step' : undefined}
            >
              <span
                className={`mb-1.5 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  done
                    ? 'bg-emerald-600 text-white'
                    : active
                      ? 'bg-cta text-white ring-4 ring-cta/20'
                      : 'bg-surface-muted text-muted-foreground'
                }`}
              >
                {done ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : i + 1}
              </span>
              <span className="text-[11px] font-semibold leading-tight sm:text-xs">{step.label}</span>
              <span className="hidden text-[10px] text-muted-foreground sm:block">{step.short}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function PlacementInspirationPanel({ reduceMotion, phaseIndex, planLoading }) {
  const [posterIdx, setPosterIdx] = useState(0);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = window.setInterval(() => setPosterIdx((i) => (i + 1) % PLACEMENT_POSTERS.length), 5000);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const poster = PLACEMENT_POSTERS[posterIdx];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-secondary">
        <AnimatePresence mode="wait">
          <motion.img
            key={poster.file}
            src={posterAsset(poster.file)}
            alt=""
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <p className="absolute bottom-0 left-0 right-0 px-4 py-3 text-sm font-medium text-white">{poster.caption}</p>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-[#1A8FC4]" aria-hidden />
          <p className="text-sm font-semibold text-foreground">Campus placement prep</p>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Measure gaps before drives — then prep with focus, not guesswork.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {PLACEMENT_COMPANIES.map((name) => (
            <div
              key={name}
              className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-2.5 py-2"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-[9px] font-bold text-[#15799F] shadow-sm">
                {name.slice(0, 2)}
              </span>
              <span className="truncate text-xs font-semibold text-foreground">{name}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-border pt-4 text-[11px] text-muted-foreground">
          <Shield className="h-3.5 w-3.5 shrink-0 text-[#2AAA8A]" aria-hidden />
          <span>{HERO_PROOF_STAT}</span>
        </div>

        {phaseIndex >= 1 && planLoading && (
          <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#1A8FC4]">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
            Building your set…
          </p>
        )}
      </div>
    </div>
  );
}

function TipsPanel({
  tipSectionTitle,
  currentTip,
  tipIndex,
  tipSlides,
  onPrev,
  onNext,
  onSelect,
  reduceMotion,
  compact = false,
}) {
  const TipIcon = currentTip.icon;

  return (
    <section
      aria-label={tipSectionTitle}
      className={`flex flex-col rounded-2xl border border-border bg-white shadow-sm ${compact ? 'p-4' : 'sticky top-24 p-5'}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{tipSectionTitle}</h3>
        <span className="tabular-nums text-[11px] font-medium text-muted-foreground">
          {tipIndex + 1}/{tipSlides.length}
        </span>
      </div>

      <div className="relative min-h-[140px] flex-1 rounded-xl bg-secondary/50 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tipIndex}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: EASE_STANDARD }}
          >
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground shadow-sm">
              <TipIcon className="h-3 w-3 text-cta" aria-hidden />
              {currentTip.tag}
            </span>
            <h4 className="mt-3 text-base font-semibold leading-snug text-foreground">{currentTip.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{currentTip.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous tip"
          className="mm-focus flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground transition hover:bg-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 justify-center gap-1.5" role="tablist" aria-label="Tips">
          {tipSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === tipIndex}
              aria-label={`Tip ${i + 1}`}
              onClick={() => onSelect(i)}
              className={`h-2 rounded-full transition-all ${
                i === tipIndex ? 'w-5 bg-cta' : 'w-2 bg-border hover:bg-cta/40'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next tip"
          className="mm-focus flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground transition hover:bg-secondary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function BuildProgressPanel({ planLoading, reduceMotion }) {
  const [pct, setPct] = useState(10);
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    if (!planLoading) {
      setPct(100);
      setStageIdx(BUILD_STAGES.length - 1);
      return undefined;
    }
    setPct(10);
    setStageIdx(0);
    const id = window.setInterval(() => {
      setPct((p) => (p >= 94 ? 94 : p + 4 + Math.random() * 6));
      setStageIdx((s) => Math.min(BUILD_STAGES.length - 1, s + (Math.random() > 0.65 ? 1 : 0)));
    }, 900);
    return () => window.clearInterval(id);
  }, [planLoading]);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Building your question set</span>
          <span className="tabular-nums text-sm font-semibold text-foreground">{Math.round(pct)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-[#1A8FC4]"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: EASE_STANDARD }}
          />
        </div>
      </div>

      <ul className="space-y-3" aria-live="polite">
        {BUILD_STAGES.map((label, i) => {
          const done = i < stageIdx || (!planLoading && pct >= 100);
          const active = i === stageIdx && planLoading;
          return (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  done ? 'bg-emerald-100 text-emerald-700' : active ? 'bg-accent-soft text-[#1A8FC4]' : 'bg-surface-muted text-muted-foreground'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                ) : active && !reduceMotion ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                )}
              </span>
              <span className={done || active ? 'font-medium text-foreground' : 'text-muted-foreground'}>{label}</span>
            </li>
          );
        })}
      </ul>

      <p className="text-center text-xs text-muted-foreground">
        This usually takes under a minute. Tips on the right update while you wait.
      </p>
    </div>
  );
}

function FieldWithIcon({ id, label, icon: Icon, error, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-foreground">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function PrepLoungeSlideFlow({
  planLoading,
  ready,
  error,
  qCount,
  profile,
  setProfile,
  validationErrors = {},
  setValidationErrors,
  isPro,
  mode,
  isSkillMode,
  onStartTest,
  onRetry,
  onBackEdit,
}) {
  const reduceMotion = useReducedMotion();
  const statusId = useId();
  const modeLabel = getModeLabel(mode, isSkillMode);
  const tipSectionTitle = getTipSectionTitle(mode, isSkillMode);
  const tipSlides = useMemo(() => getWaitingTipSlides(mode, isSkillMode, isPro), [mode, isSkillMode, isPro]);

  const hasRequiredDetails = isPro
    ? Boolean(profile?.email?.trim() && profile?.contactNumber?.trim())
    : Boolean(profile?.email?.trim() && profile?.contactNumber?.trim() && profile?.collegeName?.trim());

  const [phase, setPhase] = useState(() => {
    if (error) return 'error';
    if (ready) return 'ready';
    return hasRequiredDetails ? 'generating' : 'details';
  });
  const [tipIndex, setTipIndex] = useState(0);

  const validateDetails = useCallback(() => {
    const nextErrors = {};
    const email = String(profile?.email ?? '').trim();
    const phone = String(profile?.contactNumber ?? '').trim();
    const college = String(profile?.collegeName ?? '').trim();
    if (!email) nextErrors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email';
    if (!phone) nextErrors.phone = 'Required';
    else if (!/^\d{10}$/.test(phone)) nextErrors.phone = '10-digit number required';
    if (!isPro && !college) nextErrors.collegeName = 'Required';
    setValidationErrors?.(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [profile, isPro, setValidationErrors]);

  useEffect(() => {
    if (error) setPhase('error');
    else if (ready && phase !== 'details') setPhase('ready');
  }, [ready, error, phase]);

  useEffect(() => {
    if (phase !== 'details' && phase !== 'generating') return undefined;
    if (phase === 'generating' && !planLoading) return undefined;
    const id = window.setInterval(() => setTipIndex((i) => (i + 1) % tipSlides.length), 8000);
    return () => window.clearInterval(id);
  }, [phase, planLoading, tipSlides.length]);

  const tipPrev = () => setTipIndex((i) => (i - 1 + tipSlides.length) % tipSlides.length);
  const tipNext = () => setTipIndex((i) => (i + 1) % tipSlides.length);

  const goToGenerating = () => {
    if (!validateDetails()) return;
    setPhase(ready ? 'ready' : 'generating');
  };

  const handleStartTest = () => {
    if (!validateDetails()) {
      setPhase('details');
      return;
    }
    onStartTest?.();
  };

  const currentTip = tipSlides[tipIndex % tipSlides.length];
  const phaseIndex = phase === 'error' ? -1 : phase === 'details' ? 0 : phase === 'generating' ? 1 : 2;
  const showTips = phase === 'details' || phase === 'generating';

  const headlines = {
    details: { title: 'Save your results', sub: 'We’ll email your score and gaps. Your questions are being prepared in parallel.' },
    generating: { title: 'Preparing your questions', sub: `Personalising your ${READINESS_CHECK_PRODUCT_NOUN} from your profile.` },
    ready: { title: 'You’re ready to begin', sub: `${qCount} questions tailored to you · ~5 min` },
    error: { title: 'Couldn’t prepare your check', sub: 'Please try again or edit your answers.' },
  };
  const copy = headlines[phase] || headlines.details;

  const tipsPanelProps = {
    tipSectionTitle,
    currentTip,
    tipIndex,
    tipSlides,
    onPrev: tipPrev,
    onNext: tipNext,
    onSelect: setTipIndex,
    reduceMotion,
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-gradient-to-b from-secondary/60 via-background to-background mm-site-theme">
      <div className="mm-container py-6 lg:py-10">
        {/* Page header — clear hierarchy */}
        <header className="mb-6 lg:mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
              {modeLabel}
            </span>
            <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {HERO_PROOF_STAT}
            </span>
          </div>
          <h1 className="mt-3 text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-left lg:text-[2rem]">
            {copy.title}
          </h1>
          <p id={statusId} className="mt-2 text-center text-sm text-muted-foreground lg:text-left" aria-live="polite">
            {copy.sub}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <aside className="hidden lg:col-span-3 lg:block">
            <PlacementInspirationPanel reduceMotion={reduceMotion} phaseIndex={phaseIndex} planLoading={planLoading} />
          </aside>

          <div className="lg:col-span-6">
            {/* Mobile companies */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-hidden>
              {PLACEMENT_COMPANIES.map((name) => (
                <span key={name} className="shrink-0 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground">
                  {name}
                </span>
              ))}
            </div>

            {phase !== 'error' && <LinearStepper phaseIndex={phaseIndex} reduceMotion={reduceMotion} />}

            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)]">
              <AnimatePresence mode="wait">
                {phase === 'details' && (
                  <motion.div
                    key="details"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="p-6 sm:p-8"
                  >
                    <div className="space-y-5">
                      <FieldWithIcon id="slide-email" label="Email" icon={Mail} error={validationErrors?.email}>
                        <input
                          id="slide-email"
                          type="email"
                          autoComplete="email"
                          aria-invalid={!!validationErrors?.email}
                          aria-describedby={validationErrors?.email ? 'slide-email-error' : undefined}
                          value={profile?.email ?? ''}
                          onChange={(e) => {
                            setProfile((p) => ({ ...p, email: e.target.value }));
                            setValidationErrors?.((prev) => (prev.email ? { ...prev, email: '' } : prev));
                          }}
                          className={validationErrors?.email ? MM_FIELD_INVALID : MM_FIELD_VALID}
                          placeholder="you@example.com"
                        />
                      </FieldWithIcon>

                      <FieldWithIcon id="slide-phone" label="Phone" icon={Phone} error={validationErrors?.phone}>
                        <input
                          id="slide-phone"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          aria-invalid={!!validationErrors?.phone}
                          value={profile?.contactNumber ?? ''}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setProfile((p) => ({ ...p, contactNumber: digits }));
                            setValidationErrors?.((prev) => (prev.phone ? { ...prev, phone: '' } : prev));
                          }}
                          className={validationErrors?.phone ? MM_FIELD_INVALID : MM_FIELD_VALID}
                          placeholder="10-digit mobile"
                        />
                      </FieldWithIcon>

                      {!isPro && (
                        <FieldWithIcon id="slide-college" label="College" icon={Building2} error={validationErrors?.collegeName}>
                          <input
                            id="slide-college"
                            type="text"
                            autoComplete="organization"
                            value={profile?.collegeName ?? ''}
                            onChange={(e) => {
                              setProfile((p) => ({ ...p, collegeName: e.target.value }));
                              setValidationErrors?.((prev) => (prev.collegeName ? { ...prev, collegeName: '' } : prev));
                            }}
                            className={validationErrors?.collegeName ? MM_FIELD_INVALID : MM_FIELD_VALID}
                            placeholder="University name"
                          />
                        </FieldWithIcon>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={goToGenerating}
                      className="mm-focus mt-8 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-cta text-sm font-semibold text-white shadow-md transition hover:bg-cta-hover active:scale-[0.99]"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </button>
                  </motion.div>
                )}

                {phase === 'generating' && (
                  <motion.div
                    key="generating"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    className="p-6 sm:p-8"
                  >
                    <BuildProgressPanel planLoading={planLoading} reduceMotion={reduceMotion} />
                  </motion.div>
                )}

                {phase === 'ready' && (
                  <motion.div
                    key="ready"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center px-6 py-10 text-center sm:px-10 sm:py-12"
                  >
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="h-9 w-9" strokeWidth={2.5} aria-hidden />
                    </div>
                    <p className="text-3xl font-bold tabular-nums text-foreground">{qCount}</p>
                    <p className="mt-1 text-sm text-muted-foreground">personalised questions ready</p>
                    <button
                      type="button"
                      onClick={handleStartTest}
                      className="mm-focus mt-8 flex min-h-[52px] w-full max-w-md items-center justify-center gap-2 rounded-xl bg-cta px-6 text-base font-semibold text-white shadow-lg transition hover:bg-cta-hover active:scale-[0.99]"
                    >
                      Appear for test
                      <ArrowRight className="h-5 w-5" aria-hidden />
                    </button>
                    <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      About 5 minutes · timer starts when you begin
                    </p>
                  </motion.div>
                )}

                {phase === 'error' && (
                  <motion.div key="error" className="flex flex-col items-center p-8 text-center">
                    <AlertCircle className="mb-4 h-12 w-12 text-red-600" aria-hidden />
                    <p className="text-sm text-red-700">{error}</p>
                    <button
                      type="button"
                      onClick={onRetry}
                      className="mm-focus mt-6 min-h-[44px] rounded-xl bg-cta px-6 text-sm font-semibold text-white hover:bg-cta-hover"
                    >
                      Try again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={onBackEdit}
              className="mm-focus mt-4 w-full py-2 text-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Edit assessment answers
            </button>
          </div>

          <aside className="hidden lg:col-span-3 lg:block">
            {showTips ? (
              <TipsPanel {...tipsPanelProps} />
            ) : (
              <div className="sticky top-24 rounded-2xl border border-border bg-white p-5 shadow-sm">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden />
                <p className="mt-3 text-sm font-semibold text-foreground">Ready when you are</p>
                <p className="mt-1 text-xs text-muted-foreground">Your set is personalised from your profile.</p>
              </div>
            )}
          </aside>
        </div>

        {showTips && (
          <div className="mt-6 lg:hidden">
            <TipsPanel {...tipsPanelProps} compact />
          </div>
        )}
      </div>
    </div>
  );
}
