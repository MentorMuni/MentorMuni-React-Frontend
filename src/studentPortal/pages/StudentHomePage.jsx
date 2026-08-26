import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStudentShell } from '../shellContext';
import {
  fetchAnalysis,
  fetchPlan,
  fetchRoadmap,
  generatePlan,
  StudentApiError,
} from '../roadmap/roadmapApi';
import { WEEK1_STEPS } from '../roadmap/week1Steps';
import { recordStudentSession } from '../streak';
import { useDailyMission } from '../daily/useDailyMission';
import { isIndividualStudent } from '../accountType';

import HomeHeader from '../components/home/HomeHeader';
import PageSection from '../components/home/PageSection';
import MomentumRow from '../components/home/MomentumRow';
import PlacementReadinessHero from '../components/home/PlacementReadinessHero';
import DailyMissionSection from '../components/home/DailyMissionSection';
import BaselineAnalysisPanel from '../components/home/BaselineAnalysisPanel';
import VoicePracticeCallout from '../components/home/VoicePracticeCallout';
import PlacementJourneySection from '../components/home/PlacementJourneySection';
import UpcomingSection from '../components/home/UpcomingSection';
import CompaniesSection from '../components/home/CompaniesSection';
import LeaderboardSection from '../components/home/LeaderboardSection';
import MentorAlwaysOn from '../components/home/MentorAlwaysOn';

import '../styles/home.css';
import '../styles/mentor.css';

const BASELINE_CELEBRATED_KEY = 'mm-student-baseline-celebrated';
const POLL_INTERVAL_MS = 2500;
const POLL_MAX_TRIES = 60;

/** Product defaults, not fetched values. Change here, not at call sites. */
const TARGET_READINESS = 85;
const PLAN_HORIZON_DAYS = 90;

const TOOL_LABELS = Object.fromEntries(WEEK1_STEPS.map((s) => [s.tool_code, s.title]));

export default function StudentHomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, userKey, streak, weekDots, refreshStreak, nextDrive } = useStudentShell();
  const individual = isIndividualStudent(session);

  const [roadmap, setRoadmap] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [plan, setPlan] = useState(null);
  const [generateError, setGenerateError] = useState('');
  const [loadError, setLoadError] = useState('');
  const pollRef = useRef(null);
  const pollTriesRef = useRef(0);

  // Days 1–7 are the baseline rail; days 8–90 had nothing at all before this.
  const {
    mission,
    loading: missionLoading,
    error: missionError,
    budgetMinutes,
    chooseBudget,
    completeTask,
    skipTask,
    refresh: refreshMission,
  } = useDailyMission({ plan, roadmap, analysis, drive: nextDrive, userKey });

  const refresh = useCallback(async () => {
    try {
      const [rm, an] = await Promise.all([fetchRoadmap(), fetchAnalysis()]);
      setRoadmap(rm);
      setAnalysis(an);
      setLoadError('');

      if (rm.week_status === 'done') {
        try {
          const p = await fetchPlan();
          setPlan(p);
        } catch (err) {
          if (err instanceof StudentApiError && err.status === 404) {
            setPlan(null);
          } else {
            console.error('Plan fetch failed', err);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setLoadError(err?.message || 'Could not load roadmap');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Journey tools return to /home#stu-90day-plan — scroll after layout paints.
  useEffect(() => {
    const hash = String(location.hash || '').replace(/^#/, '');
    if (!hash) return undefined;
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.hash, roadmap?.week_status, plan?.status]);

  useEffect(() => {
    if (roadmap?.week_status !== 'done') return;
    const key = `${BASELINE_CELEBRATED_KEY}:${userKey}`;
    let alreadyCelebrated = false;
    try {
      alreadyCelebrated = localStorage.getItem(key) === '1';
    } catch {
      alreadyCelebrated = true;
    }
    if (alreadyCelebrated) return;
    try {
      localStorage.setItem(key, '1');
    } catch {
      // non-blocking
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    import('canvas-confetti')
      .then(({ default: confetti }) =>
        confetti({
          particleCount: 90,
          spread: 68,
          startVelocity: 34,
          origin: { y: 0.7 },
          colors: ['#46d4ee', '#1183c4', '#f0ad4a', '#16a34a'],
          disableForReducedMotion: true,
        })
      )
      .catch(() => {});
  }, [roadmap?.week_status, userKey]);

  const generating = plan?.status === 'generating' || roadmap?.plan_status === 'generating';

  useEffect(() => {
    if (!generating) {
      pollTriesRef.current = 0;
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return undefined;
    }
    pollTriesRef.current = 0;
    pollRef.current = setInterval(async () => {
      pollTriesRef.current += 1;
      if (pollTriesRef.current > POLL_MAX_TRIES) {
        clearInterval(pollRef.current);
        pollRef.current = null;
        setPlan((prev) =>
          prev
            ? {
                ...prev,
                status: 'failed',
                error_message: 'This is taking longer than expected. Try generating again.',
              }
            : prev
        );
        setGenerateError('This is taking longer than expected. Try generating again.');
        return;
      }
      try {
        const p = await fetchPlan({ silent: true });
        setPlan(p);
        if (p.status !== 'generating') refresh();
      } catch (err) {
        if (err instanceof StudentApiError && err.status === 404) return;
      }
    }, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [generating, refresh]);

  const handleStart = useCallback(
    (step) => {
      if (!step?.href || step.status === 'locked') return;
      recordStudentSession(userKey);
      refreshStreak();
      navigate(step.href);
    },
    [navigate, userKey, refreshStreak]
  );

  const handleGenerate = useCallback(async () => {
    setGenerateError('');
    setPlan((prev) =>
      prev
        ? { ...prev, status: 'generating', error_message: null }
        : {
            id: null,
            status: 'generating',
            prompt_version: null,
            model: null,
            summary: null,
            plan: null,
            error_message: null,
            created_at: null,
            completed_at: null,
          }
    );
    try {
      const p = await generatePlan();
      setPlan(p);
      if (p.status !== 'generating') refresh();
      refreshMission({ silent: true });
    } catch (err) {
      setPlan((prev) => (prev ? { ...prev, status: 'failed' } : prev));
      setGenerateError(err?.message || 'Could not start plan generation. Please try again.');
    }
  }, [refresh, refreshMission]);

  const steps = roadmap?.steps || [];
  const currentStep = steps.find((s) => s.status === 'current') || null;
  const readiness = analysis?.overall_score ?? 0;
  const completedCount = roadmap?.completed_count || 0;
  const totalCount = roadmap?.total_count || WEEK1_STEPS.length;
  const hasScoredBaseline = completedCount > 0 || readiness > 0;
  const baselineDone = roadmap?.week_status === 'done';
  const planStatus = plan?.status || roadmap?.plan_status;
  const planReady = planStatus === 'ready';
  const weekSessions = (weekDots || []).filter(Boolean).length;


  const breakdown = useMemo(
    () =>
      Object.entries(analysis?.scores_by_tool || {}).map(([code, score]) => ({
        label: TOOL_LABELS[code] || code.replace(/_/g, ' '),
        score: Math.round(score),
        weight: '',
      })),
    [analysis?.scores_by_tool]
  );

  const weakest = (analysis?.top_weaknesses || [])[0] || null;

  return (
    <main className="stu-main">
      {loadError ? (
        <p className="stu-alert stu-alert--bad" role="alert">
          {loadError}
        </p>
      ) : null}

      <HomeHeader
        studentName={session.name}
        completedCount={completedCount}
        totalCount={totalCount}
        weekStatus={roadmap?.week_status}
        planStatus={planStatus}
        currentStep={currentStep}
        onStart={handleStart}
        onGenerate={handleGenerate}
        generating={generating}
      />

      <MentorAlwaysOn />

      <PageSection
        id="stu-today-zone"
        title="Today’s focus"
        subtitle="Sized to the time you actually have today."
      >
        <div className={`stu-start-grid${baselineDone ? ' is-baseline-done' : ''}`}>
          <DailyMissionSection
            mission={mission}
            loading={missionLoading}
            error={missionError}
            budgetMinutes={budgetMinutes}
            onChooseBudget={chooseBudget}
            onCompleteTask={completeTask}
            onSkipTask={skipTask}
            onGeneratePlan={handleGenerate}
            generating={planStatus === 'generating'}
            baselineSteps={steps}
            onStartBaselineStep={handleStart}
          />
          {hasScoredBaseline ? (
            <PlacementReadinessHero
              currentReadiness={readiness}
              previousReadiness={null}
              targetReadiness={TARGET_READINESS}
              estimatedDays={
                baselineDone ? PLAN_HORIZON_DAYS : Math.max(1, totalCount - completedCount)
              }
              todayGain={0}
              expectedByNow={null}
              weekLabel={baselineDone ? 'after baseline' : 'baseline week'}
              breakdown={breakdown.length ? breakdown : undefined}
            />
          ) : null}
        </div>
      </PageSection>

      <MomentumRow
        consecutiveDays={streak.consecutiveDays}
        sessionsToday={streak.sessionsToday}
        practicedToday={streak.practicedToday}
        weekSessions={weekSessions}
        dayDone={baselineDone}
        daysToDrive={individual ? null : (nextDrive?.days_until ?? null)}
        baselineProgress={completedCount}
        baselineTotal={totalCount}
      />

      {hasScoredBaseline ? (
        <PageSection
          title="Your growth map"
          subtitle="Scores and gaps from finished checks — these feed your plan."
        >
          <BaselineAnalysisPanel analysis={analysis} steps={steps} />
        </PageSection>
      ) : null}

      {baselineDone ? (
        <PageSection
          title="Placement execution plan"
          subtitle="Generate once, then follow it day by day."
          id="stu-journey-zone"
        >
          <div className="stu-path-grid">
            <PlacementJourneySection
              weekStatus={roadmap?.week_status}
              plan={plan}
              planStatus={planStatus}
              generating={generating}
              onGenerate={handleGenerate}
              generateError={generateError}
            />
            {planReady && !individual ? <UpcomingSection nextDrive={nextDrive} /> : null}
          </div>
        </PageSection>
      ) : null}

      {baselineDone && weakest ? (
        <PageSection
          title="Close your weakest gap"
          subtitle="Voice practice on the area pulling your readiness down."
        >
          <VoicePracticeCallout studentName={session.name} weakest={weakest} />
        </PageSection>
      ) : null}

      {planReady && !individual ? (
        <PageSection
          title="Campus pulse"
          subtitle="Drives and peer pace — useful once your daily plan is running."
          className="stu-section--muted"
        >
          <div className="stu-pair-grid">
            <CompaniesSection
              drives={nextDrive ? [nextDrive] : []}
              readiness={readiness}
              isDemo={String(nextDrive?.id || '').startsWith('demo')}
            />
            <LeaderboardSection />
          </div>
        </PageSection>
      ) : null}

      <footer className="stu-foot" role="contentinfo">
        <p>Show up daily → finish today’s step → become placement ready.</p>
        <span>© {new Date().getFullYear()} MentorMuni</span>
      </footer>
    </main>
  );
}
