import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Gift } from 'lucide-react';
import {
  MISSION_TAGLINE,
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  CONTACT_WHATSAPP_HREF,
  CONTACT_WHATSAPP_LABEL,
  PRODUCT_READINESS_SCORE,
  PRIMARY_CTA_LABEL,
  READINESS_TEST_COUPON_BADGE,
} from '../../constants/brandCopy';

/**
 * Shared marketing footer — single source for legal links and contact info.
 * @param {{ onReadinessCtaClick?: () => void }} props
 */
export default function SiteFooter({ onReadinessCtaClick }) {
  return (
    <footer className="mm-band mm-marketing-section border-t border-border bg-secondary">
      <div className="mm-container mm-container--wide w-full">
        <div className="mb-10 grid gap-8 sm:grid-cols-2 md:grid-cols-5">
          <div className="md:col-span-2">
            <h3 className="mb-2 font-bold text-foreground">
              Mentor<span className="text-[#1A8FC4]">Muni</span>
            </h3>
            <p className="mb-4 max-w-xs text-sm leading-relaxed text-muted-foreground">{MISSION_TAGLINE}</p>
            <div className="mm-surface-panel mb-4 max-w-sm rounded-xl px-3 py-3 shadow-sm">
              <div className="flex gap-2.5">
                <Gift className="mt-0.5 h-4 w-4 shrink-0 text-[#15799F]" aria-hidden />
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Limited offer
                  </p>
                  <p className="mb-2 text-xs leading-snug text-muted-foreground">{READINESS_TEST_COUPON_BADGE}</p>
                  {onReadinessCtaClick ? (
                    <button
                      type="button"
                      onClick={onReadinessCtaClick}
                      className="-mx-1 inline-flex min-h-[40px] cursor-pointer items-center rounded-md border-0 bg-transparent px-1 py-2 text-left font-inherit text-xs font-semibold text-[#1A8FC4] transition-colors hover:text-[#15799F] active:text-[#0d5f7f]"
                    >
                      {PRIMARY_CTA_LABEL} →
                    </button>
                  ) : (
                    <Link
                      to="/start-assessment"
                      className="-mx-1 inline-flex min-h-[40px] items-center rounded-md px-1 py-2 text-xs font-semibold text-[#1A8FC4] transition-colors hover:text-[#15799F]"
                    >
                      {PRIMARY_CTA_LABEL} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <a href={CONTACT_EMAIL_HREF} className="flex items-center gap-2 transition-colors hover:text-[#1A8FC4]">
                <Mail size={13} /> {CONTACT_EMAIL}
              </a>
              <a href={CONTACT_PHONE_HREF} className="flex items-center gap-2 transition-colors hover:text-[#1A8FC4]">
                <Phone size={13} /> {CONTACT_PHONE_DISPLAY}
              </a>
              <a
                href={CONTACT_WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-[#1A8FC4]"
              >
                <MessageCircle size={13} /> {CONTACT_WHATSAPP_LABEL}
              </a>
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold text-hint">Tools</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/interview-readiness-tools" className="transition-colors hover:text-[#1A8FC4]">
                  {PRODUCT_READINESS_SCORE}
                </Link>
              </li>
              <li>
                <Link to="/mock-interviews" className="transition-colors hover:text-[#1A8FC4]">
                  Mock Interviews
                </Link>
              </li>
              <li>
                <Link to="/resume-analyzer" className="transition-colors hover:text-[#1A8FC4]">
                  Resume Analyzer
                </Link>
              </li>
              <li>
                <Link to="/placement-tracks" className="transition-colors hover:text-[#1A8FC4]">
                  Placement Tracks
                </Link>
              </li>
              <li>
                <Link to="/free-tutorials" className="transition-colors hover:text-[#1A8FC4]">
                  Free Tutorials
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold text-hint">Learn</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/learning-paths" className="transition-colors hover:text-[#1A8FC4]">
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link to="/outcomes" className="transition-colors hover:text-[#1A8FC4]">
                  Outcomes
                </Link>
              </li>
              <li>
                <Link to="/leadership-board" className="transition-colors hover:text-[#1A8FC4]">
                  Leadership Board
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold text-hint">Company</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="transition-colors hover:text-[#1A8FC4]">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="transition-colors hover:text-[#1A8FC4]">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-[#1A8FC4]">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/mentors" className="transition-colors hover:text-[#1A8FC4]">
                  Mentorship
                </Link>
              </li>
              <li>
                <Link to="/colleges" className="transition-colors hover:text-[#1A8FC4]">
                  For Colleges
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} MentorMuni. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link to="/terms" className="transition-colors hover:text-[#1A8FC4]">
              Terms
            </Link>
            <Link to="/privacy" className="transition-colors hover:text-[#1A8FC4]">
              Privacy
            </Link>
            <Link to="/cookies" className="transition-colors hover:text-[#1A8FC4]">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
