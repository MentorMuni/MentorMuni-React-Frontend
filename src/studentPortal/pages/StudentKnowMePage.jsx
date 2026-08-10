import { useCallback, useEffect, useMemo, useState } from 'react';
import { Lock, ArrowRight, ArrowLeft, Loader, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { useStudentShell } from '../shellContext';
import {
  startCheckIn,
  saveStepResponse,
  generateInsight,
  getProgress,
  loadSessionState,
  saveSessionState,
  clearSessionState,
  StudentApiError,
} from '../knowMe/knowMeApi';
import '../styles/know-me-v2.css';

const EMPATHY_COPY = [
  "You don't have to impress anyone here.",
  "You don't have to sound confident.",
  "You don't have to know the right answer.",
  "Just tell us what's actually going on.",
];

const PRIVACY_NOTE = (
  "Your answers are private and aren't shown to your TPO, HOD, classmates, or leaderboard."
);

export default function StudentKnowMePage() {
  const { session } = useStudentShell();
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

  useEffect(() => {
    const cached = loadSessionState();
    if (cached?.checkin_id && cached?.step_index !== undefined) {
      setCheckinId(cached.checkin_id);
      setStepIndex(cached.step_index);
      setResponses(new Map(cached.responses || []));
      setState('form');
    }
  }, []);

  async function handleStartCheckIn() {
    setLoading(true);
    setError('');
    try {
      console.log('Starting check-in...');
      const data = await startCheckIn();
      console.log('Check-in started:', data);
      setCheckinId(data.checkin_id);
      setQuestions(data.questions);
      setStepIndex(0);
      setResponses(new Map());
      setCurrentResponses({ selected_ids: [], free_text: '' });
      setState('form');
      saveSessionState(data.checkin_id, [], 0);
    } catch (err) {
      console.error('StartCheckIn failed:', err);
      setError(
        err instanceof StudentApiError ? err.message : 'Could not start check-in. Make sure you are logged in as a student.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckProgress() {
    setLoading(true);
    try {
      const data = await getProgress();
      setProgress(data);
      setState('progress');
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
      } else {
        return { ...prev, selected_ids: [id] };
      }
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
    setError('');
    clearSessionState();
    setState('landing');
  }

  const currentQuestion = stepIndex < questions.length ? questions[stepIndex] : null;
  const progressPct = questions.length > 0 ? ((stepIndex + 1) / questions.length) * 100 : 0;

  return (
    <main className="stu-main stu-knowme">
      {state === 'landing' && (
        <section className="stu-knowme-landing">
          <div className="stu-knowme__hero">
            <div className="stu-knowme__hero-inner">
              <p className="stu-knowme__lock-badge">
                <Lock size={13} strokeWidth={2.5} aria-hidden />
                Private to you
              </p>
              <h1 className="stu-knowme__title">Know Me</h1>
              <p className="stu-knowme__tagline">A private space to understand what's really holding you back.</p>
            </div>
          </div>

          <div className="stu-knowme-copy">
            {EMPATHY_COPY.map((line) => (
              <div key={line} className="stu-knowme-copy__block">
                {line}
              </div>
            ))}
          </div>

          <div className="stu-knowme__privacy-pledge">
            <Lock size={15} strokeWidth={2} aria-hidden />
            {PRIVACY_NOTE}
          </div>

          <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--ink-3)' }}>
            <em>No judgment. No marks. No right or wrong answers.</em>
          </p>

          <div className="stu-knowme__cta">
            <button
              type="button"
              className="stu-knowme__btn stu-knowme__btn--primary"
              onClick={handleStartCheckIn}
              disabled={loading}
            >
              {loading ? 'Starting...' : "Start a private check-in"}
              <ArrowRight size={16} strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              className="stu-knowme__btn stu-knowme__btn--secondary"
              onClick={handleCheckProgress}
            >
              View my progress
            </button>
          </div>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', color: 'var(--ink-3)' }}>
            Takes about 5–7 minutes
          </p>

          {error && (
            <div className="stu-knowme__error">
              <AlertCircle size={16} strokeWidth={2} style={{ verticalAlign: -2, marginRight: 6 }} aria-hidden />
              {error}
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--bad-ink)' }}>
                💡 <strong>Debug:</strong> Make sure you're logged in as a student. 
                Try logging out and back in from Home.
              </p>
            </div>
          )}
        </section>
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

              {/* Conversational choice buttons (not checkboxes) */}
              {(currentQuestion.response_type === 'single_select' ||
                currentQuestion.response_type === 'multi_select' ||
                currentQuestion.response_type === 'multi_select_with_text') && currentQuestion.choices ? (
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

              {/* Free text area (conversational) */}
              {(currentQuestion.response_type === 'free_text_only' ||
                currentQuestion.response_type === 'multi_select_with_text') && currentQuestion.free_text_placeholder ? (
                <>
                  <div className="stu-knowme__textarea-wrapper">
                    <textarea
                      className="stu-knowme__textarea"
                      value={currentResponses.free_text || ''}
                      onChange={(e) => handleFreeText(e.target.value)}
                      placeholder={currentQuestion.free_text_placeholder}
                      maxLength={2000}
                    />
                    <span className="stu-knowme__char-count">{(currentResponses.free_text || '').length}/2000</span>
                  </div>
                  {currentQuestion.free_text_prompt && (
                    <p className="stu-knowme__hint">{currentQuestion.free_text_prompt}</p>
                  )}
                </>
              ) : currentQuestion.free_text_prompt ? (
                <>
                  <div className="stu-knowme__textarea-wrapper">
                    <textarea
                      className="stu-knowme__textarea"
                      value={currentResponses.free_text || ''}
                      onChange={(e) => handleFreeText(e.target.value)}
                      placeholder={currentQuestion.free_text_placeholder || 'Tell us more...'}
                      maxLength={2000}
                    />
                    <span className="stu-knowme__char-count">{(currentResponses.free_text || '').length}/2000</span>
                  </div>
                  <p className="stu-knowme__hint">{currentQuestion.free_text_prompt}</p>
                </>
              ) : null}
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
            <p>Your private reflection</p>
            <h2 className="stu-knowme-result__headline">{insight.headline}</h2>
          </div>

          {insight.what_i_hear && insight.what_i_hear.length > 0 && (
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

          {insight.blockers && insight.blockers.length > 0 && (
            <div className="stu-knowme__section">
              <h3>Your biggest blockers</h3>
              {insight.blockers.map((b) => (
                <div key={`${b.order}-${b.title}`} className="stu-knowme__blocker">
                  <p className="stu-knowme__blocker-title">
                    {b.order}. {b.title}
                  </p>
                  {b.student_quote && (
                    <p className="stu-knowme__blocker-quote">{b.student_quote}</p>
                  )}
                  <div className="stu-knowme__blocker-action">
                    <strong>MentorMuni action: </strong>
                    {b.mentormuni_action}
                  </div>
                </div>
              ))}
            </div>
          )}

          {insight.action_plan && insight.action_plan.length > 0 && (
            <div className="stu-knowme__section">
              <h3>Your first steps</h3>
              <ul className="stu-knowme__list">
                {insight.action_plan.slice(0, 3).map((a) => (
                  <li key={`${a.priority}-${a.action_type}`}>
                    <strong>{a.description}</strong>
                    {a.duration_minutes && (
                      <span style={{ marginLeft: '0.5rem', color: 'var(--ink-3)' }}>
                        (~{a.duration_minutes}m)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="stu-knowme__call-to-action">{insight.call_to_action}</div>

          <div className="stu-knowme__closing">{insight.closing_line}</div>

          <div className="stu-knowme__actions">
            <button
              type="button"
              className="stu-knowme__btn stu-knowme__btn--primary"
              onClick={restartFlow}
            >
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
              {progress.days_since_first === 0 ? 'First check-in' : `${progress.days_since_first} days of progress`}
            </h2>
          </div>
          <div className="stu-knowme__section">
            <p>{progress.growth_summary}</p>
          </div>
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
