import React from 'react';
import { Link } from 'react-router-dom';
import LegalPageShell from './LegalPageShell';

export default function CareersPage() {
  return (
    <LegalPageShell title="Careers at MentorMuni">
      <p>
        We are building interview readiness for Indian engineering students — measurement first, mentors second, not
        another content library. The founding team is small; early hires work directly with students and mentors.
      </p>
      <p>
        We are especially interested in people who care about placement outcomes, ed-tech product, or mentor operations.
        Remote-friendly within India.
      </p>
      <p>
        No open roles are listed yet. To express interest, email{' '}
        <a href="mailto:enroll@mentormuni.com" className="font-semibold text-cta hover:underline">
          enroll@mentormuni.com
        </a>{' '}
        with your background and what you would like to build — or use our{' '}
        <Link to="/contact" className="font-semibold text-cta hover:underline">
          contact form
        </Link>
        .
      </p>
    </LegalPageShell>
  );
}
