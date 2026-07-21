import React, { Suspense } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PRIMARY_CTA_LABEL, SECONDARY_CTA_BOOK_CALL } from '../constants/brandCopy';
import InnerRouteShell from './new-ui/InnerRouteShell';
import StudentJourneyHero from './StudentJourney/HeroSection';
import StudentJourneyTimeline from './StudentJourney/Timeline';
import SupportSystemsSection from './StudentJourney/SupportSystemsSection';
import BenefitsGrid from './StudentJourney/BenefitsGrid';
import CaseStudyCard from './StudentJourney/CaseStudyCard';
import PedagogicalNote from './StudentJourney/PedagogicalNote';
import FinalCTA from './StudentJourney/FinalCTA';

function StudentJourneyPageFallback() {
  return (
    <div className="min-h-[60vh] bg-background py-12">
      <div className="mm-container space-y-4">
        <div className="h-9 w-2/3 max-w-md animate-pulse rounded-xl bg-shell-1" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-shell-2" />
        <div className="h-4 w-5/6 animate-pulse rounded-lg bg-shell-2" />
        <div className="mt-10 h-96 animate-pulse rounded-2xl bg-gradient-to-br from-shell-warm via-shell-cream to-shell-neutral" />
      </div>
    </div>
  );
}

export default function StudentJourneyPage() {
  const reduceMotion = useReducedMotion();

  return (
    <InnerRouteShell
      scope="marketing"
      className="min-h-screen mm-site-theme overflow-x-hidden bg-background"
    >
      <Suspense fallback={<StudentJourneyPageFallback />}>
        {/* Hero Section */}
        <StudentJourneyHero reduceMotion={reduceMotion} />

        {/* 7-Stage Timeline */}
        <section className="relative overflow-hidden bg-white py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, var(--pattern-dot-cool) 1px, transparent 0)`,
                backgroundSize: '28px 28px',
              }}
            />
          </div>
          <StudentJourneyTimeline reduceMotion={reduceMotion} />
        </section>

        {/* Pedagogical Note */}
        <PedagogicalNote reduceMotion={reduceMotion} />

        {/* Support Systems */}
        <SupportSystemsSection reduceMotion={reduceMotion} />

        {/* Benefits Grid */}
        <BenefitsGrid reduceMotion={reduceMotion} />

        {/* College Success Story */}
        <section className="mm-band mm-marketing-section border-t border-border bg-gradient-to-br from-background via-background to-primary/5">
          <div className="mm-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: '-50px' }}
              className="mb-12 text-center"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary/90">
                Real Results
              </p>
              <h2 className="mt-4 text-3xl font-extrabold text-foreground md:text-4xl">
                How Partner Colleges See Results
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Real metrics from colleges using MentorMuni's 7-stage system
              </p>
            </motion.div>

            <CaseStudyCard reduceMotion={reduceMotion} />
          </div>
        </section>

        {/* Final CTA */}
        <FinalCTA reduceMotion={reduceMotion} />
      </Suspense>
    </InnerRouteShell>
  );
}
