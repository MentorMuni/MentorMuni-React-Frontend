import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { studentApi } from '../../studentPortal/studentApi';
import { useToolSession } from '../../widgets/ToolSessionContext';
import './coding-assessment.css';

const DEFAULT_ASSESSMENT = 'practice-two-sum';
const POLL_MS = 1200;
const DRAFT_KEY = (attemptId, problemId, lang) =>
  `mm-coding-draft:${attemptId}:${problemId}:${lang}`;

const LANG_MONACO = {
  python: 'python',
  cpp: 'cpp',
  java: 'java',
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function pollUntil(fetchFn, { isDone, maxMs = 45000, onTick } = {}) {
  const start = Date.now();
  let last = null;
  while (Date.now() - start < maxMs) {
    last = await fetchFn();
    if (typeof onTick === 'function') onTick(last);
    if (isDone(last)) return last;
    await sleep(POLL_MS);
  }
  const err = new Error(
    'Timed out waiting for the coding worker. Use Python in local/dev, or configure JUDGE0_BASE_URL and restart the worker.',
  );
  err.last = last;
  throw err;
}

function ScorePill({ label, value, tone = 'official' }) {
  return (
    <div className={`mm-coding-score mm-coding-score--${tone}`}>
      <span className="mm-coding-score__label">{label}</span>
      <span className="mm-coding-score__value">
        {value == null || Number.isNaN(Number(value)) ? '—' : Number(value).toFixed(0)}
      </span>
    </div>
  );
}

function DimScore({ label, value }) {
  return (
    <div className="mm-coding-dim">
      <span>{label}</span>
      <strong>{value == null ? '—' : Number(value).toFixed(0)}</strong>
    </div>
  );
}

function CoachingPanel({ analysis }) {
  if (!analysis) {
    return <p className="mm-coding__muted">No coaching analysis yet.</p>;
  }
  if (analysis.analysis_status !== 'ready') {
    return (
      <p className="mm-coding__muted">Analysis status: {analysis.analysis_status || 'pending'}</p>
    );
  }

  const ba = analysis.better_approach || null;

  return (
    <div className="mm-coding-coaching">
      {analysis.beginner_explanation && <p>{analysis.beginner_explanation}</p>}

      <h4>Coaching dimensions</h4>
      <div className="mm-coding-dims">
        <DimScore label="Correctness" value={analysis.correctness_coaching_score} />
        <DimScore label="Approach" value={analysis.approach_score} />
        <DimScore label="Complexity" value={analysis.complexity_score} />
        <DimScore label="Code quality" value={analysis.code_quality_score} />
        <DimScore label="Edge cases" value={analysis.edge_case_score} />
      </div>

      {(analysis.detected_approach || analysis.time_complexity || analysis.space_complexity) && (
        <p className="mm-coding__muted">
          {analysis.detected_approach ? `Approach: ${analysis.detected_approach}` : null}
          {analysis.detected_approach && (analysis.time_complexity || analysis.space_complexity)
            ? ' · '
            : null}
          {[analysis.time_complexity, analysis.space_complexity].filter(Boolean).join(' / ')}
        </p>
      )}

      {analysis.constraint_awareness && (
        <div className="mm-coding-constraints">
          <h4>Constraint awareness</h4>
          <ul>
            <li>
              Understood constraints:{' '}
              {String(analysis.constraint_awareness.understood_constraints)}
            </li>
            <li>
              Complexity appropriate:{' '}
              {String(analysis.constraint_awareness.complexity_appropriate_for_constraints)}
            </li>
            <li>
              Missed scalable approach:{' '}
              {String(analysis.constraint_awareness.missed_scalable_approach)}
            </li>
          </ul>
          {analysis.constraint_awareness.notes && <p>{analysis.constraint_awareness.notes}</p>}
        </div>
      )}

      {!!analysis.strengths?.length && (
        <>
          <h4>Strengths</h4>
          <ul>
            {analysis.strengths.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </>
      )}

      {!!analysis.learning_gaps?.length && (
        <>
          <h4>Learning gaps</h4>
          <ul>
            {analysis.learning_gaps.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </>
      )}

      {!!analysis.next_learning_focus?.length && (
        <>
          <h4>Next focus</h4>
          <ul>
            {analysis.next_learning_focus.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </>
      )}

      {!!analysis.mistakes?.length && (
        <>
          <h4>Mistakes</h4>
          <ul>
            {analysis.mistakes.map((m, i) => (
              <li key={i}>{m.beginner_explanation || m.explanation || m.type}</li>
            ))}
          </ul>
        </>
      )}

      {ba && (ba.name || ba.explanation) && (
        <div className="mm-coding-better">
          <h4>Better approach</h4>
          {ba.name && <p><strong>{ba.name}</strong></p>}
          {ba.explanation && <p>{ba.explanation}</p>}
          <p className="mm-coding__muted">
            {[ba.time_complexity, ba.space_complexity].filter(Boolean).join(' · ')}
          </p>
        </div>
      )}
    </div>
  );
}

function ResultsView({
  submission,
  analysis,
  showCoaching,
  setShowCoaching,
  error,
  onDone,
  onHistory,
  onPracticeAgain,
}) {
  return (
    <div className="mm-coding mm-coding--results">
      <header className="mm-coding-results__hero">
        <p className="mm-coding-eyebrow">Official result</p>
        <h2>
          {submission.problem_title || submission.assessment_title || 'Coding assessment'}
        </h2>
        {[submission.company_name, submission.role_name].filter(Boolean).length > 0 && (
          <p className="mm-coding__muted">
            {[submission.company_name, submission.role_name].filter(Boolean).join(' · ')}
          </p>
        )}
        <div className="mm-coding-score-row">
          <ScorePill label="Official score" value={submission.official_score} tone="official" />
          <ScorePill
            label="Coaching score"
            value={analysis?.overall_coaching_score}
            tone="coach"
          />
        </div>
        <p className="mm-coding__muted">
          Verdict: <strong>{submission.verdict || '—'}</strong>
          {' · '}
          Public {submission.public_passed_count}/{submission.public_total_count}
          {' · '}
          Hidden {submission.hidden_passed_count}/{submission.hidden_total_count}
        </p>
        <p className="mm-coding-note">
          Official grade comes only from weighted tests. Coaching never changes your score.
        </p>
      </header>

      <section className="mm-coding-panel">
        <h3>Test outcomes</h3>
        <ul className="mm-coding-tests">
          {(submission.test_results || []).map((t) => (
            <li key={t.index} className={t.status === 'passed' ? 'is-pass' : 'is-fail'}>
              <span>
                Case {t.index + 1}
                {t.hidden ? ' (hidden)' : ''}
              </span>
              <span>{t.status}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mm-coding-panel">
        <button
          type="button"
          className="mm-coding-btn mm-coding-btn--ghost"
          onClick={() => setShowCoaching((v) => !v)}
        >
          {showCoaching ? 'Hide coaching' : 'Show coaching analysis'}
        </button>
        {showCoaching && <CoachingPanel analysis={analysis} />}
      </section>

      {error && (
        <p className="mm-coding__error" role="alert">
          {error}
        </p>
      )}

      <div className="mm-coding-actions">
        <button type="button" className="mm-coding-btn" onClick={onDone}>
          Done
        </button>
        <button type="button" className="mm-coding-btn mm-coding-btn--ghost" onClick={onHistory}>
          Past results
        </button>
        <button type="button" className="mm-coding-btn mm-coding-btn--ghost" onClick={onPracticeAgain}>
          Practice again
        </button>
      </div>
    </div>
  );
}

export default function CodingAssessment() {
  const session = useToolSession();
  const [phase, setPhase] = useState('boot'); // boot | pick | history | ide | results | error
  const [error, setError] = useState('');
  const [catalog, setCatalog] = useState([]);
  const [history, setHistory] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('python');
  const [source, setSource] = useState('');
  const [busy, setBusy] = useState('');
  const [runResult, setRunResult] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [showCoaching, setShowCoaching] = useState(false);
  const draftTimer = useRef(null);
  const startedRef = useRef(false);

  const skillHint = useMemo(() => (session?.skill || '').trim(), [session?.skill]);
  const companyFilter = useMemo(() => {
    const mode = (session?.mode || '').trim().toLowerCase();
    // mode used as company_key when launched from company intel/prep
    if (mode && !['aptitude', 'skill', 'placement', 'live', 'hr', 'projects'].includes(mode)) {
      return mode;
    }
    return '';
  }, [session?.mode]);

  const langs = attempt?.allowed_languages?.length
    ? attempt.allowed_languages
    : assessment?.allowed_languages || ['python'];

  const loadProblem = useCallback(async (attemptRow, problemId, lang) => {
    const p = await studentApi.get(
      `/api/coding/attempts/${attemptRow.id}/problems/${problemId}`,
    );
    setProblem(p);
    const starter = p.starter_code_by_language?.[lang] || '';
    let next = starter;
    try {
      const local = localStorage.getItem(DRAFT_KEY(attemptRow.id, problemId, lang));
      if (local) next = local;
    } catch {
      /* ignore */
    }
    try {
      const remote = await studentApi.get(
        `/api/coding/attempts/${attemptRow.id}/problems/${problemId}/draft?language=${encodeURIComponent(lang)}`,
      );
      if (remote?.source_code) next = remote.source_code;
    } catch {
      /* no draft yet */
    }
    setSource(next);
    return p;
  }, []);

  const loadHistory = useCallback(async () => {
    const q = companyFilter
      ? `/api/coding/submissions?limit=15&company_key=${encodeURIComponent(companyFilter)}`
      : '/api/coding/submissions?limit=15';
    const data = await studentApi.get(q);
    setHistory(data?.items || []);
  }, [companyFilter]);

  const openSubmission = useCallback(async (submissionId) => {
    setBusy('history');
    setError('');
    try {
      const done = await studentApi.get(`/api/coding/submissions/${submissionId}`);
      setSubmission(done);
      let a = null;
      try {
        a = await studentApi.get(`/api/coding/submissions/${submissionId}/analysis`);
      } catch {
        a = { analysis_status: done.analysis_status, submission_id: submissionId };
      }
      setAnalysis(a);
      setShowCoaching(false);
      setPhase('results');
    } catch (err) {
      setError(err?.message || 'Could not load submission.');
    } finally {
      setBusy('');
    }
  }, []);

  const startAssessment = useCallback(
    async (slug) => {
      setBusy('start');
      setError('');
      setRunResult(null);
      setSubmission(null);
      setAnalysis(null);
      try {
        const meta = await studentApi.get(`/api/coding/assessments/${slug}`);
        setAssessment(meta);
        const started = await studentApi.post(`/api/coding/assessments/${slug}/start`);
        setAttempt(started);
        const firstLang = (started.allowed_languages || ['python'])[0] || 'python';
        setLanguage(firstLang);
        const firstProblem = started.problems?.[0];
        if (!firstProblem) throw new Error('Assessment has no problems.');
        await loadProblem(started, firstProblem.problem_id, firstLang);
        setPhase('ide');
      } catch (err) {
        setError(err?.message || 'Could not start coding assessment.');
        setPhase('error');
        session?.onError?.({ message: err?.message || 'Coding start failed', status: err?.status });
      } finally {
        setBusy('');
      }
    },
    [loadProblem, session],
  );

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    (async () => {
      try {
        setPhase('boot');
        const listPath = companyFilter
          ? `/api/coding/assessments?company_key=${encodeURIComponent(companyFilter)}`
          : '/api/coding/assessments';
        const listed = await studentApi.get(listPath);
        const items = listed?.items || [];
        setCatalog(items);
        try {
          await loadHistory();
        } catch {
          setHistory([]);
        }

        // Direct slug from skill (e.g. practice-two-sum)
        if (skillHint) {
          const bySlug = items.find((x) => x.slug === skillHint);
          if (bySlug || !companyFilter) {
            await startAssessment(skillHint);
            return;
          }
        }

        // Company-driven: auto-start top ranked if only one, else picker
        if (items.length === 1) {
          await startAssessment(items[0].slug);
          return;
        }
        if (items.length === 0 && !companyFilter) {
          await startAssessment(DEFAULT_ASSESSMENT);
          return;
        }
        setPhase('pick');
      } catch (err) {
        // Fallback: try default slug directly
        try {
          await startAssessment(skillHint || DEFAULT_ASSESSMENT);
        } catch {
          setError(err?.message || 'Could not load coding assessments.');
          setPhase('error');
        }
      }
    })();
  }, [companyFilter, skillHint, loadHistory, startAssessment]);

  useEffect(() => {
    if (!attempt || !problem || phase !== 'ide') return undefined;
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(async () => {
      try {
        localStorage.setItem(DRAFT_KEY(attempt.id, problem.problem_id, language), source);
      } catch {
        /* ignore */
      }
      try {
        await studentApi.put(
          `/api/coding/attempts/${attempt.id}/problems/${problem.problem_id}/draft`,
          { language_code: language, source_code: source },
        );
      } catch {
        /* best-effort */
      }
    }, 900);
    return () => {
      if (draftTimer.current) clearTimeout(draftTimer.current);
    };
  }, [source, language, attempt, problem, phase]);

  async function onLanguageChange(nextLang) {
    if (!attempt || !problem || nextLang === language) return;
    setLanguage(nextLang);
    await loadProblem(attempt, problem.problem_id, nextLang);
  }

  async function handleRun() {
    if (!attempt || !problem || busy) return;
    setBusy('run');
    setRunResult(null);
    setError('');
    try {
      const queued = await studentApi.post('/api/coding/runs', {
        attempt_id: attempt.id,
        problem_id: problem.problem_id,
        language_code: language,
        source_code: source,
      });
      const done = await pollUntil(
        () => studentApi.get(`/api/coding/runs/${queued.id}`),
        {
          isDone: (r) =>
            r &&
            (r.execution_status === 'completed' || r.execution_status === 'system_error'),
          maxMs: 45000,
        },
      );
      if (done?.execution_status === 'system_error') {
        throw new Error(
          'Run failed (system error). Use Python in local/dev, or configure JUDGE0_BASE_URL and restart the coding worker.',
        );
      }
      setRunResult(done);
    } catch (err) {
      setError(err?.message || 'Run failed.');
    } finally {
      setBusy('');
    }
  }

  async function handleSubmit() {
    if (!attempt || !problem || busy) return;
    if (!window.confirm('Submit for official scoring? This uses hidden tests and ends the attempt.')) {
      return;
    }
    setBusy('submit');
    setError('');
    setAnalysis(null);
    setShowCoaching(false);
    try {
      const queued = await studentApi.post('/api/coding/submissions', {
        attempt_id: attempt.id,
        problem_id: problem.problem_id,
        language_code: language,
        source_code: source,
      });
      const done = await pollUntil(
        () => studentApi.get(`/api/coding/submissions/${queued.id}`),
        {
          isDone: (r) =>
            r &&
            (r.execution_status === 'completed' || r.execution_status === 'system_error'),
          maxMs: 60000,
        },
      );
      if (done?.execution_status === 'system_error') {
        throw new Error(
          done?.error_message ||
            done?.verdict ||
            'Submission failed on the server (execution system error). For local/dev use Python, or set JUDGE0_BASE_URL and restart the coding worker.',
        );
      }
      setSubmission(done);
      setPhase('results');

      const a = await pollUntil(
        () => studentApi.get(`/api/coding/submissions/${queued.id}/analysis`),
        {
          isDone: (r) =>
            r &&
            (r.analysis_status === 'ready' ||
              r.analysis_status === 'failed' ||
              r.analysis_status === 'skipped'),
          maxMs: 60000,
        },
      );
      setAnalysis(a);
      try {
        await loadHistory();
      } catch {
        /* ignore */
      }

      // Coding scores are read by HOD/TPO from coding_submissions (not Week-1 roadmap).
      // Still notify host session for UX; do not require roadmap tool_code.
      await session?.persistResult?.({
        toolCode: session.toolCode || 'coding',
        result: {
          score: done?.official_score ?? null,
          label: done?.verdict || 'Coding submission',
          assessment: assessment?.slug,
          company_key: assessment?.company_key,
          official_score: done?.official_score,
          verdict: done?.verdict,
          submission_id: done?.id,
          raw: {
            source: 'coding_submission',
            official_score: done?.official_score,
            verdict: done?.verdict,
            submission_id: done?.id,
          },
        },
      });
    } catch (err) {
      setError(err?.message || 'Submit failed.');
    } finally {
      setBusy('');
    }
  }

  if (phase === 'boot') {
    return (
      <div className="mm-coding">
        <p className="mm-coding__muted">Starting coding assessment…</p>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="mm-coding">
        <p className="mm-coding__error" role="alert">
          {error}
        </p>
        <button type="button" className="mm-coding-btn" onClick={() => session?.returnHome?.()}>
          Back
        </button>
      </div>
    );
  }

  if (phase === 'pick' || phase === 'history') {
    return (
      <div className="mm-coding mm-coding--pick">
        <header className="mm-coding-pick__hero">
          <p className="mm-coding-eyebrow">
            {companyFilter
              ? `Company coding · ${companyFilter}`
              : 'Coding practice'}
          </p>
          <h2>{phase === 'history' ? 'Past results' : 'Choose an assessment'}</h2>
          <p className="mm-coding__blurb">
            Ranked by placement-pattern relevance. Official scores always come from tests — never AI.
          </p>
        </header>

        <div className="mm-coding-tabs">
          <button
            type="button"
            className={phase === 'pick' ? 'is-active' : ''}
            onClick={() => setPhase('pick')}
          >
            Assessments
          </button>
          <button
            type="button"
            className={phase === 'history' ? 'is-active' : ''}
            onClick={() => setPhase('history')}
          >
            Past results
          </button>
        </div>

        {phase === 'pick' && (
          <ul className="mm-coding-catalog">
            {catalog.length === 0 && (
              <li className="mm-coding__muted">No assessments for this company yet.</li>
            )}
            {catalog.map((a) => (
              <li key={a.id}>
                <div>
                  <strong>{a.title}</strong>
                  <p className="mm-coding__muted">
                    {[a.company_name, a.role_name, a.relevance_label].filter(Boolean).join(' · ')}
                  </p>
                  {a.why_this_matters && <p>{a.why_this_matters}</p>}
                  <p className="mm-coding__muted">
                    {[a.topic, a.pattern, a.difficulty, `${a.duration_minutes}m`]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
                <button
                  type="button"
                  className="mm-coding-btn"
                  disabled={!!busy}
                  onClick={() => startAssessment(a.slug)}
                >
                  Start
                </button>
              </li>
            ))}
          </ul>
        )}

        {phase === 'history' && (
          <ul className="mm-coding-catalog">
            {history.length === 0 && (
              <li className="mm-coding__muted">No past submissions yet.</li>
            )}
            {history.map((h) => (
              <li key={h.id}>
                <div>
                  <strong>{h.problem_title || h.assessment_title || `Submission #${h.id}`}</strong>
                  <p className="mm-coding__muted">
                    {[h.company_name, h.role_name, h.verdict].filter(Boolean).join(' · ')}
                    {h.official_score != null ? ` · score ${h.official_score}` : ''}
                  </p>
                  <p className="mm-coding__muted">
                    {h.submitted_at ? new Date(h.submitted_at).toLocaleString() : ''}
                  </p>
                </div>
                <button
                  type="button"
                  className="mm-coding-btn mm-coding-btn--ghost"
                  disabled={busy === 'history'}
                  onClick={() => openSubmission(h.id)}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p className="mm-coding__error" role="alert">
            {error}
          </p>
        )}

        <div className="mm-coding-actions">
          <button type="button" className="mm-coding-btn mm-coding-btn--ghost" onClick={() => session?.returnHome?.()}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'results' && submission) {
    return (
      <ResultsView
        submission={submission}
        analysis={analysis}
        showCoaching={showCoaching}
        setShowCoaching={setShowCoaching}
        error={error}
        onDone={() => session?.returnHome?.()}
        onHistory={async () => {
          try {
            await loadHistory();
          } catch {
            /* ignore */
          }
          setPhase('history');
        }}
        onPracticeAgain={() => {
          if (assessment?.slug) startAssessment(assessment.slug);
          else setPhase('pick');
        }}
      />
    );
  }

  const why = attempt?.why_this_matters || assessment?.why_this_matters;
  const blurb = attempt?.placement_blurb || assessment?.placement_blurb;

  return (
    <div className="mm-coding mm-coding--ide">
      <aside className="mm-coding-problem">
        <p className="mm-coding-eyebrow">
          {[
            attempt?.company_name || assessment?.company_name,
            attempt?.role_name || assessment?.role_name,
            attempt?.relevance_label || assessment?.relevance_label,
          ]
            .filter(Boolean)
            .join(' · ') || 'Practice'}
        </p>
        <h2>{problem?.title}</h2>
        {blurb && <p className="mm-coding__blurb">{blurb}</p>}
        {why && <p className="mm-coding__why">{why}</p>}
        <div className="mm-coding-meta">
          <span>{problem?.difficulty}</span>
          {problem?.topic && <span>{problem.topic}</span>}
          {problem?.pattern && <span>{problem.pattern}</span>}
          {attempt?.seconds_remaining != null && (
            <span>{Math.max(0, Math.floor(attempt.seconds_remaining / 60))}m left</span>
          )}
        </div>
        <pre className="mm-coding-statement">{problem?.description}</pre>
        {problem?.constraints_text && (
          <>
            <h3>Constraints</h3>
            <pre className="mm-coding-statement">{problem.constraints_text}</pre>
          </>
        )}
        {!!problem?.examples?.length && (
          <>
            <h3>Examples</h3>
            {problem.examples.map((ex, i) => (
              <div key={i} className="mm-coding-example">
                <div>
                  <strong>Input</strong>
                  <pre>{ex.input}</pre>
                </div>
                <div>
                  <strong>Output</strong>
                  <pre>{ex.output}</pre>
                </div>
                {ex.explanation && <p>{ex.explanation}</p>}
              </div>
            ))}
          </>
        )}
        <button
          type="button"
          className="mm-coding-btn mm-coding-btn--ghost mm-coding-btn--ink"
          onClick={async () => {
            try {
              await loadHistory();
            } catch {
              /* ignore */
            }
            setPhase('history');
          }}
        >
          Past results
        </button>
      </aside>

      <section className="mm-coding-editor-pane">
        <div className="mm-coding-toolbar">
          <label>
            Language
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              disabled={!!busy}
            >
              {langs.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <div className="mm-coding-actions">
            <button
              type="button"
              className="mm-coding-btn mm-coding-btn--ghost"
              onClick={handleRun}
              disabled={!!busy}
            >
              {busy === 'run' ? 'Running…' : 'Run code'}
            </button>
            <button
              type="button"
              className="mm-coding-btn"
              onClick={handleSubmit}
              disabled={!!busy}
            >
              {busy === 'submit' ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </div>

        <div className="mm-coding-editor">
          <Editor
            height="100%"
            language={LANG_MONACO[language] || 'python'}
            theme="vs-dark"
            value={source}
            onChange={(v) => setSource(v || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {error && (
          <p className="mm-coding__error" role="alert">
            {error}
          </p>
        )}

        {runResult && (
          <div className="mm-coding-runout">
            <strong>
              Run: {runResult.verdict || runResult.execution_status} · {runResult.passed_count}/
              {runResult.total_count} public
            </strong>
            <ul>
              {(runResult.cases || []).map((c) => (
                <li key={c.index}>
                  Case {c.index + 1}: {c.status}
                  {c.error_type ? ` (${c.error_type})` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
