/**
 * Design QA — quick pass before shipping a route or feature.
 * Import in dev tools or copy into PRs; keep in sync with design tokens + homepage bar.
 */

export const DESIGN_QA_CHECKLIST = [
  'Typography: uses .typo-display / .typo-h1–h3 / .typo-body / .typo-caption — no random font sizes',
  'Line length: marketing body uses .max-w-prose-marketing or equivalent (≤~42rem)',
  'Color: neutrals + surfaces from tokens; orange (#FF9500) for primary CTA and key metrics only',
  'Contrast: no light-gray text on white below ~4.5:1; scorecards tested on cream #FFFDF8',
  'Depth: cards use .mm-card-elevated or same shadow token — one elevation language',
  'Motion: one signature moment per page max; respects prefers-reduced-motion',
  'Loading: Suspense fallback is skeleton or branded placeholder — not blank',
  'Empty: lists/dashboards explain why empty + next step',
  'Focus: interactive elements have visible :focus-visible (orange ring)',
  'Tap targets: buttons/links ≥44px min height on mobile where possible',
  'Router: internal nav uses <Link> — works with HashRouter + base path',
  'Forms: labels, errors inline, disabled + loading states on submit',
  'Mobile nav: menu closes on navigate; no horizontal overflow',
  'Footer: links match App routes; legal/contact consistent',
];
