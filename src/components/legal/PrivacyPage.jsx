import React from 'react';
import LegalPageShell from './LegalPageShell';

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <p>
        We collect information you provide — such as name, email, phone, college, and assessment responses — to deliver
        readiness scores, gap reports, mentorship, and support. We do not sell your personal data.
      </p>
      <p>
        Assessment data is used to score your readiness and match mentors. If you opt in to the public leaderboard, your
        score and college may be shown in aggregate rankings; this is off by default.
      </p>
      <p>
        We use standard analytics and session storage to improve the product. You may request deletion of your contact
        details by emailing enroll@mentormuni.com.
      </p>
      <p className="text-xs text-hint">Last updated: July 2026</p>
    </LegalPageShell>
  );
}
