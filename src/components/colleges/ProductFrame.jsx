/**
 * ProductFrame — shows a real product component as marketing artwork.
 *
 * The point of embedding live components rather than screenshots is that the
 * marketing page can never drift from the product. The trade-off is that a
 * fully interactive dashboard inside a landing page is a keyboard trap and an
 * accessibility problem, so everything here is deliberately inert:
 *
 *   - `inert` removes descendants from the tab order and the a11y tree
 *   - `aria-hidden` because it is decorative; the surrounding copy carries meaning
 *   - `pointer-events: none` so clicks fall through to the page
 *
 * Scale is applied with a transform on a fixed-width stage, so the embedded UI
 * renders at its natural desktop width and is then optically reduced — the same
 * trick a screenshot gives you, without the staleness.
 */
export default function ProductFrame({
  url,
  children,
  /**
   * Rendered scale on desktop. Default 1 — do not reduce this without
   * checking the result: at 0.52 the dashboard's 13.5px body text rendered
   * at 7px and its labels at 5.7px, which looked like a screenshot but was
   * unreadable. The embedded components are responsive, so showing them at
   * natural size in a narrow frame is both legible and accurate.
   */
  scale = 1,
  /** Clip height in px after scaling; omit to show the full component. */
  height,
  className = '',
  tone = 'dark',
}) {
  const scaledHeight = height ?? undefined;

  return (
    <div className={`mmc-frame mmc-frame--${tone} ${className}`}>
      <div className="mmc-frame__bar">
        <span className="mmc-frame__dot" />
        <span className="mmc-frame__dot" />
        <span className="mmc-frame__dot" />
        {url ? <span className="mmc-frame__url">{url}</span> : null}
      </div>

      {/* The stage is laid out at `100% / scale` and then scaled back down,
          so the rendered width lands exactly on the container instead of
          the few pixels over that a fixed pixel width produced. */}
      <div className="mmc-frame__viewport" style={{ height: scaledHeight }}>
        <div
          className="mmc-frame__stage"
          /* No min-width: it fought the exact-fit calc and reintroduced a
             crop. The embedded components are responsive, so whatever
             width the calc yields lays out correctly. */
          style={{ '--frame-scale': scale }}
          /* React 19 treats inert="" as false — it must be a real boolean. */
          inert={true}
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
