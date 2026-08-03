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
  /** Natural width the embedded UI is designed for, in px. */
  stageWidth = 1180,
  /** Rendered scale. 0.5 ≈ a half-size, crisp "screenshot". */
  scale = 0.5,
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

      <div className="mmc-frame__viewport" style={{ height: scaledHeight }}>
        <div
          className="mmc-frame__stage"
          style={{
            width: stageWidth,
            transform: `scale(${scale})`,
          }}
          /* eslint-disable-next-line react/no-unknown-property */
          inert=""
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
