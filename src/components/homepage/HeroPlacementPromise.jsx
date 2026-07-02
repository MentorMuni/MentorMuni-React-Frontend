import {
  HERO_PLACEMENT_PROMISE_ARIA,
  HERO_PLACEMENT_PROMISE_HIGHLIGHT,
  HERO_PLACEMENT_PROMISE_LINE,
} from '../../constants/brandCopy';

/**
 * Hero placement promise — one line under the typewriter, no card chrome.
 */
export function HeroPlacementPromise({ newUI = false }) {
  const highlight = HERO_PLACEMENT_PROMISE_HIGHLIGHT;
  const line = HERO_PLACEMENT_PROMISE_LINE;
  const highlightIndex = line.indexOf(highlight);

  const before = highlightIndex >= 0 ? line.slice(0, highlightIndex) : line;
  const after = highlightIndex >= 0 ? line.slice(highlightIndex + highlight.length) : '';

  return (
    <p
      className={`mm-hero-placement-line${newUI ? ' mm-hero-placement-line--dark' : ''}`}
      aria-label={HERO_PLACEMENT_PROMISE_ARIA}
    >
      {highlightIndex >= 0 ? (
        <>
          {before}
          <span className="mm-hero-placement-line__accent">{highlight}</span>
          {after}
        </>
      ) : (
        line
      )}
    </p>
  );
}
