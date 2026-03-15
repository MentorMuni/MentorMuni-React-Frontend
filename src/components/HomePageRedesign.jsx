import React from 'react';
import {
  LandingHero,
  TrustSection,
  HowItWorksSteps,
  DashboardPreview,
  AIMockSection,
  SuccessStoriesCards,
  MentorProfilesCards,
  FinalCTA,
  LandingFooter,
} from './landing';
import MentorMuniChatbot from './MentorMuniChatbot';

/**
 * Redesigned homepage – conversion-focused funnel:
 * Hero → Trust → How it works → Dashboard preview → AI Mock → Success stories → Mentors → Final CTA
 * Design: Linear/Stripe/Notion style, light theme, Inter/Poppins, primary #4F46E5
 */
export default function HomePageRedesign() {
  return (
    <div className="min-h-screen bg-surface text-slate-900 font-sans antialiased">
      <LandingHero />
      <TrustSection />
      <HowItWorksSteps />
      <DashboardPreview />
      <AIMockSection />
      <SuccessStoriesCards />
      <MentorProfilesCards />
      <FinalCTA />
      <LandingFooter />
      <MentorMuniChatbot />
    </div>
  );
}
