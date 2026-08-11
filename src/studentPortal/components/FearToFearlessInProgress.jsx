import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Lock, Sparkles } from 'lucide-react';
import { studentPaths } from '../paths';
import '../styles/in-progress.css';

const API_TIPS = [
  {
    title: 'A private 6-week journey',
    body: 'Fear → Fearless turns placement anxiety into a weekly plan — not a score, not a leaderboard.',
  },
  {
    title: 'TPO and HOD never see this',
    body: 'Your answers stay with you. Campus staff cannot open this space, even from their portal.',
  },
  {
    title: 'Concrete actions, not pep talks',
    body: 'Each fear gets widgets and weekly steps — record a project pitch, practice English, fix one gap.',
  },
  {
    title: 'You can do this',
    body: 'Most students are not “behind”. They are carrying a fear nobody asked about. This is that conversation.',
  },
];

const BUILD_STAGES = [
  'Saving what you just shared — privately',
  'Reading the fear behind your words',
  'Matching actions to your campus reality',
  'Writing your personal week-1 plan',
];

const WEEKLY_STAGES = [
  'Saving this week’s honesty',
  'Updating your fear score',
  'Choosing next week’s focus for you',
];

function firstName(session) {
  const raw = String(session?.name || session?.first_name || '').trim();
  if (!raw) return 'there';
  return raw.split(/\s+/)[0];
}

function clipNote(text, max = 92) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (!t) return '';
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

function buildTips(studentNote) {
  const quote = clipNote(studentNote);
  return [
    {
      title: quote ? 'We heard you — not a template' : 'This is being built for you',
      body: quote
        ? `You wrote “${quote}”. MentorMuni is using that line to shape your plan — not a generic checklist.`
        : 'Your answers are being turned into a 6-week path that fits you, not every student on campus.',
    },
    {
      title: 'Only you will see this',
      body: 'TPO and HOD cannot open Fear → Fearless. What you shared stays between you and this space.',
    },
    {
      title: 'Week 1 will be concrete',
      body: 'Expect real next steps — one speaking drill, one project story, one gap to close — not a pep talk.',
    },
    {
      title: 'Fear → Fearless is a journey',
      body: 'Today we lock your starting point. Each week you check in, the plan tightens around what still feels heavy.',
    },
  ];
}

export default function FearToFearlessInProgress({
  session,
  variant = 'api',
  studentNote = '',
}) {
  const personalized = variant === 'building' || variant === 'weekly';
  const tips = useMemo(
    () => (personalized ? buildTips(studentNote) : API_TIPS),
    [personalized, studentNote]
  );
  const stages = variant === 'weekly' ? WEEKLY_STAGES : BUILD_STAGES;
  const [tipIndex, setTipIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const tip = tips[tipIndex % tips.length];
  const name = firstName(session);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTipIndex((n) => (n + 1) % tips.length);
    }, 3400);
    return () => window.clearInterval(id);
  }, [tips.length]);

  useEffect(() => {
    if (!personalized) return undefined;
    const id = window.setInterval(() => {
      setStageIndex((n) => Math.min(stages.length - 1, n + 1));
    }, 2200);
    return () => window.clearInterval(id);
  }, [personalized, stages.length]);

  const title =
    variant === 'building'
      ? `${name}, we’re building this for you`
      : variant === 'weekly'
        ? `${name}, updating your personal week`
        : `${name}, while this loads…`;

  const lead =
    variant === 'building'
      ? 'Not a loading spinner for its own sake — MentorMuni is reading what you shared and assembling a Fear → Fearless plan that belongs to you.'
      : variant === 'weekly'
        ? 'We’re folding this check-in into your private 6-week plan so next week’s actions match where you actually are.'
        : 'Meet Fear → Fearless — your private AI coaching journey from placement fear to interview confidence.';

  return (
    <div
      className={`mm-wait mm-wait--student${personalized ? ' mm-wait--personal' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mm-wait__card">
        <p className="mm-wait__overline">
          <Lock size={13} strokeWidth={2.2} aria-hidden />
          {personalized ? 'Built only for you · private' : 'Private to you'}
        </p>
        <h2 className="mm-wait__title">{title}</h2>
        <p className="mm-wait__lead">{lead}</p>

        {personalized ? (
          <ol className="mm-wait__stages">
            {stages.map((label, i) => {
              const done = i < stageIndex;
              const current = i === stageIndex;
              return (
                <li
                  key={label}
                  className={`mm-wait__stage${done ? ' is-done' : ''}${current ? ' is-on' : ''}`}
                >
                  <span className="mm-wait__stage-mark" aria-hidden>
                    {done ? <Check size={12} strokeWidth={2.6} /> : <span />}
                  </span>
                  {label}
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="mm-wait__journey" aria-hidden>
            <span>Fear 8</span>
            <span className="mm-wait__arrow">→</span>
            <span>5</span>
            <span className="mm-wait__arrow">→</span>
            <span>2</span>
            <span className="mm-wait__arrow">→</span>
            <span className="mm-wait__zero">Fearless 0</span>
          </div>
        )}

        <div key={tip.title} className="mm-wait__tip">
          <Sparkles size={16} strokeWidth={2} aria-hidden />
          <div>
            <strong>{tip.title}</strong>
            <p>{tip.body}</p>
          </div>
        </div>

        <div className="mm-wait__dots" aria-hidden>
          {tips.map((item, i) => (
            <span key={item.title} className={i === tipIndex ? 'is-on' : ''} />
          ))}
        </div>

        <div className="mm-wait__row">
          <span className="mm-wait__spinner" aria-hidden />
          <span className="mm-wait__status">
            {personalized
              ? stages[stageIndex] || 'Getting your personal plan ready'
              : 'Getting your page ready'}
          </span>
          {variant === 'api' ? (
            <Link className="mm-wait__cta" to={studentPaths.fearToFearless}>
              Open Fear → Fearless
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
