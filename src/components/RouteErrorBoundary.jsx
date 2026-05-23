import React from 'react';

/**
 * Catches render errors in route children so users see a message instead of a blank screen.
 */
export default class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[RouteErrorBoundary]', error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div className="min-h-[60vh] mm-site-theme flex flex-col items-center justify-center gap-4 px-4 py-12">
          <p className="text-center text-lg font-bold text-foreground">This page failed to load</p>
          <p className="max-w-md text-center text-sm text-muted-foreground">
            {error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-cta px-6 py-3 font-bold text-white shadow-lg transition-colors hover:bg-cta-hover"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
