import { motion } from 'framer-motion';
import { enterProps } from '../../motion';
import { formatDropDate } from '../../whiteboardDates';

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

  return (
    <motion.section className="wb-drop" {...enterProps(reduce, 0.05)}>
      <span className="wb-drop__tape" aria-hidden />
      <span className="wb-drop__tape wb-drop__tape--alt" aria-hidden />
      {dates.length > 1 ? (
        <div className="wb-drop__rail" role="toolbar" aria-label="Mentorship by date">
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
          <strong>Reading yesterday’s wall…</strong>
          <p>One mentor pass. Exact moves, not vibes.</p>
        </div>
      ) : dropBusy ? (
        <div className="wb-drop__brew" aria-live="polite" aria-busy="true">
          <strong>Opening that morning…</strong>
        </div>
      ) : drop ? (
        <>
          <div className="wb-drop__meta">
            <span className="wb-drop__band">Morning drop · {formatDropDate(drop.mentorship_date)}</span>
          </div>
          <h2 className="wb-drop__headline">{drop.headline}</h2>
          {drop.greeting ? <p className="wb-drop__greeting">{drop.greeting}</p> : null}
          {drop.what_changed ? <p className="wb-drop__changed">{drop.what_changed}</p> : null}
          {drop.diagnosis ? <p className="wb-drop__diagnosis">{drop.diagnosis}</p> : null}
          {drop.actions?.length ? (
            <div className="wb-drop__actions">
              {drop.actions.map((action) => (
                <article key={`${drop.id}-${action.order}`} className="wb-action">
                  <span className="wb-action__ord">{action.order}</span>
                  <h3 className="wb-action__title">{action.title}</h3>
                  <p className="wb-action__do">{action.do_exactly}</p>
                  {action.why_this_works ? <p className="wb-action__why">{action.why_this_works}</p> : null}
                  {action.done_when ? (
                    <p className="wb-action__done">
                      <strong>Peel when: </strong>
                      {action.done_when}
                    </p>
                  ) : null}
                  <span className="wb-action__time">{action.timebox_minutes || 25} min</span>
                </article>
              ))}
            </div>
          ) : null}
          {drop.callout ? <p className="wb-drop__callout">{drop.callout}</p> : null}
          {drop.closing ? <p className="wb-drop__closing">{drop.closing}</p> : null}
        </>
      ) : (
        <div className="wb-drop__brew">
          <strong>Tonight’s notes become tomorrow’s plan.</strong>
          <p>Slap the real blocker on the wall. I read yesterday only — one pass, every morning.</p>
        </div>
      )}
    </motion.section>
  );
}
