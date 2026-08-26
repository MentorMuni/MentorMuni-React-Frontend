import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CalendarClock, Check, Loader2, Pause, Target } from 'lucide-react';
import { studentToolPath } from '../../paths';
import { PLAN_HORIZON_DAYS } from '../../daily/missionResolver';
import TimeBudgetPicker from './TimeBudgetPicker';
import MissionTaskRow from './MissionTaskRow';
import TodaysPlanSection from './TodaysPlanSection';
import '../../styles/daily-mission.css';

/**
 * The page's anchor: what to do today, on every day 1–90.
 *
 * Replaces nothing — `TodaysPlanSection` is embedded as the body during the
 * Week-1 baseline, because CollegesPage renders that component as marketing
 * artwork with frozen props and its shape cannot change.
 *
 * The mode copy matters as much as the tasks. A student three days behind is
 * told the plan moved with them, not that they owe three days of work.
 */

function modeCopy(mission) {
  switch (mission.mode) {
    case 'day0':
      return { kicker: 'Start here', sub: 'Twelve minutes to your plan.' };
    case 'baseline':
      return { kicker: 'Baseline', sub: 'One check at a time. Finish it to unlock the next.' };
    case 'awaiting_plan':
      return { kicker: 'Ready', sub: 'Your baseline is done — build the plan from it.' };
    case 'drive_sprint':
      return {
        kicker: 'Drive sprint',
        sub: mission.drive
          ? `${mission.drive.name} in ${mission.drive.daysUntil} days — this outranks the plan.`
          : 'A drive is close. This outranks the plan.',
      };
    case 'catch_up':
      return {
        kicker: 'Catching up',
        sub: `${mission.driftDays} day${mission.driftDays === 1 ? '' : 's'} behind — picking up where you left off.`,
      };
    case 'compressed':
      return {
        kicker: 'Plan compressed',
        sub: `We skipped ${mission.compressedDays.length} day${mission.compressedDays.length === 1 ? '' : 's'} and pulled the ${mission.carryOver.length} that mattered into today. Nothing is owed.`,
      };
    case 'ahead':
      return { kicker: 'Ahead of plan', sub: 'Today is already done. Here is what is next.' };
    case 'paused':
      return { kicker: 'Paused', sub: 'Your plan is on hold. One short thing if you want it.' };
    case 'complete':
      return { kicker: 'Maintenance', sub: 'Ninety days done. Keep the edge.' };
    default:
      return { kicker: 'Today', sub: 'One focused session.' };
  }
}

export default function DailyMissionSection({
  mission,
  loading,
  error,
  budgetMinutes,
  onChooseBudget,
  onCompleteTask,
  onSkipTask,
  onGeneratePlan,
  generating = false,
  // Baseline passthrough — TodaysPlanSection owns that experience.
  baselineSteps = [],
  onStartBaselineStep,
}) {
  const navigate = useNavigate();

  if (loading && !mission) {
    return (
      <section className="stu-card stu-mission" aria-busy="true">
        <p className="stu-mission__loading">
          <Loader2 size={16} strokeWidth={2} className="spin" aria-hidden focusable="false" />
          Working out today’s mission…
        </p>
      </section>
    );
  }

  if (!mission) {
    return (
      <section className="stu-card stu-mission">
        <p className="stu-alert stu-alert--bad">{error || 'Could not load today’s mission.'}</p>
      </section>
    );
  }

  const { kicker, sub } = modeCopy(mission);

  // Week-1 keeps the existing sequential experience inside the new frame.
  if (mission.mode === 'baseline') {
    return (
      <div className="stu-mission stu-mission--baseline">
        <TodaysPlanSection steps={baselineSteps} onStart={onStartBaselineStep} />
      </div>
    );
  }

  const startTask = (task) => {
    if (task.action === 'generate_plan') {
      onGeneratePlan?.();
      return;
    }
    if (task.action === 'day0') {
      navigate(studentToolPath('5_sec', { from: 'roadmap' }));
      return;
    }
    if (!task.tool_code) return;
    navigate(
      studentToolPath(task.tool_code, {
        from: 'journey',
        mission: task.task_key,
        skill: task.weak_topic_id ? task.title.replace(/^Re-test:\s*/, '') : undefined,
      })
    );
  };

  const pending = mission.tasks.filter((t) => t.status === 'todo');
  const doneCount = mission.tasks.filter((t) => t.status === 'done').length;
  const progressPct = mission.tasks.length
    ? Math.round((doneCount / mission.tasks.length) * 100)
    : 0;

  return (
    <section className="stu-card stu-mission" aria-labelledby="stu-mission-title">
      <header className="stu-card__head stu-mission__head">
        <div>
          <h2 className="stu-card__title" id="stu-mission-title">
            Today
          </h2>
          <p className="stu-card__sub">{sub}</p>
        </div>
        <span className="stu-chip stu-chip--accent stu-mission__kicker">{kicker}</span>
      </header>

      <div className="stu-mission__strip">
        {mission.planDay ? (
          <span className="stu-mission__day">
            <CalendarClock size={13} strokeWidth={2} aria-hidden focusable="false" />
            Day {mission.planDay} of {PLAN_HORIZON_DAYS}
            {mission.weekTheme ? <em> · {mission.weekTheme}</em> : null}
          </span>
        ) : null}
        <TimeBudgetPicker value={budgetMinutes} onChange={onChooseBudget} />
      </div>

      {mission.mode === 'compressed' ? (
        <p className="stu-alert stu-alert--info stu-mission__banner">
          <AlertTriangle size={14} strokeWidth={2} aria-hidden focusable="false" />
          Missed days do not stack up here. The ones we dropped that pointed at a weakness will
          come back as short re-tests.
        </p>
      ) : null}

      {mission.mode === 'paused' ? (
        <p className="stu-alert stu-alert--info stu-mission__banner">
          <Pause size={14} strokeWidth={2} aria-hidden focusable="false" />
          Your streak is held while you are paused.
        </p>
      ) : null}

      {error ? <p className="stu-alert stu-alert--bad">{error}</p> : null}

      {mission.tasks.length ? (
        <>
          <ul className="stu-mission__list">
            {mission.tasks.map((task) => (
              <MissionTaskRow
                key={task.task_key}
                task={{ ...task, pending_sync: task.pending_sync }}
                onStart={startTask}
                onToggle={(t) => (t.status === 'done' ? null : onCompleteTask?.(t))}
                onDefer={onSkipTask}
              />
            ))}
          </ul>

          <footer className="stu-mission__foot">
            <div
              className="stu-meter stu-mission__meter"
              role="img"
              aria-label={`${doneCount} of ${mission.tasks.length} done`}
            >
              <span style={{ width: `${progressPct}%` }} />
            </div>
            <p className="stu-mission__summary">
              {mission.complete ? (
                <>
                  <Check size={14} strokeWidth={2.5} aria-hidden focusable="false" />
                  Today is done. {mission.overflow?.length ? 'More is waiting tomorrow.' : 'Rest.'}
                </>
              ) : (
                <>
                  <Target size={14} strokeWidth={2} aria-hidden focusable="false" />
                  {pending.length} left · about {mission.totalMinutes} min
                </>
              )}
            </p>
          </footer>
        </>
      ) : (
        <p className="stu-mission__summary">Nothing queued today.</p>
      )}

      {generating ? (
        <p className="stu-mission__summary">
          <Loader2 size={14} strokeWidth={2} className="spin" aria-hidden focusable="false" />
          Building your plan…
        </p>
      ) : null}
    </section>
  );
}
