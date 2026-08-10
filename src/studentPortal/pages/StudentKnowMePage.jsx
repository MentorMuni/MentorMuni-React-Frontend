import { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, Loader, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import {
  startCheckIn,
  saveStepResponse,
  generateInsight,
  getProgress,
  getInterventionStatus,
  submitWeeklyProgress,
  completeIntervention,
  getFearToFearlessNotifications,
  loadSessionState,
  saveSessionState,
  clearSessionState,
  StudentApiError,
} from '../knowMe/knowMeApi';
import FearToFearlessLanding from './FearToFearlessLanding';
import '../styles/know-me-v2.css';

export default function StudentKnowMePage() {
  const [state, setState] = useState('landing');
  const [checkinId, setCheckinId] = useState(null);
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

  useEffect(() => {
    const cached = loadSessionState();
    if (cached?.checkin_id && cached?.step_index !== undefined) {
      setCheckinId(cached.checkin_id);
      setStepIndex(cached.step_index);
      setResponses(new Map(cached.responses || []));
      setState('form');
    }
  }, []);

  async function loadIntervention(id) {
    if (!id) return null;
    try {
      const status = await getInterventionStatus(id);
      setIntervention(status);
      const firstFear = status?.fears?.[0]?.fear_id || status?.solutions?.[0]?.fear_id || '';
      setWeeklyFearId((prev) => prev || firstFear);
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
    setLoading(true);
    setError('');
    try {
      const data = await startCheckIn();
      setCheckinId(data.checkin_id);
      setQuestions(data.questions);
      setStepIndex(0);
      setResponses(new Map());
      setCurrentResponses({ selected_ids: [], free_text: '' });
      setInsight(null);
      setIntervention(null);
      setWeeklyResult(null);
      setCelebration(null);
      setState('form');
      saveSessionState(data.checkin_id, [], 0);
    } catch (err) {
      console.error('StartCheckIn failed:', err);
      setError(
        err instanceof StudentApiError
          ? err.message
          : 'Could not start check-in. Make sure you are logged in as a student.'
      );
    } finally {
      setLoading(false);
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
    if (stepIndex >= questions.length) return;
    const q = questions[stepIndex];
    setError('');
    setLoading(true);
    try {
      await saveStepResponse(checkinId, {
        question_key: q.key,
        response_type: q.response_type,
        selected_ids: currentResponses.selected_ids || [],
        free_text: currentResponses.free_text || '',
      });
      const newResponses = new Map(responses);
      newResponses.set(q.key, currentResponses);
      setResponses(newResponses);

      if (stepIndex + 1 >= questions.length) {
        const insightData = await generateInsight(checkinId);
        setInsight(insightData);
        await loadIntervention(checkinId);
        await loadNotifications();
        setState('result');
        clearSessionState();
      } else {
        setStepIndex(stepIndex + 1);
        setCurrentResponses({ selected_ids: [], free_text: '' });
        saveSessionState(checkinId, [...newResponses.entries()], stepIndex + 1);
      }
    } catch (err) {
      console.error('Error in handleNextStep:', err);
      setError(err instanceof StudentApiError ? err.message : 'Error saving response.');
    } finally {
      setLoading(false);
    }
  }

  async function handleWeeklySubmit(e) {
    e?.preventDefault?.();
    if (!checkinId || !weeklyFearId) {
      setError('Select a fear to update weekly progress.');
      return;
    }
    setLoading(true);
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
    setCheckinId(null);
    setQuestions([]);
    setStepIndex(0);
    setResponses(new Map());
    setCurrentResponses({ selected_ids: [], free_text: '' });
    setInsight(null);
    setIntervention(null);
    setWeeklyResult(null);
    setCelebration(null);
    setError('');
    clearSessionState();
    setState('landing');
  }

  const currentQuestion = stepIndex < questions.length ? questions[stepIndex] : null;
  const progressPct = questions.length > 0 ? ((stepIndex + 1) / questions.length) * 100 : 0;
  const solutionList = intervention?.solutions || [];

  return (
    <main className="stu-main stu-knowme">
      {state === 'landing' && (
        <FearToFearlessLanding
          onStartJourney={handleStartCheckIn}
          onViewProgress={handleCheckProgress}
          loading={loading}
          error={error}
        />
      )}

      {state === 'form' && currentQuestion && (
        <section className="stu-knowme-form">
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
                <div className="stu-knowme__textarea-wrap">
                  {currentQuestion.free_text_prompt ? (
                    <p className="stu-knowme__field-hint">{currentQuestion.free_text_prompt}</p>
                  ) : null}
                  <textarea
                    className="stu-knowme__textarea"
                    rows={4}
                    placeholder={currentQuestion.free_text_placeholder || 'Write in your own words…'}
                    value={currentResponses.free_text || ''}
                    onChange={(e) => handleFreeText(e.target.value)}
                  />
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
                type="button"
                className="stu-knowme__btn stu-knowme__btn--primary"
                onClick={handleNextStep}
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
        </section>
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

          <div className="stu-knowme__section stu-ftf-journey">
            <h3>Your 6-week Fear → Fearless plan</h3>
            {intervention ? (
              <>
                <p className="stu-ftf-meta">
                  Status: <strong>{intervention.status}</strong>
                  {' · '}
                  Week {intervention.week_current || 0}/6
                  {' · '}
                  Overall {intervention.overall_progress_percent || 0}%
                </p>
                <div className="stu-ftf-fears">
                  {(intervention.fears || []).map((f) => (
                    <div key={f.fear_id} className="stu-ftf-fear-card">
                      <strong>{f.fear_name}</strong>
                      <span>
                        Fear {f.severity_initial} → {f.severity_current}
                      </span>
                      <div className="stu-knowme-progress__bar">
                        <div
                          className="stu-knowme-progress__fill"
                          style={{ width: `${f.progress_percent || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {solutionList.length > 0 && (
                  <details className="stu-ftf-plan-details">
                    <summary>View week-1 actions</summary>
                    {solutionList.map((s) => (
                      <div key={s.solution_id || s.fear_id} className="stu-ftf-plan-block">
                        <strong>{s.fear_name}</strong>
                        <pre className="stu-ftf-plan-json">
                          {JSON.stringify(
                            s.solution_data?.week1 ||
                              s.solution_data?.action_plan_section?.week1 ||
                              s.weekly_actions,
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    ))}
                  </details>
                )}
              </>
            ) : (
              <p>Building your personalized 6-week plan…</p>
            )}

            <form className="stu-ftf-weekly" onSubmit={handleWeeklySubmit}>
              <h4>Weekly progress check-in</h4>
              <label>
                Fear
                <select value={weeklyFearId} onChange={(e) => setWeeklyFearId(e.target.value)}>
                  {(intervention?.fears || []).map((f) => (
                    <option key={f.fear_id} value={f.fear_id}>
                      {f.fear_name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Actions completed
                <input
                  type="number"
                  min={0}
                  value={weeklyForm.actions_completed}
                  onChange={(e) =>
                    setWeeklyForm((p) => ({ ...p, actions_completed: e.target.value }))
                  }
                />
              </label>
              <label>
                Actions total
                <input
                  type="number"
                  min={1}
                  value={weeklyForm.actions_total}
                  onChange={(e) => setWeeklyForm((p) => ({ ...p, actions_total: e.target.value }))}
                />
              </label>
              <label>
                Self-assessment (0–10)
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.5}
                  value={weeklyForm.self_assessment}
                  onChange={(e) =>
                    setWeeklyForm((p) => ({ ...p, self_assessment: e.target.value }))
                  }
                />
              </label>
              <label>
                Challenges (optional)
                <textarea
                  rows={2}
                  value={weeklyForm.challenges}
                  onChange={(e) => setWeeklyForm((p) => ({ ...p, challenges: e.target.value }))}
                />
              </label>
              <button
                type="submit"
                className="stu-knowme__btn stu-knowme__btn--primary"
                disabled={loading || !weeklyFearId}
              >
                {loading ? 'Saving…' : 'Submit weekly progress'}
              </button>
            </form>

            {weeklyResult && (
              <div className="stu-ftf-weekly-result">
                <CheckCircle2 size={16} />
                <div>
                  <p>
                    Severity {weeklyResult.severity_before} → {weeklyResult.severity_after}
                    {weeklyResult.milestone_reached ? ' · Fear conquered!' : ''}
                  </p>
                  {weeklyResult.feedback?.celebration && <p>{weeklyResult.feedback.celebration}</p>}
                  {weeklyResult.feedback?.next_week_focus && (
                    <p>
                      <strong>Next:</strong> {weeklyResult.feedback.next_week_focus}
                    </p>
                  )}
                </div>
              </div>
            )}

            {celebration?.celebration && (
              <div className="stu-ftf-celebration">
                <h4>{celebration.celebration.celebration_title || 'You did it!'}</h4>
                <p>{celebration.celebration.main_message}</p>
              </div>
            )}

            {notifications.length > 0 && (
              <div className="stu-ftf-notifs">
                <h4>Your reminders</h4>
                <ul>
                  {notifications.slice(0, 5).map((n) => (
                    <li key={n.id}>
                      <strong>{n.title}</strong> — {n.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="stu-knowme__actions">
            <button type="button" className="stu-knowme__btn stu-knowme__btn--primary" onClick={restartFlow}>
              Start a new check-in
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
            <button type="button" className="stu-knowme__btn stu-knowme__btn--primary" onClick={restartFlow}>
              Start a check-in
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
    </main>
  );
}
