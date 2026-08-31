import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader, AlertCircle, Zap } from 'lucide-react';
import {
  startCheckIn,
  saveStepResponse,
  generateInsight,
  waitForInterventionPlan,
  getProgress,
  getInterventionStatus,
  submitWeeklyProgress,
  completeIntervention,
  getFearToFearlessNotifications,
  getActiveJourney,
  completePlanAction,
  loadSessionState,
  saveSessionState,
  clearSessionState,
  StudentApiError,
} from '../knowMe/knowMeApi';
import { canonicalToolCode } from '../knowMe/planUtils';
import FearToFearlessLanding from './FearToFearlessLanding';
import FearToFearlessInProgress from '../components/FearToFearlessInProgress';
import FearToFearlessPlan from '../components/FearToFearlessPlan';
import { normalizeWeek } from '../knowMe/planUtils';
import { isIndividualStudent } from '../accountType';
import { useStudentShell } from '../shellContext';
import '../styles/know-me-v2.css';

function readScoreDelta() {
  try {
    const raw = sessionStorage.getItem('mm-ftf-score-delta');
    if (!raw) return null;
    sessionStorage.removeItem('mm-ftf-score-delta');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function applySavedResponses(saved = []) {
  const map = new Map();
  saved.forEach((row) => {
    if (!row?.question_key) return;
    map.set(row.question_key, {
      selected_ids: row.selected_ids || [],
      free_text: row.free_text || '',
    });
  });
  return map;
}

export default function StudentKnowMePage() {
  const { session } = useStudentShell();
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState('landing');
  const [waitKind, setWaitKind] = useState(null);
  const [checkinId, setCheckinId] = useState(null);
  const [activeJourney, setActiveJourney] = useState(null);
  const [scoreDelta, setScoreDelta] = useState(null);
  const [markingTool, setMarkingTool] = useState('');
  const [questions, setQuestions] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [responses, setResponses] = useState(new Map());
  const [currentResponses, setCurrentResponses] = useState({ selected_ids: [], free_text: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [insight, setInsight] = useState(null);
  const [progress, setProgress] = useState(null);
  const [intervention, setIntervention] = useState(null);
  const [weeklyFearId, setWeeklyFearId] = useState('');
  const [weeklyForm, setWeeklyForm] = useState({
    actions_completed: 3,
    actions_total: 7,
    self_assessment: 7,
    challenges: '',
  });
  const [weeklyResult, setWeeklyResult] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [celebration, setCelebration] = useState(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const wantPlan = searchParams.get('open') === 'plan';
    const historyId = searchParams.get('checkin');

    async function hydrate() {
      try {
        const active = await getActiveJourney(historyId || undefined);
        if (cancelled) return;
        setActiveJourney(active);
        setScoreDelta(readScoreDelta());

        if (active?.phase === 'form' && active.checkin_id) {
          restoreFormFromActive(active);
          return;
        }

        if ((wantPlan || historyId) && active?.insight) {
          openPlanFromActive(active);
          return;
        }

        const cached = loadSessionState();
        const cachedQuestions = Array.isArray(cached?.questions) ? cached.questions : [];
        if (
          cached?.checkin_id != null &&
          cached?.step_index !== undefined &&
          cachedQuestions.length > 0 &&
          active?.phase === 'form'
        ) {
          restoreFormFromCache(cached, cachedQuestions);
        }
      } catch {
        const cached = loadSessionState();
        const cachedQuestions = Array.isArray(cached?.questions) ? cached.questions : [];
        if (cached?.checkin_id != null && cached?.step_index !== undefined && cachedQuestions.length > 0) {
          restoreFormFromCache(cached, cachedQuestions);
        } else if (cached?.checkin_id) {
          clearSessionState();
        }
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state !== 'result' || !checkinId) return undefined;
    const needsPlan =
      !intervention ||
      intervention.status === 'awaiting_solutions' ||
      !((intervention.solutions?.length ?? 0) > 0 || (intervention.fears?.length ?? 0) > 0);
    if (!needsPlan) return undefined;

    let cancelled = false;
    (async () => {
      const status = await waitForInterventionPlan(checkinId, { attempts: 10, delayMs: 2000 });
      if (cancelled || !status) return;
      await loadIntervention(checkinId);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, checkinId, intervention?.status]);

  function restoreFormFromCache(cached, cachedQuestions) {
    setCheckinId(cached.checkin_id);
    setStepIndex(cached.step_index);
    setQuestions(cachedQuestions);
    setResponses(new Map(cached.responses || []));
    const prev = new Map(cached.responses || []).get(cachedQuestions[cached.step_index]?.key);
    setCurrentResponses(prev || { selected_ids: [], free_text: '' });
    setState('form');
  }

  function restoreFormFromActive(active) {
    const qs = Array.isArray(active.questions) ? active.questions : [];
    const cached = loadSessionState();
    const cachedMatches = cached?.checkin_id === active.checkin_id;
    const map = cachedMatches
      ? new Map(cached.responses || [])
      : applySavedResponses(active.saved_responses || []);
    const idx = cachedMatches ? cached.step_index : active.step_index || 0;
    setCheckinId(active.checkin_id);
    setQuestions(qs);
    setStepIndex(idx);
    setResponses(map);
    setCurrentResponses(map.get(qs[idx]?.key) || { selected_ids: [], free_text: '' });
    setState('form');
    saveSessionState(active.checkin_id, [...map.entries()], idx, qs);
  }

  function openPlanFromActive(active) {
    setCheckinId(active.checkin_id);
    setInsight(active.insight);
    setIntervention(active.intervention);
    if (active.intervention?.fear_factor != null) {
      setWeeklyForm((p) => ({ ...p, self_assessment: active.intervention.fear_factor }));
    }
    const firstFear =
      active.intervention?.fears?.[0]?.fear_id || active.intervention?.solutions?.[0]?.fear_id || '';
    setWeeklyFearId(firstFear);
    setState('result');
    clearSessionState();
    loadNotifications();
  }

  async function loadIntervention(id) {
    if (!id) return null;
    try {
      const status = await getInterventionStatus(id);
      setIntervention(status);
      if (status?.fear_factor != null) {
        setWeeklyForm((p) => ({ ...p, self_assessment: status.fear_factor }));
      }
      const firstFear = status?.fears?.[0]?.fear_id || status?.solutions?.[0]?.fear_id || '';
      setWeeklyFearId((prev) => prev || firstFear);
      const sol =
        (status?.solutions || []).find((s) => String(s.fear_id) === String(firstFear)) ||
        status?.solutions?.[0];
      if (sol) {
        const week = normalizeWeek(
          sol,
          Math.min(6, Math.max(1, (status.week_current || 0) + 1)),
          {
            checkinId: id,
            fearId: sol.fear_id,
            individual: isIndividualStudent(session),
          }
        );
        setWeeklyForm((p) => ({ ...p, actions_total: week.days.length || 5 }));
      }
      return status;
    } catch (err) {
      console.warn('intervention status failed', err);
      return null;
    }
  }

  async function loadNotifications() {
    try {
      const data = await getFearToFearlessNotifications(false);
      setNotifications(data?.notifications || []);
    } catch {
      /* optional */
    }
  }

  async function handleStartCheckIn() {
    if (activeJourney?.locked) {
      await handleOpenPlan();
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await startCheckIn();
      const saved = applySavedResponses(data.saved_responses || []);
      const idx = data.resumed ? data.step_index || 0 : 0;
      setCheckinId(data.checkin_id);
      setQuestions(data.questions);
      setStepIndex(idx);
      setResponses(saved);
      setCurrentResponses(saved.get(data.questions?.[idx]?.key) || { selected_ids: [], free_text: '' });
      setInsight(null);
      setIntervention(null);
      setWeeklyResult(null);
      setCelebration(null);
      setState('form');
      saveSessionState(data.checkin_id, [...saved.entries()], idx, data.questions || []);
    } catch (err) {
      console.error('StartCheckIn failed:', err);
      if (err instanceof StudentApiError && err.status === 409) {
        const lockedId = err.detail?.checkin_id || err.data?.detail?.checkin_id;
        setError(err.message || 'Stay with your current plan for 15 days.');
        try {
          const active = await getActiveJourney(lockedId);
          setActiveJourney(active);
          if (active?.insight) openPlanFromActive(active);
        } catch {
          /* landing still shows lock */
        }
      } else {
        setError(
          err instanceof StudentApiError
            ? err.message
            : 'Could not start check-in. Make sure you are logged in as a student.'
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenPlan(id) {
    setLoading(true);
    setError('');
    try {
      const active = await getActiveJourney(id || undefined);
      setActiveJourney(active);
      if (active?.insight) {
        openPlanFromActive(active);
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set('open', 'plan');
          if (active.checkin_id) next.set('checkin', String(active.checkin_id));
          return next;
        });
      } else if (active?.phase === 'form') {
        restoreFormFromActive(active);
      } else {
        setError('No saved plan yet. Start a check-in first.');
      }
    } catch (err) {
      setError(err instanceof StudentApiError ? err.message : 'Could not open your last plan.');
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAction(fearId, toolCode, actionKey) {
    if (!checkinId || !toolCode) return;
    const tool = canonicalToolCode(toolCode);
    setMarkingTool(tool);
    setError('');
    try {
      const result = await completePlanAction(checkinId, {
        fear_id: fearId,
        tool_code: tool,
        action_key: actionKey,
        source: 'plan',
      });
      if (result?.intervention) setIntervention(result.intervention);
      else await loadIntervention(checkinId);
      if (result?.severity_before != null && result?.severity_after != null) {
        setScoreDelta({
          before: result.fear_factor != null ? result.severity_before : result.severity_before,
          after: result.fear_factor ?? result.severity_after,
        });
      }
      setActiveJourney((prev) =>
        prev
          ? {
              ...prev,
              fear_factor: result.fear_factor ?? prev.fear_factor,
              intervention: result.intervention || prev.intervention,
            }
          : prev
      );
    } catch (err) {
      setError(err instanceof StudentApiError ? err.message : 'Could not update your fear factor.');
    } finally {
      setMarkingTool('');
    }
  }

  async function handleCheckProgress() {
    setLoading(true);
    setError('');
    try {
      const data = await getProgress();
      setProgress(data);
      setState('progress');
      await loadNotifications();
      if (checkinId) await loadIntervention(checkinId);
    } catch {
      setError('Could not load progress.');
    } finally {
      setLoading(false);
    }
  }

  async function handleNextStep() {
    if (submittingRef.current) return;
    if (stepIndex >= questions.length) return;
    const q = questions[stepIndex];
    if (!checkinId) {
      setError('Your session expired. Go back and start the check-in again.');
      return;
    }
    if (!q?.key) {
      setError('This question could not be loaded. Refresh the page and try again.');
      return;
    }

    setError('');
    setLoading(true);
    submittingRef.current = true;
    const lastStep = stepIndex + 1 >= questions.length;
    const waitStarted = Date.now();
    if (lastStep) setWaitKind('building');
    try {
      try {
        await saveStepResponse(checkinId, {
          question_key: q.key,
          response_type: q.response_type || 'free_text_only',
          selected_ids: currentResponses.selected_ids || [],
          free_text: currentResponses.free_text || '',
        });
      } catch (err) {
        const msg =
          err instanceof StudentApiError
            ? err.message
            : err?.message || 'Check your connection and try again.';
        throw new Error(`Could not save your answer: ${msg}`);
      }

      const newResponses = new Map(responses);
      newResponses.set(q.key, currentResponses);
      setResponses(newResponses);

      if (lastStep) {
        let insightData;
        try {
          insightData = await generateInsight(checkinId);
        } catch (err) {
          const msg =
            err instanceof StudentApiError
              ? err.message
              : err?.message || 'This can take up to a minute — please try again.';
          throw new Error(`Could not build your reflection: ${msg}`);
        }
        if (!insightData?.headline) {
          throw new Error('Could not build your reflection. Please try again.');
        }
        setInsight(insightData);

        await waitForInterventionPlan(checkinId);
        await loadIntervention(checkinId);

        await loadNotifications();
        try {
          const active = await getActiveJourney(checkinId);
          setActiveJourney(active);
        } catch {
          /* plan still shows from intervention */
        }
        setState('result');
        clearSessionState();
      } else {
        setStepIndex(stepIndex + 1);
        setCurrentResponses({ selected_ids: [], free_text: '' });
        saveSessionState(checkinId, [...newResponses.entries()], stepIndex + 1, questions);
      }
    } catch (err) {
      console.error('Error in handleNextStep:', err);
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      submittingRef.current = false;
      if (lastStep) {
        const remain = Math.max(0, 2600 - (Date.now() - waitStarted));
        if (remain) await new Promise((resolve) => window.setTimeout(resolve, remain));
      }
      setLoading(false);
      setWaitKind(null);
    }
  }

  async function handleWeeklySubmit(e) {
    e?.preventDefault?.();
    if (!checkinId || !weeklyFearId) {
      setError('Select a fear to update weekly progress.');
      return;
    }
    setLoading(true);
    setWaitKind('weekly');
    setError('');
    try {
      const weekNumber = Math.min(6, Math.max(1, (intervention?.week_current || 0) + 1));
      const result = await submitWeeklyProgress(checkinId, {
        fear_id: weeklyFearId,
        week_number: weekNumber,
        actions_completed: Number(weeklyForm.actions_completed) || 0,
        actions_total: Number(weeklyForm.actions_total) || 7,
        self_assessment: Number(weeklyForm.self_assessment) || 0,
        challenges: weeklyForm.challenges || '',
      });
      setWeeklyResult(result);
      const status = await loadIntervention(checkinId);
      if (status?.status === 'completed') {
        const done = await completeIntervention(checkinId);
        setCelebration(done);
      }
    } catch (err) {
      setError(err instanceof StudentApiError ? err.message : 'Could not save weekly progress.');
    } finally {
      setLoading(false);
      setWaitKind(null);
    }
  }

  function handlePrevStep() {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      const prev = responses.get(questions[stepIndex - 1].key) || {
        selected_ids: [],
        free_text: '',
      };
      setCurrentResponses(prev);
      setError('');
    }
  }

  function handleSelectChoice(id, isMulti = false) {
    setCurrentResponses((prev) => {
      const sels = prev.selected_ids || [];
      if (isMulti) {
        const idx = sels.indexOf(id);
        return {
          ...prev,
          selected_ids: idx >= 0 ? sels.filter((x) => x !== id) : [...sels, id],
        };
      }
      return { ...prev, selected_ids: [id] };
    });
  }

  function handleFreeText(text) {
    setCurrentResponses((prev) => ({ ...prev, free_text: text.slice(0, 2000) }));
  }

  function restartFlow() {
    setQuestions([]);
    setStepIndex(0);
    setResponses(new Map());
    setCurrentResponses({ selected_ids: [], free_text: '' });
    setWeeklyResult(null);
    setCelebration(null);
    setError('');
    setWaitKind(null);
    clearSessionState();
    setSearchParams({});
    setState('landing');
    getActiveJourney()
      .then((active) => {
        setActiveJourney(active);
        if (active?.locked) {
          setCheckinId(active.checkin_id);
          setInsight(active.insight);
          setIntervention(active.intervention);
        } else {
          setCheckinId(active?.checkin_id || null);
          setInsight(null);
          setIntervention(null);
        }
      })
      .catch(() => {
        setInsight(null);
        setIntervention(null);
      });
  }

  const currentQuestion = stepIndex < questions.length ? questions[stepIndex] : null;
  const personalNote = (() => {
    const latest = String(currentResponses?.free_text || '').trim();
    if (latest) return latest;
    for (const value of responses.values()) {
      const text = String(value?.free_text || '').trim();
      if (text) return text;
    }
    return '';
  })();
  const progressPct = questions.length > 0 ? ((stepIndex + 1) / questions.length) * 100 : 0;

  return (
    <main className={`stu-main stu-knowme${state === 'landing' ? ' stu-knowme--landing' : ''}`}>
      {state === 'landing' && (
        <FearToFearlessLanding
          onStartJourney={handleStartCheckIn}
          onViewProgress={handleCheckProgress}
          onOpenPlan={() => handleOpenPlan()}
          onOpenHistory={(id) => handleOpenPlan(id)}
          loading={loading}
          error={error}
          active={activeJourney}
        />
      )}

      {state === 'form' && !currentQuestion && (
        <section className="stu-knowme-form">
          <p className="stu-knowme__error" role="alert">
            This check-in session could not be resumed.
          </p>
          <button type="button" className="stu-knowme__btn stu-knowme__btn--primary" onClick={restartFlow}>
            Back to Fear → Fearless
          </button>
        </section>
      )}

      {state === 'form' && currentQuestion && (
        <form
          className="stu-knowme-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleNextStep();
          }}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing || loading) return;
            if (e.target instanceof HTMLTextAreaElement) return;
            if (e.target instanceof HTMLButtonElement && e.target.type === 'submit') return;
            e.preventDefault();
            e.currentTarget.requestSubmit();
          }}
        >
          <div className="stu-knowme-progress">
            <span>
              Question {stepIndex + 1} of {questions.length}
            </span>
            <div className="stu-knowme-progress__bar">
              <div className="stu-knowme-progress__fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className="stu-knowme__step">
            <div className="stu-knowme__step-header">
              <h2>{currentQuestion.screen_title}</h2>
              <p>{currentQuestion.intro_text}</p>
            </div>

            <div className="stu-knowme__field">
              <label className="stu-knowme__field-label">{currentQuestion.question_text}</label>

              {(currentQuestion.response_type === 'single_select' ||
                currentQuestion.response_type === 'multi_select' ||
                currentQuestion.response_type === 'multi_select_with_text') &&
              currentQuestion.choices ? (
                <div className="stu-knowme__choices">
                  {currentQuestion.choices.map((ch) => {
                    const isSelected = (currentResponses.selected_ids || []).includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        className={`stu-knowme__choice${isSelected ? ' is-on' : ''}`}
                        aria-pressed={isSelected}
                        onClick={() =>
                          handleSelectChoice(
                            ch.id,
                            currentQuestion.response_type === 'multi_select' ||
                              currentQuestion.response_type === 'multi_select_with_text'
                          )
                        }
                      >
                        <span className="stu-knowme__choice-dot" />
                        {ch.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {(currentQuestion.response_type === 'free_text_only' ||
                currentQuestion.response_type === 'multi_select_with_text' ||
                currentQuestion.free_text_prompt) && (
                <div className="stu-knowme__textarea-wrapper">
                  {currentQuestion.free_text_prompt ? (
                    <p className="stu-knowme__field-hint">{currentQuestion.free_text_prompt}</p>
                  ) : null}
                  <textarea
                    className="stu-knowme__textarea"
                    rows={4}
                    placeholder={currentQuestion.free_text_placeholder || 'Write in your own words…'}
                    value={currentResponses.free_text || ''}
                    onChange={(e) => handleFreeText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return;
                      e.preventDefault();
                      e.currentTarget.form?.requestSubmit();
                    }}
                  />
                  <p className="stu-knowme__hint">Enter continues · Shift+Enter for a new line</p>
                </div>
              )}
            </div>

            {error && <p className="stu-knowme__error">{error}</p>}

            <div className="stu-knowme__actions">
              <button
                type="button"
                className="stu-knowme__btn stu-knowme__btn--secondary"
                onClick={handlePrevStep}
                disabled={stepIndex === 0 || loading}
              >
                <ArrowLeft size={16} strokeWidth={2} aria-hidden />
                Back
              </button>
              <button
                type="submit"
                className="stu-knowme__btn stu-knowme__btn--primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size={16} strokeWidth={2} className="spin" aria-hidden />
                    Saving...
                  </>
                ) : stepIndex === questions.length - 1 ? (
                  <>
                    Get my reflection
                    <Zap size={16} strokeWidth={2} aria-hidden />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight size={16} strokeWidth={2} aria-hidden />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {state === 'result' && insight && (
        <section className="stu-knowme-result">
          <div className="stu-knowme-result__header">
            <p>Fear → Fearless · private reflection</p>
            <h2 className="stu-knowme-result__headline">{insight.headline}</h2>
          </div>

          {insight.what_i_hear?.length > 0 && (
            <div className="stu-knowme__section">
              <h3>What I hear</h3>
              <ul className="stu-knowme__list">
                {insight.what_i_hear.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="stu-knowme-result__narrative">{insight.narrative}</div>

          {insight.blockers?.length > 0 && (
            <div className="stu-knowme__section">
              <h3>Your biggest blockers</h3>
              {insight.blockers.map((b) => (
                <div key={`${b.order}-${b.title}`} className="stu-knowme__blocker">
                  <p className="stu-knowme__blocker-title">
                    {b.order}. {b.title}
                  </p>
                  {b.student_quote && <p className="stu-knowme__blocker-quote">{b.student_quote}</p>}
                  <div className="stu-knowme__blocker-action">
                    <strong>MentorMuni action: </strong>
                    {b.mentormuni_action}
                  </div>
                </div>
              ))}
            </div>
          )}

          {insight.action_plan?.length > 0 && (
            <div className="stu-knowme__section">
              <h3>Your first steps</h3>
              <ul className="stu-knowme__list">
                {insight.action_plan.slice(0, 3).map((a) => (
                  <li key={`${a.priority}-${a.action_type}`}>
                    <strong>{a.description}</strong>
                    {a.duration_minutes ? (
                      <span style={{ marginLeft: '0.5rem', color: 'var(--ink-3)' }}>
                        (~{a.duration_minutes}m)
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="stu-knowme__call-to-action">{insight.call_to_action}</div>
          <div className="stu-knowme__closing">{insight.closing_line}</div>

          {intervention ? (
            <FearToFearlessPlan
              intervention={intervention}
              weeklyFearId={weeklyFearId}
              onFearChange={(id, dayCount) => {
                setWeeklyFearId(id);
                setWeeklyForm((p) => ({ ...p, actions_total: dayCount || p.actions_total }));
              }}
              weeklyForm={weeklyForm}
              onFormChange={setWeeklyForm}
              onSubmit={handleWeeklySubmit}
              loading={loading}
              weeklyResult={weeklyResult}
              celebration={celebration}
              notifications={notifications}
              onMarkAction={handleMarkAction}
              markingTool={markingTool}
              daysRemaining={activeJourney?.locked ? activeJourney.days_remaining : null}
              lockDays={activeJourney?.lock_days || 15}
              scoreDelta={scoreDelta}
            />
          ) : (
            <p className="stu-knowme__field-hint">Building your personal week…</p>
          )}

          <div className="stu-knowme__actions stu-knowme__actions--inline">
            <button type="button" className="stu-knowme__btn stu-knowme__btn--secondary" onClick={restartFlow}>
              {activeJourney?.locked ? 'Back to Fear → Fearless' : 'Talk about something else'}
            </button>
          </div>
        </section>
      )}

      {state === 'progress' && progress && (
        <section className="stu-knowme-result">
          <div className="stu-knowme-result__header">
            <p>Your growth</p>
            <h2 className="stu-knowme-result__headline">
              {progress.days_since_first === 0
                ? 'First check-in'
                : `${progress.days_since_first} days of progress`}
            </h2>
          </div>
          <div className="stu-knowme__section">
            <p>{progress.growth_summary}</p>
          </div>
          {notifications.length > 0 && (
            <div className="stu-knowme__section stu-ftf-notifs">
              <h3>Reminders</h3>
              <ul>
                {notifications.slice(0, 5).map((n) => (
                  <li key={n.id}>
                    <strong>{n.title}</strong> — {n.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="stu-knowme__actions">
            <button
              type="button"
              className="stu-knowme__btn stu-knowme__btn--primary"
              onClick={activeJourney?.locked ? () => handleOpenPlan() : restartFlow}
            >
              {activeJourney?.locked ? 'Open my plan' : 'Back to Fear → Fearless'}
            </button>
          </div>
        </section>
      )}

      {loading && (state === 'landing' || (state === 'result' && !insight)) && (
        <div className="stu-knowme__loading">
          <div className="stu-knowme__spinner" aria-hidden />
          <h2>Just a moment…</h2>
          <p>Thinking about what you shared.</p>
        </div>
      )}

      {error && state !== 'form' && (
        <div className="stu-knowme__error">
          <AlertCircle size={16} strokeWidth={2} style={{ verticalAlign: -2, marginRight: 6 }} aria-hidden />
          {error}
        </div>
      )}

      {waitKind ? (
        <FearToFearlessInProgress
          variant={waitKind}
          session={session}
          studentNote={personalNote}
        />
      ) : null}
    </main>
  );
}
