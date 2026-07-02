import React from 'react';
import RoutePageShell from '../layout/RoutePageShell';

export default function LegalPageShell({ title, children }) {
  return (
    <RoutePageShell scope="marketing" className="text-muted-foreground">
      <div className="mm-container mm-container--narrow py-14 sm:py-16">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        <div className="prose prose-sm mt-8 max-w-none space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {children}
        </div>
        <p className="mt-10 text-xs text-hint">
          Questions?{' '}
          <a href="mailto:enroll@mentormuni.com" className="font-semibold text-cta hover:underline">
            enroll@mentormuni.com
          </a>
        </p>
      </div>
    </RoutePageShell>
  );
}
