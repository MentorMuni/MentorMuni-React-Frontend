/**
 * Purpose-built empty-state art.
 *
 * Inline SVG rather than an icon font or stock illustration: these are
 * drawn with `currentColor` and a single stroke weight, so they inherit
 * the portal's text colour and stay correct in both themes without a
 * second asset.
 */

function DrivesArt() {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" fill="none" aria-hidden focusable="false">
      <rect x="14.5" y="12.5" width="43" height="35" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14.5 22.5h43" stroke="currentColor" strokeWidth="1.5" />
      <path d="M25 8.5v8M47 8.5v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="22" y="29" width="8" height="6" rx="1.5" fill="currentColor" opacity=".35" />
      <rect x="34" y="29" width="8" height="6" rx="1.5" fill="currentColor" opacity=".2" />
      <rect x="46" y="29" width="4" height="6" rx="1.5" fill="currentColor" opacity=".2" />
      <rect x="22" y="38" width="8" height="4" rx="1.5" fill="currentColor" opacity=".2" />
      <rect x="34" y="38" width="16" height="4" rx="1.5" fill="currentColor" opacity=".2" />
    </svg>
  );
}

function LeaderboardArt() {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" fill="none" aria-hidden focusable="false">
      <rect x="28" y="18.5" width="16" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12" y="28.5" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="44" y="33.5" width="16" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="36" cy="10" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M33 26h6M18 35h4M50 39h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".5" />
    </svg>
  );
}

function CompleteArt() {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" fill="none" aria-hidden focusable="false">
      <circle cx="36" cy="28" r="17" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m28.5 28.5 5 5 10-11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 5v4M36 47v4M59 28h4M9 28h4M52.2 11.8l2.9-2.9M16.9 47.1l2.9-2.9M52.2 44.2l2.9 2.9M16.9 8.9l2.9 2.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".4"
      />
    </svg>
  );
}

const ART = {
  drives: DrivesArt,
  leaderboard: LeaderboardArt,
  complete: CompleteArt,
};

export default function EmptyState({ art = 'drives', title, children }) {
  const Art = ART[art] || DrivesArt;
  return (
    <div className="stu-empty">
      <span className="stu-empty__art">
        <Art />
      </span>
      <p className="stu-empty__title">{title}</p>
      {children ? <p className="stu-empty__sub">{children}</p> : null}
    </div>
  );
}
