import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Lock,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  FileText,
  Mic2,
  Calculator,
  FolderGit2,
  Bot,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import RoutePageShell from '../layout/RoutePageShell';
import { goToStartAssessment } from '../../utils/startAssessmentNavigation';
import {
  SNAP_QUESTIONS,
  SNAP_SCALE_OPTIONS,
  SNAP_STAGES,
  computeSnapScore,
  buildSnapResult,
} from '../../utils/snapReadinessScoring';
import {
  SNAP_TEST_EYEBROW,
  SNAP_TEST_HEADLINE,
  SNAP_TEST_SUB,
  SNAP_TEST_CTA_START,
  SNAP_TEST_TIMER_LABEL,
  SNAP_RESULT_EYEBROW,
  SNAP_RESULT_HEADLINE,
  SNAP_RESULT_SUB,
  SNAP_STAGE_LABEL,
  SNAP_SIGNALS_LABEL,
  SNAP_SIGNALS_SUFFIX,
  SNAP_LOCKED_SCORE_LABEL,
  SNAP_LOCKED_SCORE_HINT,
  SNAP_RESULT_GAP_HEADLINE,
  SNAP_RESULT_NO_GAP,
  SNAP_NEXT_STEPS_HEADLINE,
  SNAP_NEXT_STEPS_SUB,
  SNAP_RESULT_CTA_PRIMARY,
  SNAP_RESULT_CTA_SUB,
  SNAP_RESULT_MENTOR_LINE,
} from '../../constants/snapTestCopy';

const TONE_TEXT = {
  success: 'text-success',
  caution: 'text-cta',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-red-600 dark:text-red-400',
};

const TONE_DOT = {
  success: 'bg-success',
  caution: 'bg-[#1a8fc4]',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

const SNAP_PREVIEW_PILLS = [
  'Resume signal',
  'Real project',
  'AI tools',
  'Tech stack',
  'Mock pressure',
  'Aptitude depth',
];

const SNAP_NEXT_STEPS = [
  {
    id: 'ats',
    icon: FileText,
    title: 'ATS resume check',
    body: 'Fix keywords, project bullets, impact metrics, and formatting before applying.',
    relatedGaps: ['resume_ats'],
  },
  {
    id: 'mock',
    icon: Mic2,
    title: 'Mock interview reps',
    body: 'Practice HR + technical answers under pressure and get feedback on weak responses.',
    relatedGaps: ['mock_interview'],
  },
  {
    id: 'aptitude',
    icon: Calculator,
    title: 'Aptitude test prep',
    body: 'Cover quant, logical reasoning, verbal basics, speed, and accuracy for round one.',
    relatedGaps: ['aptitude_concepts'],
  },
  {
    id: 'project',
    icon: FolderGit2,
    title: 'Project deep dive',
    body: 'Prepare architecture, database, APIs, tradeoffs, edge cases, and your exact contribution.',
    relatedGaps: ['own_project', 'stack_ready'],
  },
  {
    id: 'ai',
    icon: Bot,
    title: 'AI + agentic GenAI tools',
    body: 'Use GPT, Claude, Cursor, and agents to debug, explain concepts, build faster, and rehearse.',
    relatedGaps: ['ai_tools'],
  },
];

const STEPS = { intro: 'intro', quiz: 'quiz', result: 'result' };

function useElapsedMs(active) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (!active) return undefined;
    startRef.current = performance.now();
    setElapsed(0);
    const id = window.setInterval(() => {
      setElapsed(Math.round(performance.now() - startRef.current));
    }, 50);
    return () => window.clearInterval(id);
  }, [active]);

  return elapsed;
}

function StageLadder({ stage }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex items-stretch gap-1.5">
      {SNAP_STAGES.map((s) => {
        const active = s.id === stage.id;
        const passed = s.order < stage.order;
        return (
          <div key={s.id} className="flex flex-1 flex-col items-center gap-1.5">
            <motion.div
              className={`h-2.5 w-full rounded-full ${
                active || passed ? TONE_DOT[stage.tone] : 'bg-border'
              }`}
              initial={reduceMotion ? false : { scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: s.order * 0.08, duration: 0.3 }}
            />
            <span
              className={`text-center text-[10px] font-semibold leading-tight sm:text-xs ${
                active ? TONE_TEXT[stage.tone] : 'text-muted-foreground/60'
              }`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function LockedScore() {
  return (
    <div className="mm-surface-panel relative overflow-hidden rounded-2xl border border-dashed border-cta/40 p-5 text-center">
      <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Lock size={14} aria-hidden />
        {SNAP_LOCKED_SCORE_LABEL}
      </div>
      <div className="relative mt-2 flex items-center justify-center">
        <span className="select-none text-5xl font-black tabular-nums text-foreground blur-[10px]">
          72
        </span>
        <span className="absolute text-5xl font-black text-cta">?</span>
        <span className="ml-1 self-end pb-1 text-lg font-bold text-muted-foreground">/ 100</span>
      </div>
      <p className="mt-1 text-xs font-medium text-cta">{SNAP_LOCKED_SCORE_HINT}</p>
    </div>
  );
}

function NextStepPlan({ gaps }) {
  const gapIds = new Set(gaps.map((gap) => gap.id));

  return (
    <div className="mt-6 text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Sparkles size={16} className="text-cta" aria-hidden />
            {SNAP_NEXT_STEPS_HEADLINE}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {SNAP_NEXT_STEPS_SUB}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3">
        {SNAP_NEXT_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isPriority = step.relatedGaps.some((id) => gapIds.has(id));

          return (
            <div
              key={step.id}
              className={`rounded-2xl border p-4 ${
                isPriority
                  ? 'border-cta/40 bg-cta/10'
                  : 'border-border bg-card/70'
              }`}
            >
              <div className="flex gap-3">
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isPriority ? 'bg-cta text-white' : 'bg-secondary text-foreground'
                  }`}
                >
                  <Icon size={18} aria-hidden />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-black text-foreground">
                      {index + 1}. {step.title}
                    </p>
                    {isPriority ? (
                      <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-cta">
                        Fix first
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YesNoChoices({ onPick, disabled }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onPick(true)}
        className="mm-choice-tile mm-choice-tile--yes-neutral flex min-h-[4.5rem] flex-col items-center justify-center gap-1 rounded-2xl px-4 py-4 text-lg font-bold transition active:scale-[0.97] disabled:opacity-60"
      >
        <span className="text-2xl" aria-hidden>✓</span>
        Yes
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onPick(false)}
        className="mm-choice-tile mm-choice-tile--no-neutral flex min-h-[4.5rem] flex-col items-center justify-center gap-1 rounded-2xl px-4 py-4 text-lg font-bold transition active:scale-[0.97] disabled:opacity-60"
      >
        <span className="text-2xl" aria-hidden>✗</span>
        No
      </button>
    </div>
  );
}

function ScaleChoices({ onPick, disabled }) {
  return (
    <div className="flex justify-between gap-1.5 sm:gap-2">
      {SNAP_SCALE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          title={opt.label}
          onClick={() => onPick(opt.value)}
          className="mm-choice-tile flex min-h-[4.25rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-2 text-center transition active:scale-[0.95] disabled:opacity-60"
        >
          <span className="text-2xl sm:text-3xl" aria-hidden>{opt.emoji}</span>
          <span className="hidden text-[10px] font-semibold text-muted-foreground sm:block">
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function SnapReadinessTest() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(STEPS.intro);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [locking, setLocking] = useState(false);
  const elapsed = useElapsedMs(step === STEPS.quiz);

  const currentQuestion = SNAP_QUESTIONS[questionIndex];
  const progress = step === STEPS.quiz ? (questionIndex + 1) / SNAP_QUESTIONS.length : 0;

  const result = useMemo(() => {
    if (step !== STEPS.result) return null;
    const score = computeSnapScore(answers);
    return buildSnapResult(score, answers);
  }, [step, answers]);

  const fireConfetti = useCallback(() => {
    if (reduceMotion) return;
    confetti({
      particleCount: 70,
      spread: 62,
      origin: { y: 0.72 },
      colors: ['#1a8fc4', '#2aaa8a', '#ff9500', '#ffffff'],
    });
  }, [reduceMotion]);

  useEffect(() => {
    if (step === STEPS.result && result && result.stage.order >= 3) {
      fireConfetti();
    }
  }, [step, result, fireConfetti]);

  const advance = useCallback(
    (value) => {
      if (locking || !currentQuestion) return;
      setLocking(true);

      const nextAnswers = { ...answers, [currentQuestion.id]: value };
      setAnswers(nextAnswers);

      const isLast = questionIndex >= SNAP_QUESTIONS.length - 1;

      window.setTimeout(() => {
        if (isLast) {
          setStep(STEPS.result);
        } else {
          setQuestionIndex((i) => i + 1);
        }
        setLocking(false);
      }, reduceMotion ? 80 : 180);
    },
    [locking, currentQuestion, answers, questionIndex, reduceMotion],
  );

  const startQuiz = () => {
    setAnswers({});
    setQuestionIndex(0);
    setStep(STEPS.quiz);
  };

  const elapsedSec = (elapsed / 1000).toFixed(1);

  return (
    <RoutePageShell scope="marketing" className="bg-background">
      <div className="mm-container mx-auto max-w-lg px-4 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {step === STEPS.intro && (
            <motion.div
              key="intro"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              className="text-center"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-wider text-cta">
                <Zap size={14} aria-hidden />
                {SNAP_TEST_EYEBROW}
              </div>

              <h1 className="text-balance text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                {SNAP_TEST_HEADLINE}
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                {SNAP_TEST_SUB}
              </p>

              <div className="mm-surface-panel mx-auto mt-8 max-w-sm rounded-3xl border border-border p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3 text-left">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-cta">
                      6-tap readiness radar
                    </p>
                    <p className="mt-1 text-sm font-medium leading-snug text-muted-foreground">
                      Quick signals only — no long form, no typing.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-cta/10 px-3 py-1 text-xs font-black text-cta">
                    ~5 sec
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {SNAP_PREVIEW_PILLS.map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-foreground"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={startQuiz}
                className="mm-btn-primary mm-btn-shimmer mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-bold text-white shadow-lg transition active:scale-[0.98]"
              >
                {SNAP_TEST_CTA_START}
                <ArrowRight size={18} aria-hidden />
              </button>
              <p className="mt-3 text-xs text-muted-foreground">{SNAP_TEST_TIMER_LABEL}</p>
            </motion.div>
          )}

          {step === STEPS.quiz && currentQuestion && (
            <motion.div
              key={`q-${currentQuestion.id}`}
              initial={reduceMotion ? false : { opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -28 }}
              transition={{ duration: 0.22 }}
            >
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>
                    {questionIndex + 1} / {SNAP_QUESTIONS.length}
                  </span>
                  <span className="tabular-nums text-cta">{elapsedSec}s</span>
                </div>
                <div className="mm-progress-track h-2 overflow-hidden rounded-full">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#1a8fc4] to-[#2aaa8a]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.25 }}
                  />
                </div>
              </div>

              <div className="mm-surface-panel rounded-3xl border border-border p-6 shadow-md sm:p-8">
                <p className="text-center text-xl font-bold leading-snug text-foreground sm:text-2xl">
                  {currentQuestion.label}
                </p>
                {currentQuestion.hint ? (
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    {currentQuestion.hint}
                  </p>
                ) : null}

                <div className="mt-8">
                  {currentQuestion.type === 'yes_no' ? (
                    <YesNoChoices onPick={advance} disabled={locking} />
                  ) : (
                    <ScaleChoices onPick={advance} disabled={locking} />
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === STEPS.result && result && (
            <motion.div
              key="result"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cta/30 bg-cta/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cta">
                <Sparkles size={13} aria-hidden />
                {SNAP_RESULT_EYEBROW}
              </div>
              <h1 className="text-balance text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl">
                {SNAP_RESULT_HEADLINE}
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                {SNAP_RESULT_SUB}
              </p>

              <div className="mm-surface-panel mt-6 rounded-3xl border border-border p-6 text-left shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {SNAP_STAGE_LABEL}
                </p>
                <p className={`mt-1 text-3xl font-black tracking-tight ${TONE_TEXT[result.stage.tone]}`}>
                  {result.stage.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-foreground">
                  {result.stage.tagline}
                </p>

                <div className="mt-5">
                  <StageLadder stage={result.stage} />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="mm-surface-panel flex flex-col justify-center rounded-2xl border border-border p-4 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <CheckCircle2 size={14} aria-hidden />
                    {SNAP_SIGNALS_LABEL}
                  </div>
                  <p className="mt-2 text-2xl font-black text-foreground">
                    <span className={TONE_TEXT[result.stage.tone]}>{result.signalsReady}</span>
                    <span className="text-lg text-muted-foreground"> / {result.totalSignals}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{SNAP_SIGNALS_SUFFIX}</p>
                </div>

                <LockedScore />
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-left">
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {result.stage.peerLine}
                </p>
              </div>

              {result.gaps.length > 0 ? (
                <div className="mt-6 text-left">
                  <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <TrendingUp size={16} className="text-cta" aria-hidden />
                    {SNAP_RESULT_GAP_HEADLINE}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.gaps.map((gap) => (
                      <span
                        key={gap.id}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          gap.severity === 'high'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200'
                        }`}
                      >
                        {gap.label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-success">
                  <Sparkles size={16} aria-hidden />
                  {SNAP_RESULT_NO_GAP}
                </p>
              )}

              <NextStepPlan gaps={result.gaps} />

              <div className="mt-8 rounded-2xl border border-cta/30 bg-gradient-to-br from-[#1a8fc4]/8 to-[#2aaa8a]/8 p-5">
                <p className="text-sm leading-relaxed text-foreground">{SNAP_RESULT_MENTOR_LINE}</p>
              </div>

              <button
                type="button"
                onClick={goToStartAssessment}
                className="mm-btn-primary mm-btn-shimmer mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-bold text-white shadow-lg transition active:scale-[0.98] sm:w-auto"
              >
                {SNAP_RESULT_CTA_PRIMARY}
                <ArrowRight size={18} aria-hidden />
              </button>
              <p className="mt-2 text-xs text-muted-foreground">{SNAP_RESULT_CTA_SUB}</p>

              <button
                type="button"
                onClick={startQuiz}
                className="mt-4 text-sm font-semibold text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Retake snap test
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RoutePageShell>
  );
}
