import React from 'react';
import { Link } from 'react-router-dom';
import { getRouteSeo } from '../constants/routeSeoMeta';
import { usePageMeta } from '../hooks/usePageMeta';
import RoutePageShell from './layout/RoutePageShell';

const seo = {
  ...getRouteSeo('/'),
  title: 'Page Not Found | MentorMuni',
  description: 'This page could not be found. Return to MentorMuni for placement prep and interview readiness tools.',
};

export default function NotFoundPage() {
  usePageMeta(seo);

  return (
    <RoutePageShell className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="mm-container mm-container--narrow flex flex-col items-center">
      <p className="text-sm font-bold uppercase tracking-widest text-[#1A8FC4]">404</p>
      <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The link may be outdated. Go home or start the free readiness check.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary rounded-xl px-6 py-3 text-sm font-bold">
          Home
        </Link>
        <Link
          to="/start-assessment"
          className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
        >
          Free readiness check
        </Link>
      </div>
      </div>
    </RoutePageShell>
  );
}
