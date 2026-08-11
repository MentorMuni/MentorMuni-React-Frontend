import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Heart, Sparkles } from 'lucide-react';
import { canonicalToolCode, fearWeightLabel, isScoreableTool, normalizeWeek } from '../knowMe/planUtils';
import FearFactorMeter from './FearFactorMeter';

export default function FearToFearlessPlan({
  intervention,
  weeklyFearId,
  onFearChange,
  weeklyForm,
  onFormChange,
  onSubmit,
  loading,
  weeklyResult,
  celebration,
  notifications,
  onMarkAction,
  markingTool = '',
  daysRemaining = null,
  lockDays = 15,
  scoreDelta = null,
}) {
  const fears = intervention?.fears || [];
  const solutions = intervention?.solutions || [];
  const active =
    solutions.find((s) => String(s.fear_id) === String(weeklyFearId)) || solutions[0];
  const fearMeta = fears.find((f) => String(f.fear_id) === String(active?.fear_id)) || fears[0];
  const weekNumber = Math.min(6, Math.max(1, (intervention?.week_current || 0) + 1));
  const week = active
    ? normalizeWeek(active, weekNumber, {
        checkinId: intervention?.checkin_id,
        fearId: active.fear_id,
      })
    : null;
  const done = Number(weeklyForm.actions_completed) || 0;
  const total = Math.max(1, week?.days?.length || Number(weeklyForm.actions_total) || 5);
  const weight = Number(weeklyForm.self_assessment);
  const completedTools = new Set(
    (fearMeta?.completed_tools || []).map((t) => canonicalToolCode(t))
  );
  const fearFactor =
    intervention?.fear_factor ??
    Math.max(0, ...fears.map((f) => Number(f.severity_current) || 0));
  const fearInitial =
    intervention?.fear_factor_initial ??
    Math.max(0, ...fears.map((f) => Number(f.severity_initial) || 0));

  if (!week) {
    return (
      <div className="stu-ftf-plan">
        <p className="stu-ftf-plan__empty">Your personal week is still coming together. Refresh in a moment.</p>
      </div>
    );
  }

  return (
    <section className="stu-ftf-plan">
      <FearFactorMeter
        current={fearFactor}
        initial={fearInitial}
        daysRemaining={daysRemaining}
        lockDays={lockDays}
      />

      {scoreDelta && scoreDelta.before !== scoreDelta.after ? (
        <p className="stu-ftf-plan__delta" role="status">
          Fear factor moved {scoreDelta.before} → {scoreDelta.after}. That’s the work landing.
        </p>
      ) : null}

      <header className="stu-ftf-plan__hero">
        <p className="stu-ftf-plan__kicker">
          <Heart size={14} strokeWidth={2.2} aria-hidden />
          Private · Week {weekNumber} of 6 · take it to 0
        </p>
        <h3>Let’s make this fear smaller — not overnight, this week</h3>
        <p>
          You don’t need to become fearless today. Finish the suggested mock or test. The score
          drops when you actually do it.
        </p>
      </header>

      {fears.length > 1 ? (
        <label className="stu-ftf-plan__focus">
          I’m working on
          <select
            value={weeklyFearId}
            onChange={(e) => onFearChange(e.target.value, week.days.length)}
          >
            {fears.map((f) => (
              <option key={f.fear_id} value={f.fear_id}>
                {f.fear_name} · {f.severity_current}/10
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="stu-ftf-plan__focus-static">
          This week’s fear: <strong>{week.fearName}</strong>
          {fearMeta ? ` · ${fearMeta.severity_current}/10` : ''}
        </p>
      )}

      {(week.hear || week.reframe || week.reassure) && (
        <div className="stu-ftf-plan__hear">
          <Sparkles size={16} strokeWidth={2} aria-hidden />
          <div>
            {week.hear ? <p>{week.hear}</p> : null}
            {week.reframe ? <p>{week.reframe}</p> : null}
            {week.reassure ? <p>{week.reassure}</p> : null}
          </div>
        </div>
      )}

      <div className="stu-ftf-plan__weekhead">
        <div>
          <h4>{week.theme}</h4>
          {week.introduction ? <p>{week.introduction}</p> : null}
        </div>
        {week.weeklyMetric ? (
          <p className="stu-ftf-plan__win">
            You’ll know week {weekNumber} worked when: <strong>{week.weeklyMetric}</strong>
          </p>
        ) : null}
        {fearMeta?.suggested_tools?.length ? (
          <p className="stu-ftf-plan__tools">
            Score drops when you finish:{' '}
            <strong>
              {(fearMeta.completed_tools || []).length} / {fearMeta.suggested_tools.length} suggested
              mocks
            </strong>
          </p>
        ) : null}
      </div>

      <ol className="stu-ftf-days">
        {week.days.map((day) => {
          const tool = canonicalToolCode(day.tool);
          const isDone = tool && completedTools.has(tool);
          return (
            <li key={`${week.fearId}-${day.day}`} className={isDone ? 'is-done' : ''}>
              <span className="stu-ftf-days__n">Day {day.day}</span>
              <div className="stu-ftf-days__body">
                <p>{day.action}</p>
                {day.metric ? (
                  <span className="stu-ftf-days__metric">Done when: {day.metric}</span>
                ) : null}
                <div className="stu-ftf-days__acts">
                  {day.href ? (
                    <Link className="stu-ftf-days__go" to={day.href}>
                      {isDone
                        ? day.toolName
                          ? `Redo ${day.toolName}`
                          : 'Open again'
                        : day.toolName
                          ? `Open ${day.toolName}`
                          : 'Start this'}
                      <ArrowRight size={14} strokeWidth={2.2} aria-hidden />
                    </Link>
                  ) : null}
                  {day.tool && onMarkAction ? (
                    <button
                      type="button"
                      className="stu-ftf-days__mark"
                      disabled={loading || isDone || markingTool === tool}
                      onClick={() => onMarkAction(week.fearId, day.tool, `week${weekNumber}-day${day.day}`)}
                    >
                      {isDone
                        ? 'Counted'
                        : markingTool === tool
                          ? 'Saving…'
                          : isScoreableTool(day.tool)
                            ? 'I finished this mock'
                            : 'I did this'}
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <form className="stu-ftf-checkin" onSubmit={onSubmit}>
        <h4>Sunday check-in — be honest, not impressive</h4>
        <p>
          The official fear factor drops when you finish suggested mocks. This Sunday note can only
          bring it lower, never back up.
        </p>

        <label>
          How many of this week’s steps did you actually do?
          <input
            type="range"
            min={0}
            max={total}
            value={Math.min(done, total)}
            onChange={(e) =>
              onFormChange({
                ...weeklyForm,
                actions_completed: Number(e.target.value),
                actions_total: total,
              })
            }
          />
          <span>
            {Math.min(done, total)} of {total}
          </span>
        </label>

        <label>
          How heavy does this fear feel now?
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={Number.isFinite(weight) ? weight : 7}
            onChange={(e) =>
              onFormChange({ ...weeklyForm, self_assessment: Number(e.target.value) })
            }
          />
          <span>
            {Number.isFinite(weight) ? weight : 7}/10 · {fearWeightLabel(weight)}
          </span>
        </label>

        <label>
          What got in the way? (optional)
          <textarea
            rows={2}
            placeholder="Too tired, copied a solution, froze on the intro…"
            value={weeklyForm.challenges}
            onChange={(e) => onFormChange({ ...weeklyForm, challenges: e.target.value })}
          />
        </label>

        <button
          type="submit"
          className="stu-knowme__btn stu-knowme__btn--primary"
          disabled={loading || !weeklyFearId}
        >
          {loading ? 'Saving your week…' : 'Save this week'}
        </button>
      </form>

      {weeklyResult && (
        <div className="stu-ftf-weekly-result">
          <CheckCircle2 size={18} aria-hidden />
          <div>
            <p>
              {weeklyResult.milestone_reached
                ? 'This fear just dropped off your list. That’s huge.'
                : `The weight moved ${weeklyResult.severity_before} → ${weeklyResult.severity_after}. That’s the point — not a perfect week.`}
            </p>
            {weeklyResult.feedback?.celebration ? <p>{weeklyResult.feedback.celebration}</p> : null}
            {weeklyResult.feedback?.next_week_focus ? (
              <p>
                <strong>Next week:</strong> {weeklyResult.feedback.next_week_focus}
              </p>
            ) : null}
          </div>
        </div>
      )}

      {celebration?.celebration && (
        <div className="stu-ftf-celebration">
          <h4>{celebration.celebration.celebration_title || 'You did it'}</h4>
          <p>{celebration.celebration.main_message}</p>
        </div>
      )}

      {notifications.length > 0 && (
        <div className="stu-ftf-notifs">
          <h4>Gentle reminders</h4>
          <ul>
            {notifications.slice(0, 4).map((n) => (
              <li key={n.id}>{n.message || n.title}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
