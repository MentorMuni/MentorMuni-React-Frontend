import { Link } from 'react-router-dom';

/** In-content back nav — site Navbar is the only top chrome. */
export default function TutorialBackLink({
  to = '/free-tutorials',
  label = '← Back to Free Tutorials',
  className = '',
  ariaLabel = 'Page navigation',
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className={['mm-tutorial-back mm-container mm-container--wide', className].filter(Boolean).join(' ')}
    >
      <Link
        to={to}
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        {label}
      </Link>
    </nav>
  );
}
