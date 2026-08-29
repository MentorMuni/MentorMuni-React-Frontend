/**
 * College subdomain root hub — e.g. medicaps.mentormuni.com /
 * Two clear doors: Student login | College (TPO/HOD) login.
 * Apex localhost / www still serve the marketing homepage.
 *
 * Brand lockup: MentorMuni + college logo/name side by side.
 */
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  AtSign,
  BarChart3,
  Bell,
  Bot,
  Briefcase,
  Building2,
  FileText,
  GraduationCap,
  MessageCircle,
  Send,
  Target,
  Trophy,
  UserRound,
} from 'lucide-react';
import { CollegeTenantProvider, useCollegeTenantContext } from './CollegeTenantProvider';
import { CollegeTenantGate } from './UnknownCollegePortalPage';
import CollegeOrgBrand from './CollegeOrgBrand';
import { apexOrigin } from './resolveTenant';
import HeaderThemeToggle from '../components/navbar/HeaderThemeToggle';
import './college-portal-home.css';

const MM_LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;
const EASE = [0.22, 1, 0.36, 1];

/** Soft watermark icons — same idea as the reference login backdrop. */
const WATERMARKS = [
  { Icon: MessageCircle, className: 'mm-campus-hub__mark--1', color: '#7eb8e8' },
  { Icon: AtSign, className: 'mm-campus-hub__mark--2', color: '#f0a0b8' },
  { Icon: Send, className: 'mm-campus-hub__mark--3', color: '#9b8fd9' },
  { Icon: UserRound, className: 'mm-campus-hub__mark--4', color: '#f0b070' },
  { Icon: Briefcase, className: 'mm-campus-hub__mark--5', color: '#88c5c0' },
  { Icon: FileText, className: 'mm-campus-hub__mark--6', color: '#a8b4c4' },
  { Icon: Bell, className: 'mm-campus-hub__mark--7', color: '#e8a0c0' },
  { Icon: BarChart3, className: 'mm-campus-hub__mark--8', color: '#7eb8e8' },
  { Icon: Building2, className: 'mm-campus-hub__mark--9', color: '#9b8fd9' },
  { Icon: Bot, className: 'mm-campus-hub__mark--10', color: '#88b0d8' },
  { Icon: GraduationCap, className: 'mm-campus-hub__mark--11', color: '#f0a878' },
  { Icon: Trophy, className: 'mm-campus-hub__mark--12', color: '#e8c070' },
  { Icon: Target, className: 'mm-campus-hub__mark--13', color: '#8ec5e8' },
];

function CampusHubBackdrop() {
  return (
    <div className="mm-campus-hub__backdrop" aria-hidden>
      <div className="mm-campus-hub__grid" />
      <div className="mm-campus-hub__watermarks">
        {WATERMARKS.map(({ Icon, className, color }) => (
          <span key={className} className={`mm-campus-hub__mark ${className}`} style={{ color }}>
            <Icon strokeWidth={1.35} absoluteStrokeWidth />
          </span>
        ))}
      </div>
    </div>
  );
}

function CollegePortalHomeInner() {
  const reduceMotion = useReducedMotion();
  const { college, slug } = useCollegeTenantContext();
  const collegeName = college?.name || slug || 'this college';

  return (
    <div className="mm-campus-hub">
      <CampusHubBackdrop />

      <div className="mm-campus-hub__theme">
        <HeaderThemeToggle />
      </div>

      <motion.div
        className="mm-campus-hub__intro"
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <p className="mm-campus-hub__intro-kicker">Campus placement prep</p>
        <h1 className="mm-campus-hub__intro-title">
          Portal for <em>{collegeName}</em>
        </h1>
      </motion.div>

      <motion.header
        className="mm-campus-hub__brand mm-campus-hub__brand--duo"
        initial={reduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.03 }}
      >
        <div className="mm-campus-hub__duo-mm">
          <img src={MM_LOGO} alt="MentorMuni" className="mm-campus-hub__duo-mm-logo" />
          <div className="mm-campus-hub__duo-mm-text">
            <strong>MentorMuni</strong>
            <span>Campus portal</span>
          </div>
        </div>

        <span className="mm-campus-hub__duo-rule" aria-hidden />

        <CollegeOrgBrand
          college={college}
          slug={slug}
          size="md"
          className="mm-campus-hub__duo-org"
        />
      </motion.header>

      <motion.main
        className="mm-campus-hub__card"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.04 }}
      >
        <p className="mm-campus-hub__lede mm-campus-hub__lede--lead">
          Choose Student or College staff to continue on this campus.
        </p>

        <div className="mm-campus-hub__tiles">
          <Link to="/studentportal/login" className="mm-campus-hub__tile mm-campus-hub__tile--student">
            <span className="mm-campus-hub__tile-icon" aria-hidden>
              <GraduationCap size={26} strokeWidth={2.1} />
            </span>
            <span className="mm-campus-hub__tile-copy">
              <strong>Students</strong>
              <span>Practice, readiness, and placement prep for your campus.</span>
            </span>
            <ArrowRight className="mm-campus-hub__tile-arrow" size={18} aria-hidden />
          </Link>

          <Link to="/Organization/login" className="mm-campus-hub__tile mm-campus-hub__tile--org">
            <span className="mm-campus-hub__tile-icon" aria-hidden>
              <Building2 size={26} strokeWidth={2.1} />
            </span>
            <span className="mm-campus-hub__tile-copy">
              <strong>College staff</strong>
              <span>TPO, HOD, and Org Admin — manage campus access.</span>
            </span>
            <ArrowRight className="mm-campus-hub__tile-arrow" size={18} aria-hidden />
          </Link>
        </div>

        <p className="mm-campus-hub__foot">
          Not {collegeName}?{' '}
          <a href={apexOrigin()}>Go to mentormuni.com</a>
        </p>
      </motion.main>
    </div>
  );
}

export default function CollegePortalHomePage() {
  return (
    <CollegeTenantProvider>
      <CollegeTenantGate audience="student">
        <CollegePortalHomeInner />
      </CollegeTenantGate>
    </CollegeTenantProvider>
  );
}
