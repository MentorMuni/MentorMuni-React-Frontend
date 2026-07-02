import React from 'react';
import LegalPageShell from './LegalPageShell';

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service">
      <p>
        MentorMuni provides interview readiness tools, assessments, mock interviews, and mentorship for engineering
        students in India. By using our site you agree to use these services for personal placement preparation only.
      </p>
      <p>
        The free readiness check and gap report are directional — not a guarantee of placement or interview success. Paid
        programs include structured mentor support; outcomes depend on your effort and market conditions.
      </p>
      <p>
        You may not scrape, resell, or misrepresent MentorMuni content. We may update these terms; continued use after
        changes means acceptance. For disputes, Indian law applies and courts in India have jurisdiction.
      </p>
      <p className="text-xs text-hint">Last updated: July 2026</p>
    </LegalPageShell>
  );
}
