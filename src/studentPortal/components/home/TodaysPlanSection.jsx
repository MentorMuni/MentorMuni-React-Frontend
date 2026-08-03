import { useMemo, useState } from 'react';
import { Check, Clock, Code2, FileText, Mic, Play, Zap } from 'lucide-react';

const ICONS = { resume: FileText, aptitude: Zap, mock: Mic, code: Code2 };

const SEED = [
  {
    id: 1,
    kind: 'resume',
    title: 'Resume fix: quantify your impact',
    meta: 'Rewrite 3 bullet points with numbers',
    minutes: 15,
    lift: 1.5,
    done: false,
  },
  {
    id: 2,
    kind: 'aptitude',
    title: 'Aptitude practice set',
    meta: '20 questions · Quant & reasoning',
    minutes: 18,
    lift: 1.5,
    done: false,
  },
  {
    id: 3,
    kind: 'mock',
    title: 'AI mock interview — technical',
    meta: '5 questions · Java fundamentals',
    minutes: 10,
    lift: 1,
    done: false,
  },
];

export default function TodaysPlanSection({ currentReadiness = 47 }) {
  const [tasks, setTasks] = useState(SEED);

  const { doneCount, remainingMin, projected } = useMemo(() => {
    const open = tasks.filter((t) => !t.done);
    return {
      doneCount: tasks.length - open.length,
      remainingMin: open.reduce((s, t) => s + t.minutes, 0),
      projected: Math.round(
        currentReadiness + tasks.reduce((s, t) => s + (t.done ? 0 : t.lift), 0)
      ),
    };
  }, [tasks, currentReadiness]);

  const allDone = doneCount === tasks.length;
  const pct = Math.round((doneCount / tasks.length) * 100);

  const toggle = (id) =>
    setTasks((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <section className="stu-card stu-plan">
      <header className="stu-card__head">
        <div>
          <h2 className="stu-card__title">Today&apos;s plan</h2>
          <p className="stu-card__sub">
            {allDone
              ? 'All done — come back tomorrow for a fresh set.'
              : `${tasks.length - doneCount} left · about ${remainingMin} min`}
          </p>
        </div>
        <span className="stu-chip stu-chip--soft">
          {doneCount}/{tasks.length}
        </span>
      </header>

      <div className="stu-plan__progress" aria-hidden>
        <span className="stu-plan__progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <ul className="stu-plan__list">
        {tasks.map((task) => {
          const Icon = ICONS[task.kind] || Zap;
          return (
            <li key={task.id} className={`stu-task${task.done ? ' is-done' : ''}`}>
              {/* The tick is rendered only when done rather than hidden with
                  colour — the global stylesheet overrides `color` here. */}
              <button
                className="stu-task__check"
                onClick={() => toggle(task.id)}
                aria-pressed={task.done}
                aria-label={`${task.done ? 'Mark incomplete' : 'Mark complete'}: ${task.title}`}
              >
                {task.done ? <Check size={13} strokeWidth={3} aria-hidden /> : null}
              </button>

              <span className={`stu-task__icon stu-task__icon--${task.kind}`} aria-hidden>
                <Icon size={16} strokeWidth={1.9} />
              </span>

              <span className="stu-task__body">
                <span className="stu-task__title">{task.title}</span>
                <span className="stu-task__meta">{task.meta}</span>
              </span>

              <span className="stu-task__time">
                <Clock size={12} aria-hidden />
                {task.minutes}m
              </span>

              <button className="stu-task__cta" disabled={task.done}>
                {task.done ? 'Done' : 'Start'}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="stu-plan__foot">
        <p className="stu-plan__lift">
          {allDone ? (
            <>Nice work — today added <strong>+4%</strong> to your readiness.</>
          ) : (
            <>Finish all three and you&apos;ll reach <strong>{projected}%</strong> readiness.</>
          )}
        </p>
        <button className="stu-btn stu-btn--primary" disabled={allDone}>
          <Play size={15} fill="currentColor" aria-hidden />
          {allDone ? 'Plan complete' : "Start today's plan"}
        </button>
      </div>
    </section>
  );
}
