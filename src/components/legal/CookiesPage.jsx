import React from 'react';
import LegalPageShell from './LegalPageShell';

export default function CookiesPage() {
  return (
    <LegalPageShell title="Cookie Policy">
      <p>
        MentorMuni uses essential cookies and browser storage (including localStorage and sessionStorage) so the readiness
        check, theme preferences, and session features work correctly.
      </p>
      <p>
        We may use analytics cookies to understand how students use the free check and tools. You can clear cookies in
        your browser settings; some features may not work without them.
      </p>
      <p className="text-xs text-hint">Last updated: July 2026</p>
    </LegalPageShell>
  );
}
