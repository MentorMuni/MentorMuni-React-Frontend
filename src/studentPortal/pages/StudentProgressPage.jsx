import { useCallback, useEffect, useMemo, useState } from 'react';
import { Clock, Loader2, RefreshCw, Sparkles, Target, Trophy, AlertTriangle } from 'lucide-react';
import { useStudentShell } from '../shellContext';
import {
  fetchProgress,
  generateProgressLearningTopics,
  StudentApiError,
} from '../roadmap/roadmapApi';
import { ToolIcon } from '../roadmap/toolIcons';

import '../styles/progress.css';

const PILLARS = [
  { id: 'aptitude', label: 'Aptitude', hint: 'Quant · logical · verbal' },
  { id: 'skills', label: 'Skills', hint: 'Core tech · projects · skill mocks' },
  { id: 'interview', label: 'Interview', hint: 'Craft · communication · HR' },
];

function TagList({ items, tone = 'neutral', empty = 'Nothing here yet.' }) {
  if (!items?.length) return <p className="stu-progress__empty">{empty}</p>;
  return (
    <ul className={`stu-progress__tags is-${tone}`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function TopicCard({ topic }) {
  return (
    <li className="stu-progress__topic">
      <div className="stu-progress__topic-top">
        <h4>{topic.topic}</h4>
        <span className={`stu-progress__pri is-p${topic.priority || 2}`}>P{topic.priority || 2}</span>
      </div>
      {topic.why ? <p className="stu-progress__topic-why">{topic.why}</p> : null}
      <div className="stu-progress__topic-meta">
        {topic.nearby ? <span>Nearby: {topic.nearby}</span> : null}
        <span>
          <Clock size={12} strokeWidth={2.2} aria-hidden />
          {topic.suggested_minutes || 45} min
        </span>
      </div>
    </li>
  );
}

export default function StudentProgressPage() {
  const { refreshStreak } = useStudentShell();

  const [progress, setProgress] = useState(null);
  const [topics, setTopics] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [topicError, setTopicError] = useState('');
  const [generating, setGenerating] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchProgress();
      setProgress(data);
      if (data?.learning_topics) setTopics(data.learning_topics);
      setLoadError('');
    } catch (err) {
      setLoadError(err?.message || 'Could not load progress');
    }
    refreshStreak();
  }, [refreshStreak]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onFocus = () => refreshStreak();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [refreshStreak]);

  const handleGenerate = useCallback(async () => {
    setTopicError('');
    setGenerating(true);
    try {
      const data = await generateProgressLearningTopics();
      setTopics(data);
    } catch (err) {
      const msg =
        err instanceof StudentApiError
          ? err.message
          : err?.message || 'Could not generate learning topics.';
      setTopicError(msg);
    } finally {
      setGenerating(false);
    }
  }, []);

  const activity = progress?.activity;
  const analysis = progress?.analysis;
  const strengths = analysis?.top_strengths || [];
  const weaknesses = analysis?.top_weaknesses || [];
  const doneSteps = activity?.completed_steps || [];

  const orderedPillars = useMemo(() => {
    const order = topics?.focus_order?.length ? topics.focus_order : PILLARS.map((p) => p.id);
    return order
      .map((id) => PILLARS.find((p) => p.id === id))
      .filter(Boolean);
  }, [topics]);

  return (
    <main className="stu-main">
          <header className="stu-progress__hero">
            <div>
              <p className="stu-progress__eyebrow">
                <Target size={13} strokeWidth={2.2} aria-hidden /> Progress
              </p>
              <h1 className="stu-progress__title">Your placement signal</h1>
              <p className="stu-progress__sub">
                What you’ve finished, where you’re strong, where you’re weak — then AI topics to close
                the gaps across aptitude, skills, and interview.
              </p>
            </div>
            <div className="stu-progress__score">
              <span className="stu-progress__score-num">
                {analysis?.overall_score != null ? Math.round(analysis.overall_score) : '—'}
              </span>
              <span className="stu-progress__score-unit">
                {analysis?.overall_score != null ? '%' : ''}
              </span>
              <p>Readiness so far</p>
            </div>
          </header>

          {loadError ? (
            <p className="stu-alert stu-alert--bad" role="alert">
              {loadError}
            </p>
          ) : null}

          <section className="stu-card stu-progress__section">
            <header className="stu-card__head">
              <div>
                <h2 className="stu-card__title">What you did till now</h2>
                <p className="stu-card__sub">
                  {activity
                    ? `${activity.completed_count} of ${activity.total_count} baseline checks finished`
                    : 'Loading activity…'}
                </p>
              </div>
            </header>

            {!doneSteps.length ? (
              <p className="stu-progress__empty">
                No baseline checks finished yet. Complete today’s step on Home — Progress tracks
                Week-1 roadmap scores (Practice reps stay on Practice).
              </p>
            ) : (
              <ol className="stu-progress__done-list">
                {doneSteps.map((step) => (
                  <li key={step.tool_code} className="stu-progress__done-row">
                    <span className="stu-progress__done-icon" aria-hidden>
                      <ToolIcon toolCode={step.tool_code} size={16} />
                    </span>
                    <div className="stu-progress__done-body">
                      <strong>{step.title}</strong>
                      <span>
                        {step.label || 'Completed'}
                        {step.completed_at
                          ? ` · ${new Date(step.completed_at).toLocaleDateString()}`
                          : ''}
                      </span>
                    </div>
                    <span className="stu-progress__done-score">
                      {step.score != null ? `${Math.round(step.score)}%` : '—'}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <div className="stu-progress__split">
            <section className="stu-card stu-progress__section">
              <header className="stu-card__head">
                <div>
                  <h2 className="stu-card__title">
                    <Trophy size={16} strokeWidth={2.2} aria-hidden /> Your strengths
                  </h2>
                  <p className="stu-card__sub">Protect these — keep light practice going.</p>
                </div>
              </header>
              <TagList items={strengths} tone="good" empty="Strengths appear after scored checks." />
            </section>

            <section className="stu-card stu-progress__section">
              <header className="stu-card__head">
                <div>
                  <h2 className="stu-card__title">
                    <AlertTriangle size={16} strokeWidth={2.2} aria-hidden /> Your weaknesses
                  </h2>
                  <p className="stu-card__sub">These drive the learning topics below.</p>
                </div>
              </header>
              <TagList items={weaknesses} tone="bad" empty="Weaknesses appear after scored checks." />
            </section>
          </div>

          <section className="stu-card stu-progress__section stu-progress__ai">
            <header className="stu-card__head">
              <div>
                <h2 className="stu-card__title">
                  <Sparkles size={16} strokeWidth={2.2} aria-hidden /> Topics to learn next
                </h2>
                <p className="stu-card__sub">
                  AI builds aptitude, skills, and interview topics from your weak points and nearby
                  areas.
                </p>
              </div>
              <button
                type="button"
                className="stu-btn stu-btn--soft"
                onClick={handleGenerate}
                disabled={generating || !(activity?.completed_count > 0)}
              >
                {generating ? (
                  <>
                    <Loader2 size={14} className="stu-spin" aria-hidden /> Generating…
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} aria-hidden />
                    {topics ? 'Refresh topics' : 'Generate with AI'}
                  </>
                )}
              </button>
            </header>

            {topicError ? (
              <p className="stu-alert stu-alert--bad" role="alert">
                {topicError}
              </p>
            ) : null}

            {!topics && !generating ? (
              <p className="stu-progress__empty">
                {activity?.completed_count > 0
                  ? 'Generate topics once you have strengths and weaknesses from completed checks.'
                  : 'Complete at least one check first, then generate topics.'}
              </p>
            ) : null}

            {topics?.coach_summary ? (
              <p className="stu-progress__coach">{topics.coach_summary}</p>
            ) : null}

            {topics ? (
              <div className="stu-progress__pillars">
                {orderedPillars.map((pillar) => {
                  const list = topics.learning_topics?.[pillar.id] || [];
                  return (
                    <div key={pillar.id} className="stu-progress__pillar">
                      <header>
                        <h3>{pillar.label}</h3>
                        <p>{pillar.hint}</p>
                      </header>
                      {list.length ? (
                        <ul className="stu-progress__topic-list">
                          {list.map((t) => (
                            <TopicCard key={`${pillar.id}-${t.topic}`} topic={t} />
                          ))}
                        </ul>
                      ) : (
                        <p className="stu-progress__empty">No topics in this pillar yet.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </section>
    </main>
  );
}
