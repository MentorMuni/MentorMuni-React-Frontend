import React, { Suspense } from 'react';
import { useReducedMotion } from 'framer-motion';
import InnerRouteShell from './new-ui/InnerRouteShell';
import StudentJourneyHero from './StudentJourney/HeroSection';
import RecognitionSection from './StudentJourney/RecognitionSection';
import StudentJourneyTimeline from './StudentJourney/Timeline';
import ShiftSection from './StudentJourney/ShiftSection';
import FinalCTA from './StudentJourney/FinalCTA';

function StudentJourneyPageFallback() {
  return (
    <div className="min-h-[60vh] bg-background py-12">
      <div className="mm-container space-y-4">
        <div className="mx-auto h-10 w-48 animate-pulse rounded-xl bg-shell-1" />
        <div className="mx-auto h-8 w-full max-w-xl animate-pulse rounded-lg bg-shell-2" />
        <div className="mx-auto h-4 w-5/6 max-w-lg animate-pulse rounded-lg bg-shell-2" />
        <div className="mx-auto mt-10 h-12 w-56 animate-pulse rounded-xl bg-shell-1" />
      </div>
    </div>
  );
}

/**
 * Why MentorMuni — student marketing page (/how-it-works).
 * Recognition → relief → shift → convert. No college / product showcase.
 */
export default function StudentJourneyPage() {
  const reduceMotion = useReducedMotion();

  return (
    <InnerRouteShell
      scope="marketing"
      className="min-h-screen mm-site-theme why-mm-page overflow-x-hidden bg-background"
    >
      <Suspense fallback={<StudentJourneyPageFallback />}>
        <StudentJourneyHero reduceMotion={reduceMotion} />
        <RecognitionSection reduceMotion={reduceMotion} />
        <StudentJourneyTimeline reduceMotion={reduceMotion} />
        <ShiftSection reduceMotion={reduceMotion} />
        <FinalCTA reduceMotion={reduceMotion} />
      </Suspense>
    </InnerRouteShell>
  );
}
