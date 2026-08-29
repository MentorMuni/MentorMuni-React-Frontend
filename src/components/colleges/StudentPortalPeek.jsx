import ScrollReveal from '../layout/ScrollReveal';

/**
 * StudentPortalPeek — the student half of the product, on the campus page.
 *
 * /colleges sells to a TPO or HOD, so every other band on this page shows an
 * admin surface. Buyers still ask "what does the student actually get?", and
 * that answer was previously only reachable by signing in. This section is
 * that answer, shown outright rather than behind a disclosure.
 *
 * Because it is always rendered, `loading="lazy"` is doing the work that the
 * old collapse used to: the iframe is a real document fetch, and deferring it
 * until the section nears the viewport keeps it off the initial page load for
 * visitors who never scroll this far.
 *
 * Deliberately NOT ProductFrame. That component is `inert` +
 * `pointer-events: none` because it shows decorative artwork; this is a
 * preview people are meant to scroll, so it keeps the frame chrome but stays
 * interactive and named for screen readers.
 */
export default function StudentPortalPeek() {
  const src = `${import.meta.env.BASE_URL}offer-path.html`;

  return (
    <section className="mmc-light mmc-tint mmc-band" id="student-portal">
      <div className="mmc-shell">
        <ScrollReveal>
          <p className="mmc-eyebrow">For the student</p>
          <h2 className="mmc-h2">
            This is what your students open every&nbsp;morning.
          </h2>
          <p className="mmc-lede">
            Not a course library. A measured readiness score, the three things worth
            doing today sized to the time they actually have, and a 90-day plan that
            reorders itself as scores move &mdash; plus an AI mentor, a Judge0-scored
            coding round, voice mocks and company-shaped drills.
          </p>
        </ScrollReveal>

        <div className="mmc-peek">
          <div className="mmc-frame mmc-frame--light mmc-peek__frame">
            <div className="mmc-frame__bar">
              <span className="mmc-frame__dot" />
              <span className="mmc-frame__dot" />
              <span className="mmc-frame__dot" />
              <span className="mmc-frame__url">
                mentormuni.com/studentportal/home
              </span>
            </div>
            <iframe
              className="mmc-peek__iframe"
              src={src}
              title="MentorMuni student home — interactive preview"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
