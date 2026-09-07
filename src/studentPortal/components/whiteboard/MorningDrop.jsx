import { useState } from 'react';
import { motion } from 'framer-motion';
import { enterProps } from '../../motion';
import { formatDropDate } from '../../whiteboardDates';

function isEmptyDrop(drop) {
  if (!drop) return false;
  if (drop.source === 'empty') return true;
  const headline = (drop.headline || '').toLowerCase();
  return headline.includes('wall is quiet') || headline.includes('no notes yet');
}

export default function MorningDrop({
  reduce,
  today,
  generating,
  selectedDate,
  mentorships,
  drop,
  dropBusy,
  onSelectDate,
}) {
  const [showWhy, setShowWhy] = useState(false);
  const dates = [];
  const seen = new Set();
  if (today && !seen.has(today)) {
    dates.push({ date: today, headline: drop?.headline || 'Today' });
    seen.add(today);
  }
  for (const item of mentorships || []) {
    if (seen.has(item.mentorship_date)) continue;
    seen.add(item.mentorship_date);
    dates.push({ date: item.mentorship_date, headline: item.headline });
  }

  const empty = isEmptyDrop(drop);

  return (
    <motion.section className="wb-drop" {...enterProps(reduce, 0.05)}>
      <span className="wb-drop__tape" aria-hidden />
      <span className="wb-drop__tape wb-drop__tape--alt" aria-hidden />
      {dates.length > 1 ? (
        <div className="wb-drop__rail" role="toolbar" aria-label="Plan by date">
          {dates.map((item) => {
            const on = item.date === selectedDate;
            return (
              <button
                key={item.date}
                type="button"
                aria-pressed={on}
                className={`wb-drop__day${on ? ' is-on' : ''}${item.date === today && generating ? ' is-live' : ''}`}
                onClick={() => onSelectDate(item.date)}
              >
                {item.date === today ? 'Today' : formatDropDate(item.date)}
              </button>
            );
          })}
        </div>
      ) : null}

      {generating && selectedDate === today && !drop ? (
        <div className="wb-drop__brew" aria-live="polite" aria-busy="true">
          <strong>Building today’s plan…</strong>
          <p>Using yesterday’s notes. This takes a few seconds.</p>
        </div>
      ) : dropBusy ? (
        <div className="wb-drop__brew" aria-live="polite" aria-busy="true">
          <strong>Loading that day…</strong>
        </div>
      ) : drop && empty ? (
        <>
          <div className="wb-drop__meta">
            <span className="wb-drop__band">Today’s plan · {formatDropDate(drop.mentorship_date)}</span>
          </div>
          <h2 className="wb-drop__headline">No notes from yesterday</h2>
          <p className="wb-drop__greeting">
            Add one note tonight about what you’re stuck on. Tomorrow you’ll get a short, clear plan.
          </p>
          <div className="wb-drop__empty-hint">
            <p>
              <strong>Example:</strong> “Arrays freeze me — I want 2 easy problems done without watching a video.”
            </p>
          </div>
        </>
      ) : drop ? (
        <>
          <div className="wb-drop__meta">
            <span className="wb-drop__band">Today’s plan · {formatDropDate(drop.mentorship_date)}</span>
          </div>
          <h2 className="wb-drop__headline">{drop.headline}</h2>
          {drop.greeting ? <p className="wb-drop__greeting">{drop.greeting}</p> : null}

          {drop.actions?.length ? (
            <div className="wb-drop__actions">
              {drop.actions.map((action) => (
                <article key={`${drop.id}-${action.order}`} className="wb-action">
                  <div className="wb-action__top">
                    <span className="wb-action__ord">{action.order}</span>
                    <span className="wb-action__time">{action.timebox_minutes || 25} min</span>
                  </div>
                  <h3 className="wb-action__title">{action.title}</h3>
                  <p className="wb-action__do">{action.do_exactly}</p>
                  {action.done_when ? (
                    <p className="wb-action__done">
                      <strong>Done when: </strong>
                      {action.done_when}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}

          {drop.callout ? <p className="wb-drop__callout">{drop.callout}</p> : null}

          {(drop.diagnosis || drop.what_changed || drop.closing) ? (
            <div className="wb-drop__more">
              <button
                type="button"
                className="wb-drop__more-btn"
                aria-expanded={showWhy}
                onClick={() => setShowWhy((v) => !v)}
              >
                {showWhy ? 'Hide details' : 'Why this plan'}
              </button>
              {showWhy ? (
                <div className="wb-drop__more-body">
                  {drop.what_changed ? <p>{drop.what_changed}</p> : null}
                  {drop.diagnosis ? <p>{drop.diagnosis}</p> : null}
                  {drop.closing ? <p className="wb-drop__closing">{drop.closing}</p> : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      ) : (
        <div className="wb-drop__brew">
          <strong>Write a note tonight.</strong>
          <p>Tomorrow morning you’ll get a short plan from yesterday’s notes.</p>
        </div>
      )}
    </motion.section>
  );
}
