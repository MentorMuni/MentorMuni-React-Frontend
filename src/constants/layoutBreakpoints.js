/**
 * Layout breakpoints — keep in sync with site-responsive.css custom properties.
 * CSS media queries cannot use var() in all browsers, so values are duplicated intentionally.
 */
export const LAYOUT_BREAKPOINTS = {
  navDesktop: '64rem',
  ctaFull: '72rem',
  heroTwoCol: '56rem',
};

export const NAV_DESKTOP_MQ = `(min-width: ${LAYOUT_BREAKPOINTS.navDesktop})`;
export const CTA_FULL_MQ = `(min-width: ${LAYOUT_BREAKPOINTS.ctaFull})`;
