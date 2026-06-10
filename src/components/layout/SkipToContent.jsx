/**
 * Skip link — first focusable element for keyboard users (WCAG 2.4.1).
 */
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="mm-skip-link"
    >
      Skip to main content
    </a>
  );
}
