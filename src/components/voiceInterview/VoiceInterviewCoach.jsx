import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  PhoneOff,
  Play,
  ArrowRight,
  Sparkles,
  Building2,
  NotebookPen,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Volume2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { analyzeVoiceInterview, messageForHttpStatus } from './voiceInterviewApi';
import { useRealtimeVoiceSession } from './useRealtimeVoiceSession';
import {
  clockCueText,
  DEFAULT_DURATION_MINUTES,
  normalizeTimebox,
  resolveDurationMinutes,
} from './interviewTimebox';
import { useToolSession } from '../../widgets/ToolSessionContext';
import { getToolMeta } from '../../widgets/catalog';
import { hostBackLabel, hostSaveStatusMessage, showHostChrome } from '../../widgets/hostCopy';
import ToolChrome from '../../widgets/ToolChrome';
import './voice-interview.css';

const MODES = [
  {
    id: 'live',
    label: 'Full live interview',
    focus: 'Live technical interview',
    blurb: 'Mixed technical + communication — like a real drive round',
  },
  {
    id: 'skill',
    label: 'Skill round',
    focus: null,
    blurb: 'Deep dive on one skill — any stack you name',
  },
  {
    id: 'projects',
    label: 'Project interview',
    focus: 'projects only',
    blurb: 'Walk through your projects, decisions, and trade-offs',
  },
  {
    id: 'hr',
    label: 'HR behavioral',
    focus: 'HR behavioral',
    blurb: 'TCS / Infosys / Persistent / Impetus-style HR — intro, STAR, flexibility, joining',
  },
];

const SKILL_PRESETS = [
  { id: 'java', label: 'Java', focus: 'Java' },
  { id: 'cpp', label: 'C++', focus: 'C++' },
  { id: 'dotnet', label: '.NET', focus: '.NET' },
  { id: 'sql', label: 'SQL', focus: 'SQL' },
  { id: 'custom', label: 'Custom skill', focus: null },
];

const SCREENS = {
  SETUP: 'setup',
  LIVE: 'live',
  RESULTS: 'results',
};

const ease = [0.22, 1, 0.36, 1];

function clampScore(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreBand(score) {
  if (score >= 80) {
    return {
      label: 'Drive-ready signal',
      tip: 'Strong base — polish articulation and edge-case depth.',
    };
  }
  if (score >= 60) {
    return {
      label: 'Promising — keep sharpening',
      tip: 'Close a few focused gaps and you’ll sound much more hiring-ready.',
    };
  }
  if (score >= 40) {
    return {
      label: 'Building — clear next steps',
      tip: 'Use the study plan below; short daily reps beat cramming.',
    };
  }
  return {
    label: 'Early stage — good you practiced',
    tip: 'Treat this as a baseline. Follow the plan and run another round soon.',
  };
}

function prettyFocusLabel(raw) {
  if (!raw) return 'Your round';
  const s = String(raw).trim();
  if (/^projects?\s*only$/i.test(s)) return 'Project interview';
  if (/live technical/i.test(s)) return 'Full live interview';
  if (/\bhr\b|behavioral|behavioural/i.test(s)) return 'HR round';
  return s;
}

function ScoreBar({ label, value, accent = 'primary' }) {
  const safe = clampScore(value);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="mm-voice-num text-sm text-foreground">
          {safe}
          <span className="font-medium text-muted-foreground"> / 100</span>
        </span>
      </div>
      <div className="mm-voice-meter">
        <motion.div
          className={`mm-voice-meter__fill ${accent === 'teal' ? 'mm-voice-meter__fill--teal' : ''}`}
          initial={{ width: 0 }}
          animate={{ width: `${safe}%` }}
          transition={{ duration: 0.85, ease }}
        />
      </div>
    </div>
  );
}

function StatusMark({ status, agentSpeaking, userSpeaking, analyzing }) {
  let label = 'Ready';
  let tone = '';

  if (analyzing || status === 'ending') {
    label = 'Scoring your round…';
    tone = 'is-busy';
  } else if (status === 'connecting') {
    label = 'Connecting…';
    tone = 'is-busy';
  } else if (status === 'error') {
    label = 'Connection issue';
    tone = 'is-warn';
  } else if (status === 'muted') {
    label = 'Paused';
    tone = 'is-warn';
  } else if (status === 'live' && agentSpeaking) {
    label = 'Coach speaking';
    tone = 'is-speak';
  } else if (status === 'live' && userSpeaking) {
    label = 'Listening to you';
    tone = 'is-listen';
  } else if (status === 'live') {
    label = 'Live';
    tone = 'is-live';
  }

  return <span className={`mm-voice-status ${tone}`}>{label}</span>;
}

function formatElapsed(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function VoiceInterviewCoach() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = useToolSession();
  const roadmapQuery = session;

  const requestedMode = (() => {
    const fromSession = session.mode;
    const m = fromSession || searchParams.get('mode');
    return m === 'skill' || m === 'projects' || m === 'live' || m === 'hr' ? m : null;
  })();
  const initialMode = requestedMode || 'live';
  // Host / portal launches map 1:1 to a round, so the round must not be switchable here.
  const modeLocked = (roadmapQuery.fromHost || roadmapQuery.fromPortal) && Boolean(requestedMode);
  const skillFromQuery = (session.skill || searchParams.get('skill') || '').trim().toLowerCase();
  const initialSkill =
    skillFromQuery && SKILL_PRESETS.some((s) => s.id === skillFromQuery)
      ? skillFromQuery
      : skillFromQuery
        ? 'custom'
        : 'java';
  const [practiceNotice, setPracticeNotice] = useState('');

  useEffect(() => {
    if (!roadmapQuery.fromPractice) return undefined;
    const gate = session.guardPractice(roadmapQuery.toolCode);
    if (!gate.blocked) return undefined;
    setPracticeNotice(gate.message);
    const t = window.setTimeout(() => session.returnHome(), 1600);
    return () => window.clearTimeout(t);
  }, [roadmapQuery.fromPractice, roadmapQuery.toolCode, session]);

  const [screen, setScreen] = useState(SCREENS.SETUP);
  const [modeId, setModeId] = useState(initialMode);
  const [skillId, setSkillId] = useState(initialSkill);
  const [customSkill, setCustomSkill] = useState(
    initialSkill === 'custom' && skillFromQuery && !SKILL_PRESETS.some((s) => s.id === skillFromQuery)
      ? skillFromQuery
      : ''
  );
  const [targetRole, setTargetRole] = useState('');
  const [targetCompanies, setTargetCompanies] = useState('');
  const [extraContext, setExtraContext] = useState('');
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [starting, setStarting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [uiError, setUiError] = useState(null);
  const [pendingTranscript, setPendingTranscript] = useState(null);
  const [focusLabel, setFocusLabel] = useState(
    MODES.find((m) => m.id === initialMode)?.label || 'Full live interview'
  );
  const [interviewFocus, setInterviewFocus] = useState(
    MODES.find((m) => m.id === initialMode)?.focus || 'Live technical interview'
  );
  const [elapsed, setElapsed] = useState(0);
  const [roundDurationMin, setRoundDurationMin] = useState(DEFAULT_DURATION_MINUTES);
  const [roadmapSave, setRoadmapSave] = useState({ status: 'idle', message: '' });
  const roadmapPayloadRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const endingRef = useRef(false);
  const liveStartedAtRef = useRef(null);
  const composeRef = useRef(null);
  const durationSecRef = useRef(DEFAULT_DURATION_MINUTES * 60);
  const timeboxRef = useRef(normalizeTimebox(null, DEFAULT_DURATION_MINUTES));
  const cueStateRef = useRef({
    wrap: false,
    close: false,
    nudge: false,
    noAnswerClose: false,
    lastTickMin: 0,
    forceEndAt: null,
  });
  const lastUserAtRef = useRef(0);
  const lastAssistantDoneAtRef = useRef(0);
  const prevAgentSpeakingRef = useRef(false);
  const agentSpeakingRef = useRef(false);
  const userSpeakingRef = useRef(false);
  const finishAndScoreRef = useRef(null);

  const {
    status,
    error: sessionError,
    transcript,
    agentSpeaking,
    userSpeaking,
    needsAudioUnlock,
    unlockAudio,
    startSession,
    stopMic,
    resumeMic,
    endSession,
    reset,
    injectClockCue,
  } = useRealtimeVoiceSession();

  const displayError = uiError || sessionError;

  const plannedDurationMin = resolveDurationMinutes({
    minutes: searchParams.get('minutes'),
    toolMinutes: getToolMeta(session.toolCode)?.minutes,
    modeId,
  });

  const resolveFocus = () => {
    const mode = MODES.find((m) => m.id === modeId) ?? MODES[0];
    if (mode.id === 'live' || mode.id === 'projects' || mode.id === 'hr') {
      return { focus: mode.focus, label: mode.label };
    }
    if (skillId === 'custom') {
      const skill = customSkill.trim();
      return {
        focus: skill || 'General technical skills',
        label: skill ? `Skill · ${skill}` : 'Skill round',
      };
    }
    const preset = SKILL_PRESETS.find((s) => s.id === skillId) ?? SKILL_PRESETS[0];
    return { focus: preset.focus, label: `Skill · ${preset.label}` };
  };

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript.length]);

  useEffect(() => {
    agentSpeakingRef.current = agentSpeaking;
    const wasSpeaking = prevAgentSpeakingRef.current;
    prevAgentSpeakingRef.current = agentSpeaking;
    if (wasSpeaking && !agentSpeaking) {
      lastAssistantDoneAtRef.current = Date.now();
    }
  }, [agentSpeaking]);

  useEffect(() => {
    userSpeakingRef.current = userSpeaking;
    if (!userSpeaking) return;
    lastUserAtRef.current = Date.now();
    const cues = cueStateRef.current;
    if (!cues.close && !cues.noAnswerClose) {
      cues.nudge = false;
    }
  }, [userSpeaking]);

  useEffect(() => {
    if (screen !== SCREENS.LIVE || analyzing) return undefined;
    liveStartedAtRef.current = Date.now();
    setElapsed(0);
    const id = setInterval(() => {
      if (!liveStartedAtRef.current) return;
      setElapsed(Math.floor((Date.now() - liveStartedAtRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [screen, analyzing]);

  useEffect(() => {
    if (screen !== SCREENS.LIVE || analyzing) return undefined;
    const id = window.setInterval(() => {
      if (endingRef.current) return;
      if (status !== 'live' && status !== 'muted') return;
      const started = liveStartedAtRef.current;
      if (!started) return;
      const now = Date.now();
      const elapsedSec = (now - started) / 1000;
      const durationSec = durationSecRef.current;
      const remaining = durationSec - elapsedSec;
      const tb = timeboxRef.current;
      const cues = cueStateRef.current;

      const sendCue = (kind, createResponse) => {
        if (agentSpeakingRef.current) return false;
        if (createResponse && userSpeakingRef.current) return false;
        return injectClockCue(
          clockCueText(kind, {
            elapsedSec,
            durationSec,
            roundKind: modeId === 'hr' ? 'hr' : 'technical',
          }),
          { createResponse }
        );
      };

      if (remaining <= tb.wrap_up_remaining_seconds && !cues.wrap) {
        if (sendCue('wrap', true)) cues.wrap = true;
      }
      if (remaining <= 20 && !cues.close) {
        if (sendCue('close', true)) {
          cues.close = true;
          cues.forceEndAt = now + 18000;
        }
      }
      if (cues.forceEndAt && now >= cues.forceEndAt && !agentSpeakingRef.current) {
        finishAndScoreRef.current?.();
        return;
      }
      if (remaining <= -25 && !agentSpeakingRef.current) {
        finishAndScoreRef.current?.();
        return;
      }

      const elapsedMin = Math.floor(elapsedSec / 60);
      if (!cues.wrap && elapsedMin > 0 && elapsedMin !== cues.lastTickMin) {
        cues.lastTickMin = elapsedMin;
        sendCue('tick', false);
      }

      if (status === 'muted') return;
      if (cues.wrap || cues.close || cues.noAnswerClose) return;
      const assistantDone = lastAssistantDoneAtRef.current;
      if (!assistantDone || agentSpeakingRef.current) return;
      if (lastUserAtRef.current >= assistantDone) return;
      const silentSec = (now - assistantDone) / 1000;
      if (silentSec >= tb.no_answer_nudge_seconds && !cues.nudge) {
        if (sendCue('nudge', true)) cues.nudge = true;
      }
      if (silentSec >= tb.no_answer_close_seconds && !cues.noAnswerClose) {
        if (sendCue('no_answer_close', true)) {
          cues.noAnswerClose = true;
          cues.forceEndAt = now + 18000;
        }
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [screen, analyzing, status, injectClockCue, modeId]);

  const runAnalyze = async (turns, focus) => {
    const analysis = await analyzeVoiceInterview({
      interview_focus: focus,
      transcript: turns,
      ...(targetRole.trim() ? { target_role: targetRole.trim() } : {}),
      ...(targetCompanies.trim() ? { target_companies: targetCompanies.trim() } : {}),
    });
    setResults(analysis);
    setPendingTranscript(null);
    setScreen(SCREENS.RESULTS);

    const shouldPersist =
      roadmapQuery.fromPortal ||
      roadmapQuery.source === 'embed' ||
      roadmapQuery.lockMode !== 'none';
    if (shouldPersist && roadmapQuery.source !== 'standalone') {
      const overall = Math.round(
        analysis.overall_score ??
          ((analysis.technical_score ?? 0) + (analysis.communication_score ?? 0)) / 2
      );
      const modeToTool = {
        skill: 'skill_mock',
        projects: 'project_mock',
        live: 'interview_mock',
        hr: 'hr_mock',
      };
      const toolCode = roadmapQuery.toolCode || modeToTool[modeId] || 'interview_mock';
      roadmapPayloadRef.current = {
        toolCode,
        result: {
          score: overall,
          label: scoreBand(overall).label,
          technical_score: analysis.technical_score,
          communication_score: analysis.communication_score,
          strengths: analysis.strengths || [],
          weaknesses: analysis.weaknesses || [],
          recommendations: analysis.study_plan || [],
          raw: analysis,
        },
      };
      await saveToRoadmap();
    }
  };
  const saveToRoadmap = async () => {
    const payload = roadmapPayloadRef.current;
    if (!payload) return;
    setRoadmapSave({ status: 'saving', message: '' });
    const outcome = await session.persistResult(payload);
    if (outcome.status === 'idle') {
      setRoadmapSave({ status: 'idle', message: '' });
      return;
    }
    setRoadmapSave(
      outcome.ok
        ? { status: 'saved', message: outcome.message || '' }
        : { status: 'error', message: outcome.message || 'Could not save result.' }
    );
  };

  const handleStart = async () => {
    setUiError(null);
    setResults(null);
    setPendingTranscript(null);
    setConfirmEnd(false);

    if (roadmapQuery.fromPractice) {
      const gate = session.guardPractice(roadmapQuery.toolCode);
      if (gate.blocked) {
        setPracticeNotice(gate.message);
        session.returnHome();
        return;
      }
    }

    const resolved = resolveFocus();
    if (modeId === 'skill' && skillId === 'custom' && !customSkill.trim()) {
      setUiError('Enter a skill or topic — e.g. OS, DBMS, React, System Design.');
      return;
    }

    setInterviewFocus(resolved.focus);
    setFocusLabel(resolved.label);
    setStarting(true);
    const durationMinutes = plannedDurationMin;
    setRoundDurationMin(durationMinutes);
    durationSecRef.current = durationMinutes * 60;
    timeboxRef.current = normalizeTimebox(null, durationMinutes);
    cueStateRef.current = {
      wrap: false,
      close: false,
      nudge: false,
      noAnswerClose: false,
      lastTickMin: 0,
      forceEndAt: null,
    };
    lastUserAtRef.current = 0;
    lastAssistantDoneAtRef.current = 0;
    try {
      const liveSession = await startSession({
        interview_focus: resolved.focus,
        target_role: targetRole.trim() || undefined,
        target_companies: targetCompanies.trim() || undefined,
        extra_context: extraContext.trim() || undefined,
        duration_minutes: durationMinutes,
      });
      if (liveSession?.duration_minutes) {
        setRoundDurationMin(liveSession.duration_minutes);
        durationSecRef.current = liveSession.duration_minutes * 60;
      }
      if (liveSession?.timebox) {
        timeboxRef.current = normalizeTimebox(
          liveSession.timebox,
          liveSession.duration_minutes || durationMinutes
        );
      }
      setScreen(SCREENS.LIVE);
      setShowTranscript(false);
    } catch (err) {
      setUiError(messageForHttpStatus(err?.status, err?.message) || 'Could not start. Try again.');
    } finally {
      setStarting(false);
    }
  };

  const handleEndConfirmed = async () => {
    if (endingRef.current) return;
    endingRef.current = true;
    setConfirmEnd(false);
    setUiError(null);
    setAnalyzing(true);
    try {
      const turns = await endSession();
      if (!turns.length) {
        setUiError(
          'No conversation was captured. Start again and speak for a few turns. If this keeps happening, transcription may be unavailable.'
        );
        setScreen(SCREENS.SETUP);
        return;
      }

      setPendingTranscript(turns);
      await runAnalyze(turns, interviewFocus);
    } catch (err) {
      setUiError(
        messageForHttpStatus(err?.status, err?.message) ||
          'Analysis failed. Your transcript is saved — retry scoring below.'
      );
      setScreen(SCREENS.SETUP);
    } finally {
      setAnalyzing(false);
      endingRef.current = false;
    }
  };
  finishAndScoreRef.current = handleEndConfirmed;

  const handleRetryAnalyze = async () => {
    if (!pendingTranscript?.length || endingRef.current) return;
    endingRef.current = true;
    setUiError(null);
    setAnalyzing(true);
    try {
      await runAnalyze(pendingTranscript, interviewFocus);
    } catch (err) {
      setUiError(messageForHttpStatus(err?.status, err?.message) || 'Analysis failed. Try again.');
    } finally {
      setAnalyzing(false);
      endingRef.current = false;
    }
  };

  const handlePracticeAgain = () => {
    reset();
    setResults(null);
    setPendingTranscript(null);
    setUiError(null);
    setConfirmEnd(false);
    setScreen(SCREENS.SETUP);
  };

  const scrollToCompose = () => {
    composeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <ToolChrome scope="tool" className="mm-voice-page pb-20">
      <AnimatePresence mode="wait">
        {screen === SCREENS.SETUP && (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease }}
          >
            <section className="mm-voice-stage mm-marketing-hero-backdrop">
              <div className="mm-hero-mesh" aria-hidden />
              <div className="mm-voice-stage__beam" aria-hidden />
              <div className="mm-voice-stage__grid" aria-hidden />
              <div className="mm-voice-stage__visual" aria-hidden />

              <div className="mm-container mm-voice-stage__inner">
                <div className="mm-voice-rail">
                  <motion.h1
                    className="mm-voice-stage__product"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease, delay: 0.05 }}
                  >
                    Placement Coach
                  </motion.h1>

                  <motion.p
                    className="mm-voice-stage__lede"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease, delay: 0.14 }}
                  >
                    Speak like the offer depends on it — live technical, skill, and project rounds scored
                    before your next campus drive.
                  </motion.p>

                  <motion.div
                    className="mm-voice-stage__cta"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease, delay: 0.22 }}
                  >
                    <button type="button" onClick={scrollToCompose} className="mm-voice-btn-primary">
                      <Play size={17} fill="currentColor" /> Begin your round
                    </button>
                    <span className="mm-voice-btn-ghost">
                      Mic on · {plannedDurationMin} min timed round · natural close
                    </span>
                  </motion.div>
                </div>
              </div>
            </section>

            <section ref={composeRef} id="compose" className="mm-voice-compose">
              <div className="mm-container">
                <div className="mm-voice-rail">
                  {pendingTranscript?.length > 0 && (
                    <div className="mm-voice-alert mm-voice-alert--warn mb-6 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-2 text-sm">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                        <p>
                          {uiError || 'Scoring failed last time.'} Your transcript (
                          {pendingTranscript.length} turns) is still saved.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRetryAnalyze}
                        disabled={analyzing}
                        className="mm-voice-ctrl mm-voice-ctrl--secondary !px-4 !py-2.5 shrink-0"
                      >
                        {analyzing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                        Retry scoring
                      </button>
                    </div>
                  )}

                  <div className="mm-voice-compose__panel">
                    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="mm-voice-kicker">Compose</p>
                        <h2 className="mm-voice-compose__title mt-2">Choose your round</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {modeLocked
                          ? roadmapQuery.fromJourney
                            ? 'This round is set by your 90-day plan.'
                            : roadmapQuery.fromCompanyPrep
                              ? 'This round is set by Company Prep.'
                              : 'This round is set by your Week 1 plan.'
                          : 'One mode. Then start when ready.'}
                      </p>
                    </div>

                    <div className="mm-voice-mode">
                      {(modeLocked ? MODES.filter((m) => m.id === modeId) : MODES).map((mode) => {
                        const active = modeId === mode.id;
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setModeId(mode.id)}
                            disabled={modeLocked}
                            className={`mm-voice-mode__btn ${active ? 'is-active' : ''}`}
                          >
                            <p className="mm-voice-mode__label">{mode.label}</p>
                            <p className="mm-voice-mode__blurb">{mode.blurb}</p>
                          </button>
                        );
                      })}
                    </div>

                    {modeId === 'skill' && (
                      <div className="mt-6">
                        <p className="mm-voice-kicker mb-3">Skill or topic</p>
                        <div className="mm-voice-skill">
                          {SKILL_PRESETS.map((skill) => {
                            const active = skillId === skill.id;
                            return (
                              <button
                                key={skill.id}
                                type="button"
                                onClick={() => setSkillId(skill.id)}
                                aria-pressed={active}
                                className={`mm-voice-skill__btn ${active ? 'is-active' : ''}`}
                              >
                                {skill.label}
                              </button>
                            );
                          })}
                        </div>
                        {skillId === 'custom' && (
                          <input
                            value={customSkill}
                            onChange={(e) => setCustomSkill(e.target.value)}
                            maxLength={200}
                            placeholder="e.g. OS, DBMS, React, System Design, HR behavioral"
                            className="mm-voice-field mt-3"
                          />
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowPersonalize((v) => !v)}
                      className="mm-voice-linkish mt-7"
                    >
                      Personalize this round (optional)
                      {showPersonalize ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>

                    <AnimatePresence initial={false}>
                      {showPersonalize && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 space-y-4 border-t border-border pt-5">
                            <label className="block">
                              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                <Sparkles size={12} /> Target role
                              </span>
                              <input
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                maxLength={100}
                                placeholder="e.g. Graduate Engineer Trainee"
                                className="mm-voice-field"
                              />
                            </label>
                            <label className="block">
                              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                <Building2 size={12} /> Target companies
                              </span>
                              <input
                                value={targetCompanies}
                                onChange={(e) => setTargetCompanies(e.target.value)}
                                maxLength={300}
                                placeholder="e.g. TCS, Infosys, Persistent, Impetus"
                                className="mm-voice-field"
                              />
                            </label>
                            <label className="block">
                              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                <NotebookPen size={12} /> Extra context
                              </span>
                              <textarea
                                value={extraContext}
                                onChange={(e) => setExtraContext(e.target.value)}
                                maxLength={2000}
                                rows={3}
                                placeholder="Projects, weak areas, or what you want the coach to probe…"
                                className="mm-voice-field"
                              />
                            </label>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {displayError && !pendingTranscript?.length && (
                      <div className="mm-voice-alert mm-voice-alert--error mt-5">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                        <p>{displayError}</p>
                      </div>
                    )}

                    <div className="mt-7 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                        Allow mic access. Headphones help with turn-taking. This round is timed to{' '}
                        {plannedDurationMin} minutes — the interviewer will wrap up and close on time.
                      </p>
                      <button
                        type="button"
                        onClick={handleStart}
                        disabled={starting || analyzing}
                        className="mm-voice-btn-primary shrink-0"
                      >
                        {starting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" /> Connecting…
                          </>
                        ) : (
                          <>
                            <Play size={18} fill="currentColor" /> Start interview
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mm-voice-footstrip">
                    <div className="mm-voice-footstrip__item">
                      <span className="mm-voice-footstrip__n">01</span>
                      <p className="mm-voice-footstrip__t">Pick a mode</p>
                      <p className="mm-voice-footstrip__d">Live, any skill, or projects</p>
                    </div>
                    <div className="mm-voice-footstrip__item">
                      <span className="mm-voice-footstrip__n">02</span>
                      <p className="mm-voice-footstrip__t">Speak with the coach</p>
                      <p className="mm-voice-footstrip__d">Timed round · natural close</p>
                    </div>
                    <div className="mm-voice-footstrip__item">
                      <span className="mm-voice-footstrip__n">03</span>
                      <p className="mm-voice-footstrip__t">Get your plan</p>
                      <p className="mm-voice-footstrip__d">Scores, gaps, next steps</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {screen === SCREENS.LIVE && (
          <motion.div
            key="live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="mm-voice-live"
          >
            <div className="mm-container flex min-h-[calc(100vh-4rem)] flex-col py-8 md:py-10">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="mm-voice-kicker">{roundDurationMin} min round</p>
                  <h2 className="mm-voice-display mt-2 text-2xl text-foreground md:text-3xl">{focusLabel}</h2>
                </div>
                <div className="mm-voice-live__meta">
                  <span
                    className={`mm-voice-live__timer${
                      roundDurationMin * 60 - elapsed <= 120 ? ' is-low' : ''
                    }`}
                  >
                    {formatElapsed(Math.max(0, roundDurationMin * 60 - elapsed))} left
                  </span>
                  <StatusMark
                    status={status}
                    agentSpeaking={agentSpeaking}
                    userSpeaking={userSpeaking}
                    analyzing={analyzing}
                  />
                </div>
              </div>

              {needsAudioUnlock && (
                <button
                  type="button"
                  onClick={unlockAudio}
                  className="mm-voice-linkish mb-4 self-start rounded-lg border border-primary/30 bg-accent-soft px-4 py-2"
                >
                  <Volume2 size={15} /> Tap to hear the coach
                </button>
              )}

              {sessionError && status === 'error' && (
                <div className="mm-voice-alert mm-voice-alert--warn mb-4">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <p>{sessionError} You can still End & get scores on what was captured.</p>
                </div>
              )}

              <div className="grid flex-1 gap-5 lg:grid-cols-[1fr_300px] lg:items-stretch">
                <div className="mm-voice-live__frame">
                  <div
                    className={`mm-voice-orb ${
                      status === 'muted'
                        ? 'mm-voice-orb--muted'
                        : agentSpeaking
                          ? 'mm-voice-orb--speaking'
                          : userSpeaking
                            ? 'mm-voice-orb--listening'
                            : 'mm-voice-orb--idle'
                    }`}
                    aria-hidden
                  >
                    <div className={`mm-voice-wave ${!(agentSpeaking || userSpeaking) ? 'mm-voice-wave--idle' : ''}`}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} />
                      ))}
                    </div>
                  </div>

                  <p className="mm-voice-live__prompt">
                    {analyzing
                      ? 'Closing the call and building your scorecard…'
                      : status === 'muted'
                        ? 'Paused — resume when you are ready'
                        : agentSpeaking
                          ? 'Coach is speaking — listen carefully'
                          : userSpeaking
                            ? 'We hear you — keep going'
                            : roundDurationMin * 60 - elapsed <= 120
                              ? 'Wrapping up — last question, then a close'
                              : 'Your turn — answer clearly when ready'}
                  </p>

                  <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                    {status === 'muted' ? (
                      <button
                        type="button"
                        onClick={resumeMic}
                        disabled={analyzing}
                        className="mm-voice-ctrl mm-voice-ctrl--secondary"
                      >
                        <Mic size={17} aria-hidden /> Resume
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopMic}
                        disabled={analyzing || (status !== 'live' && status !== 'error')}
                        className="mm-voice-ctrl mm-voice-ctrl--secondary"
                      >
                        <MicOff size={17} aria-hidden /> Pause
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setConfirmEnd(true)}
                      disabled={analyzing || status === 'connecting'}
                      className="mm-voice-ctrl mm-voice-ctrl--danger"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 size={17} className="animate-spin" aria-hidden /> Scoring…
                        </>
                      ) : (
                        <>
                          <PhoneOff size={17} aria-hidden /> End & get scores
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mm-voice-transcript-pane">
                  <button
                    type="button"
                    onClick={() => setShowTranscript((v) => !v)}
                    className="mm-voice-transcript-pane__head lg:pointer-events-none"
                  >
                    <Volume2 size={14} className="text-primary" />
                    <h3 className="text-sm font-bold text-foreground">Transcript</h3>
                    <span className="mm-voice-num ml-auto text-xs text-muted-foreground">
                      {transcript.length}
                    </span>
                    <span className="lg:hidden">
                      {showTranscript ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </span>
                  </button>
                  <div
                    className={`mm-voice-transcript flex-1 space-y-3 overflow-y-auto px-4 py-4 ${
                      showTranscript ? 'block' : 'hidden lg:block'
                    }`}
                  >
                    {transcript.length === 0 ? (
                      <p className="py-10 text-center text-sm text-muted-foreground">
                        Transcript appears as you and the coach speak…
                      </p>
                    ) : (
                      transcript.map((turn, idx) => (
                        <motion.div
                          key={`${idx}-${turn.role}-${turn.text.slice(0, 12)}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mm-voice-turn ${
                            turn.role === 'assistant' ? 'mm-voice-turn--coach' : 'mm-voice-turn--you'
                          }`}
                        >
                          <p className="mm-voice-turn__who">
                            {turn.role === 'assistant' ? 'Coach' : 'You'}
                          </p>
                          {turn.text}
                        </motion.div>
                      ))
                    )}
                    <div ref={transcriptEndRef} />
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {confirmEnd && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mm-voice-overlay fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="end-confirm-title"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="mm-voice-panel w-full max-w-md shadow-xl"
                  >
                    <h3 id="end-confirm-title" className="mm-voice-panel__title">
                      End interview and get your study plan?
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We’ll stop the live call and score this session. You can’t resume the same call after
                      ending.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmEnd(false)}
                        className="mm-voice-ctrl mm-voice-ctrl--secondary !px-4 !py-2.5"
                      >
                        Keep going
                      </button>
                      <button
                        type="button"
                        onClick={handleEndConfirmed}
                        className="mm-voice-ctrl mm-voice-ctrl--danger !px-4 !py-2.5"
                      >
                        End & get scores
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {screen === SCREENS.RESULTS && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            {(() => {
              const overall = clampScore(
                results.overall_score ??
                  ((results.technical_score ?? 0) + (results.communication_score ?? 0)) / 2
              );
              const band = scoreBand(overall);
              const focusPretty = prettyFocusLabel(results.interview_focus || focusLabel);
              const isHrRound =
                modeId === 'hr' ||
                /\bhr\b|behavioral|behavioural/i.test(
                  String(results.interview_focus || interviewFocus || '')
                );
              return (
                <>
                  <section className="mm-voice-results-hero mm-marketing-hero-backdrop">
                    <div className="mm-hero-mesh" aria-hidden />
                    <div className="mm-container relative z-10 pb-10 pt-10 md:pt-12">
                      <p className="mm-voice-kicker">Round complete · {focusPretty}</p>
                      <div className="mt-6 grid items-end gap-8 md:grid-cols-[1fr_minmax(0,280px)] md:gap-12">
                        <div>
                          <motion.p
                            className="mm-voice-results-hero__score"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease }}
                          >
                            {overall}
                          </motion.p>
                          <p className="mm-voice-display mt-4 text-xl md:text-2xl">
                            {band.label}
                          </p>
                          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                            {band.tip}
                          </p>
                        </div>
                        <div className="space-y-6 pb-1">
                          <div>
                            <p className="mm-voice-kicker mb-4">Breakdown</p>
                            <div className="space-y-5">
                              <ScoreBar
                                label={isHrRound ? 'HR fit & substance' : 'Technical depth'}
                                value={results.technical_score}
                              />
                              <ScoreBar
                                label={isHrRound ? 'Spoken English & presence' : 'Communication'}
                                value={results.communication_score}
                                accent="teal"
                              />
                            </div>
                          </div>
                          <p className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                            Scores reflect this conversation only — not your full placement readiness. Re-run
                            after practicing the plan below.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="mm-container pt-8 pb-4">
                    <div className="mx-auto max-w-4xl space-y-5">
                      {practiceNotice ? (
                        <div className="mm-voice-panel text-sm font-medium text-amber-800 dark:text-amber-200">
                          {practiceNotice}
                        </div>
                      ) : null}

                      {(showHostChrome(roadmapQuery) && roadmapSave.status !== 'idle') ? (
                        <div className="mm-voice-panel flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm font-medium text-foreground">
                            {hostSaveStatusMessage(roadmapQuery, roadmapSave)}
                          </p>
                          {roadmapSave.status === 'error' && roadmapQuery.fromRoadmap ? (
                            <button
                              type="button"
                              onClick={saveToRoadmap}
                              className="mm-voice-ctrl mm-voice-ctrl--secondary !px-4 !py-2"
                            >
                              <RefreshCw size={14} /> Retry save
                            </button>
                          ) : null}
                        </div>
                      ) : null}

                      <ResultList
                        title="Your study plan"
                        subtitle="Do these next — short, focused reps beat vague revision."
                        tone="info"
                        items={results.study_plan}
                        empty={null}
                        numbered
                        featured
                      />

                      <div className="grid gap-5 md:grid-cols-2">
                        <ResultList title="What landed well" tone="success" items={results.strengths} empty={null} />
                        <ResultList title="Gaps to close" tone="warning" items={results.weaknesses} empty={null} />
                      </div>

                      <div className="mm-voice-panel flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                          {roadmapQuery.fromPractice
                            ? 'This practice is locked until tomorrow. Pick another tool or come back then.'
                            : showHostChrome(roadmapQuery)
                              ? 'Review your feedback, then return to the student portal when ready.'
                              : 'Ready for another round? Practice the same focus, or open deeper prep tools.'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {showHostChrome(roadmapQuery) ? (
                            <button
                              type="button"
                              onClick={() => session.returnHome()}
                              className="mm-voice-btn-primary !py-2.5 !px-5"
                            >
                              {hostBackLabel(roadmapQuery) || 'Done'}
                            </button>
                          ) : (
                            <button type="button" onClick={handlePracticeAgain} className="mm-voice-btn-primary !py-2.5 !px-5">
                              <RefreshCw size={15} /> Practice again
                            </button>
                          )}
                          {!showHostChrome(roadmapQuery) ? (
                            <>
                              <Link
                                to="/skill-gap-analyzer"
                                className="mm-voice-ctrl mm-voice-ctrl--secondary !px-5 !py-2.5"
                              >
                                Skill gap analyzer
                              </Link>
                              <Link
                                to="/placement-tracks"
                                className="mm-voice-ctrl mm-voice-ctrl--secondary !px-5 !py-2.5"
                              >
                                Placement tracks <ArrowRight size={15} />
                              </Link>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </ToolChrome>
  );
}

function ResultList({ title, subtitle, items, empty, tone = 'info', numbered = false, featured = false }) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!list.length && empty === null) return null;

  return (
    <div className={`mm-voice-panel ${featured ? 'mm-voice-panel--featured' : ''}`}>
      <div>
        <h3 className={`mm-voice-panel__title ${featured ? '' : 'mm-voice-panel__title--sm'}`}>{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {list.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mm-voice-editorial-list mt-2">
          {list.map((item, i) => (
            <li key={`${title}-${i}`}>
              <span className="mm-voice-editorial-list__n">
                {numbered ? String(i + 1).padStart(2, '0') : tone === 'success' ? '◆' : '◇'}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
