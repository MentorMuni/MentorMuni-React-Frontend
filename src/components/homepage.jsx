import React, { useEffect } from 'react';
import { goToStartAssessment } from '../utils/startAssessmentNavigation';
import {
  HOMEPAGE_META_TITLE,
  HOMEPAGE_META_DESCRIPTION,
  HOMEPAGE_META_KEYWORDS,
} from '../constants/homepageSeo';
import { usePageMeta } from '../hooks/usePageMeta';
import SiteFooter from './layout/SiteFooter';
import AudienceHero from './marketing/AudienceHero';
import TrustStrip from './marketing/TrustStrip';
import ProductProofBand from './marketing/ProductProofBand';
import StakeholderTabs from './marketing/StakeholderTabs';
import CapabilityGrid from './marketing/CapabilityGrid';
import JourneySteps from './marketing/JourneySteps';
import PersonaQuotes from './marketing/PersonaQuotes';
import FaqAccordion from './marketing/FaqAccordion';
import FinalCtaBand from './marketing/FinalCtaBand';
import {
  V2_HERO_HEADLINE_L1,
  V2_HERO_HEADLINE_L2,
  V2_HERO_SUB,
  V2_CTA_STUDENTS,
  V2_CTA_COLLEGES,
  V2_TRUST_STATS,
  V2_PROOF_EYEBROW,
  V2_PROOF_HEADLINE,
  V2_PROOF_SUB,
  V2_PROOF_PANELS,
  V2_STAKEHOLDER_EYEBROW,
  V2_STAKEHOLDER_HEADLINE,
  V2_STAKEHOLDER_SUB,
  V2_STAKEHOLDERS,
  V2_CAP_EYEBROW,
  V2_CAP_HEADLINE,
  V2_CAP_SUB,
  V2_CAPABILITIES,
  V2_JOURNEY_EYEBROW,
  V2_JOURNEY_HEADLINE,
  V2_JOURNEY_SUB,
  V2_JOURNEY_STEPS,
  V2_QUOTES_EYEBROW,
  V2_QUOTES_HEADLINE,
  V2_QUOTES_SUB,
  V2_QUOTES,
  V2_FAQ_EYEBROW,
  V2_FAQ_HEADLINE,
  V2_FAQ_ITEMS,
  V2_FINAL_HEADLINE,
  V2_FINAL_SUB,
  V2_CTA_READINESS,
  V2_CTA_DEMO,
} from '../constants/marketingV2Copy';

/**
 * MentorMuni homepage v2 — 7Seers rhythm, MentorMuni product.
 * Nine focused bands; portals unchanged.
 */
export default function HomePage() {
  usePageMeta({
    title: HOMEPAGE_META_TITLE,
    description: HOMEPAGE_META_DESCRIPTION,
    keywords: HOMEPAGE_META_KEYWORDS,
  });

  useEffect(() => {
    document.documentElement.classList.add('mm-marketing-v2');
    return () => document.documentElement.classList.remove('mm-marketing-v2');
  }, []);

  return (
    <div className="mm-marketing-v2 min-h-screen">
      <AudienceHero
        display
        headline={V2_HERO_HEADLINE_L1}
        headlineLine2={V2_HERO_HEADLINE_L2}
        sub={V2_HERO_SUB}
        primary={{ label: V2_CTA_STUDENTS, onClick: goToStartAssessment }}
        secondary={{ label: V2_CTA_COLLEGES, href: '/colleges' }}
      />

      <TrustStrip stats={V2_TRUST_STATS} />

      <ProductProofBand
        eyebrow={V2_PROOF_EYEBROW}
        title={V2_PROOF_HEADLINE}
        sub={V2_PROOF_SUB}
        panels={V2_PROOF_PANELS}
      />

      <StakeholderTabs
        eyebrow={V2_STAKEHOLDER_EYEBROW}
        title={V2_STAKEHOLDER_HEADLINE}
        sub={V2_STAKEHOLDER_SUB}
        items={V2_STAKEHOLDERS}
      />

      <CapabilityGrid
        eyebrow={V2_CAP_EYEBROW}
        title={V2_CAP_HEADLINE}
        sub={V2_CAP_SUB}
        items={V2_CAPABILITIES}
      />

      <JourneySteps
        eyebrow={V2_JOURNEY_EYEBROW}
        title={V2_JOURNEY_HEADLINE}
        sub={V2_JOURNEY_SUB}
        steps={V2_JOURNEY_STEPS}
      />

      <PersonaQuotes
        eyebrow={V2_QUOTES_EYEBROW}
        title={V2_QUOTES_HEADLINE}
        sub={V2_QUOTES_SUB}
        quotes={V2_QUOTES}
      />

      <FaqAccordion eyebrow={V2_FAQ_EYEBROW} title={V2_FAQ_HEADLINE} items={V2_FAQ_ITEMS} />

      <FinalCtaBand
        headline={V2_FINAL_HEADLINE}
        sub={V2_FINAL_SUB}
        primary={{ label: V2_CTA_READINESS, onClick: goToStartAssessment }}
        secondary={{ label: V2_CTA_DEMO, href: '/contact?topic=colleges' }}
      />

      <SiteFooter onReadinessCtaClick={goToStartAssessment} />
    </div>
  );
}
