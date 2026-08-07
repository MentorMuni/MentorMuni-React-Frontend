import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { safePortalToolHref } from '../../paths';
import { ArrowRight, Check, Loader2, Sparkles } from 'lucide-react';

/**
 * 90-day journey — locked until baseline done; then prep vs mock-only phases.
 */

export default function PlacementJourneySection({
  weekStatus,
  plan,
  planStatus,
  generating,
  onGenerate,
  generateError,
}) {
  const [phaseId, setPhaseId] = useState('prep');
  const [weekIdx, setWeekIdx] = useState(0);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const [seenPlanId, setSeenPlanId] = useState(plan?.id ?? null);

  // A newly generated plan invalidates the selected week and any pending confirm.
  useEffect(() => {
    const nextId = plan?.id ?? null;
    if (nextId === seenPlanId) return;
    setSeenPlanId(nextId);
    setWeekIdx(0);
    setConfirmRegenerate(false);
  }, [plan?.id, seenPlanId]);

  const phases = plan?.plan?.phases || [];
  const prep = phases.find((p) => p.phase_id === 'prep');
  const mocks = phases.find((p) => p.phase_id === 'mocks');
  const activePhase = phaseId === 'mocks' ? mocks : prep;
  const weeks = activePhase?.weeks || [];
  const activeWeek = weeks[weekIdx] || weeks[0];

  const ready = planStatus === 'ready' && plan?.plan;
  const failed = planStatus === 'failed';
  const isGenerating = generating || planStatus === 'generating';

  const daily = activeWeek?.daily || [];

  return (
    <section className="stu-card stu-journey" id="stu-90day-plan">
      <header className="stu-card__head">
        <div>
          <h2 className="stu-card__title">Your 90-day journey</h2>
          <p className="stu-card__sub">
            {ready
              ? plan.summary || plan.plan?.baseline_summary || 'Personalized from your baseline'
              : weekStatus === 'done'
                ? 'Baseline complete — generate your placement plan'
                : 'Complete Week-1 baseline to unlock the AI 90-day plan'}
          </p>
        </div>
      </header>

      {!ready && weekStatus !== 'done' ? (
        <div className="stu-journey__now">
          <p>Finish all 8 baseline tools in order. Then MentorMuni builds a 90-day plan: 6 weeks gap prep + final weeks AI mocks only.</p>
        </div>
      ) : null}

      {!ready && weekStatus === 'done' ? (
        <div className="stu-journey__now">
          <div className="stu-journey__now-head">
            <span className="stu-chip stu-chip--accent">Ready to personalize</span>
          </div>
          <h3>Generate my 90-day placement plan</h3>
          <p>
            OpenAI builds week-by-week and daily tasks from your scores, strengths, and weaknesses —
            aimed at MNC drives (TCS, Accenture, Persistent, Microsoft, and similar).
          </p>
          {generateError ? (
            <p className="stu-journey__error" role="alert">
              {generateError}
            </p>
          ) : null}
          {failed && plan?.error_message ? (
            <p className="stu-journey__error" role="alert">
              {plan.error_message}
            </p>
          ) : null}
          <button
            type="button"
            className="stu-btn stu-btn--primary"
            disabled={isGenerating}
            onClick={onGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} strokeWidth={2} className="spin" aria-hidden /> Generating…
              </>
            ) : (
              <>
                <Sparkles size={16} strokeWidth={2} aria-hidden /> Generate plan
              </>
            )}
          </button>
        </div>
      ) : null}

      {ready ? (
        <>
          <div className="stu-journey__tabs" role="tablist">
            <button
              type="button"
              className={`stu-chip${phaseId === 'prep' ? ' stu-chip--accent' : ''}`}
              onClick={() => {
                setPhaseId('prep');
                setWeekIdx(0);
              }}
            >
              Prep days 1–42
            </button>
            <button
              type="button"
              className={`stu-chip${phaseId === 'mocks' ? ' stu-chip--accent' : ''}`}
              onClick={() => {
                setPhaseId('mocks');
                setWeekIdx(0);
              }}
            >
              Mocks days 43–90
            </button>
          </div>

          <ol className="stu-steps">
            {weeks.map((w, i) => {
              const label =
                phaseId === 'prep'
                  ? `Prep ${w.prep_week || i + 1}`
                  : `Mock ${w.mock_week || i + 1}`;
              return (
                <li key={label}>
                  <button
                    type="button"
                    className={`stu-step${i === weekIdx ? ' is-current' : ''}`}
                    onClick={() => setWeekIdx(i)}
                    aria-current={i === weekIdx ? 'true' : undefined}
                  >
                    <span className="stu-step__node" aria-hidden>
                      {i === weekIdx ? <span className="stu-step__pulse" /> : i + 1}
                    </span>
                    <span className="stu-step__label">
                      <strong>{label}</strong>
                      <em>{w.theme}</em>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {activeWeek ? (
            <div className="stu-journey__now">
              <div className="stu-journey__now-head">
                <span className="stu-chip stu-chip--accent">{activeWeek.theme}</span>
              </div>
              {(activeWeek.based_on_weaknesses || []).length > 0 ? (
                <p>Based on: {(activeWeek.based_on_weaknesses || []).join(', ')}</p>
              ) : null}
              <ul className="stu-analysis__list">
                {daily.map((d) => {
                  const toolTo = d.tool_href ? safePortalToolHref(d.tool_href, 'journey') : null;
                  return (
                    <li key={d.day}>
                      <strong>Day {d.day}</strong> · {d.minutes} min — {(d.tasks || []).join('; ')}
                      {toolTo ? (
                        <>
                          {' '}
                          <Link className="stu-link-btn" to={toolTo}>
                            Open tool <ArrowRight size={14} strokeWidth={2} aria-hidden />
                          </Link>
                        </>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
              {confirmRegenerate ? (
                <div className="stu-journey__confirm">
                  <p className="stu-analysis__label">
                    Regenerating replaces this plan with a new one built from your current baseline.
                  </p>
                  <button
                    type="button"
                    className="stu-link-btn"
                    onClick={() => {
                      setConfirmRegenerate(false);
                      onGenerate();
                    }}
                    disabled={isGenerating}
                  >
                    <Check size={14} strokeWidth={2} aria-hidden /> Yes, regenerate
                  </button>
                  <button
                    type="button"
                    className="stu-link-btn"
                    onClick={() => setConfirmRegenerate(false)}
                  >
                    Keep this plan
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="stu-link-btn"
                  onClick={() => setConfirmRegenerate(true)}
                  disabled={isGenerating}
                >
                  <Check size={14} strokeWidth={2} aria-hidden /> Regenerate plan
                </button>
              )}
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
