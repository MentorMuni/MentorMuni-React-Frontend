import { Link } from 'react-router-dom';

/** In-content back nav — site Navbar is the only top chrome on tutorial routes. */
export default function TutorialBackLink({ className = '' }) {
  return (
    <nav
      aria-label="Tutorial navigation"
      className={['mm-tutorial-back mm-container mm-container--wide', className].filter(Boolean).join(' ')}
    >
      <Link
        to="/free-tutorials"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to Free Tutorials
      </Link>
    </nav>
  );
}
