/**
 * Friendly “unknown college URL” screen — not a scary error page.
 * Shown when {slug}.mentormuni.com / {slug}.localhost does not resolve.
 * Organization variant is tuned for TPO / HOD (professional, standalone).
 */
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  Link2Off,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useCollegeTenantContext } from './CollegeTenantProvider';
import './unknown-college-portal.css';

const LOGO = `${import.meta.env.BASE_URL}mentormuni-logo-header.png`;
const EASE = [0.22, 1, 0.36, 1];
const SUPPORT_MAIL = 'mentormuniteam@gmail.com';
/** Always the public marketing site — not the current college/localhost host. */
const MENTORMUNI_HOME = 'https://www.mentormuni.com';

function attemptedHost() {
  if (typeof window === 'undefined') return '';
  return window.location.host || window.location.hostname || '';
}

/**
 * @param {{ audience?: 'student' | 'organization' }} props
 */
export default function UnknownCollegePortalPage({ audience = 'student' }) {
  const reduceMotion = useReducedMotion();
  const { slug, error } = useCollegeTenantContext();
  const host = attemptedHost();
  const isOrg = audience === 'organization';

  const copy = isOrg
    ? {
        eyebrow: 'Organization portal · TPO & HOD',
        title: 'Verify your college portal address',
        lede:
          'This secure workspace is for Training & Placement Officers and Heads of Department. Confirm the college subdomain below — or reach MentorMuni if your campus is not yet onboarded.',
        urlLabel: 'Portal address opened',
        checks: [
          <>
            Use your official college portal URL (example:{' '}
            <em>yourcollege.mentormuni.com/Organization/login</em>)
          </>,
          'Confirm the portal slug with your MentorMuni onboarding contact',
          'If your college is new to MentorMuni, request campus onboarding from our team',
        ],
        notFound:
          'No active college organization is linked to this address yet.',
        loadFail: 'Unable to load this college portal right now. Please retry shortly.',
        cta: 'Visit mentormuni.com',
        secondary: 'Email MentorMuni support',
        loading: 'Loading college administration portal…',
        Icon: ShieldCheck,
      }
    : {
        eyebrow: 'Student portal',
        title: 'This college link doesn’t look right',
        lede:
          'Double-check the URL — or your college may not be on the MentorMuni platform yet.',
        urlLabel: 'You opened',
        checks: [
          <>
            Confirm the college subdomain (example: <em>yourcollege.mentormuni.com</em>)
          </>,
          'Ask your TPO if MentorMuni is already set up for your campus',
          'If you’re new here, start from the main MentorMuni site',
        ],
        notFound: 'We couldn’t find a college portal for this address.',
        loadFail: 'We couldn’t load this college portal right now. Check the URL and try again.',
        cta: 'Go to mentormuni.com',
        secondary: 'Contact MentorMuni',
        loading: 'Finding your college portal…',
        Icon: Link2Off,
      };

  const Icon = copy.Icon;

  return (
    <div className={`mm-unknown-portal mm-unknown-portal--${audience}`}>
      <div className="mm-unknown-portal__glow" aria-hidden />
      <div className="mm-unknown-portal__grid" aria-hidden />

      <motion.header
        className="mm-unknown-portal__brand"
        initial={reduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <img src={LOGO} alt="MentorMuni" />
        <div>
          <strong>MentorMuni</strong>
          <span>{isOrg ? 'College administration platform' : 'Career accelerator platform'}</span>
        </div>
      </motion.header>

      <motion.main
        className="mm-unknown-portal__card"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
      >
        <motion.div
          className="mm-unknown-portal__icon"
          initial={reduceMotion ? false : { scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
          aria-hidden
        >
          <Icon size={28} strokeWidth={2.1} />
        </motion.div>

        <p className="mm-unknown-portal__eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="mm-unknown-portal__lede">{copy.lede}</p>

        <div className="mm-unknown-portal__url" title={host}>
          <span>{copy.urlLabel}</span>
          <code>{host || (slug ? `${slug}.mentormuni.com` : 'unknown address')}</code>
        </div>

        {isOrg ? (
          <div className="mm-unknown-portal__roles" aria-label="Portal roles">
            <span>
              <Building2 size={14} aria-hidden /> TPO / ORG Admin
            </span>
            <span>
              <ShieldCheck size={14} aria-hidden /> HOD
            </span>
          </div>
        ) : null}

        <ul className="mm-unknown-portal__checks">
          {copy.checks.map((item, i) => (
            <li key={i}>
              <CheckCircle2 size={16} aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {error ? (
          <p className="mm-unknown-portal__hint" role="status">
            {/not found/i.test(error) ? copy.notFound : copy.loadFail}
          </p>
        ) : null}

        <div className="mm-unknown-portal__actions">
          <button
            type="button"
            className="mm-unknown-portal__cta"
            onClick={() => {
              window.location.assign(MENTORMUNI_HOME);
            }}
          >
            {copy.cta} <ArrowRight size={18} aria-hidden />
          </button>
          <a
            className="mm-unknown-portal__ghost"
            href={`mailto:${SUPPORT_MAIL}?subject=${encodeURIComponent(
              `${isOrg ? 'Organization' : 'Student'} portal URL help: ${host || slug || ''}`
            )}`}
          >
            <Mail size={16} aria-hidden /> {copy.secondary}
          </a>
        </div>

        <p className="mm-unknown-portal__foot">
          Reach out at{' '}
          <a href={MENTORMUNI_HOME} target="_blank" rel="noopener noreferrer">
            mentormuni.com <ExternalLink size={12} aria-hidden />
          </a>{' '}
          or email{' '}
          <a href={`mailto:${SUPPORT_MAIL}`}>{SUPPORT_MAIL}</a>
        </p>
      </motion.main>
    </div>
  );
}

/** Renders children only when college tenant is ready (or not a tenant host). */
export function CollegeTenantGate({ children, audience = 'student' }) {
  const { locked, loading, college, error } = useCollegeTenantContext();
  const isOrg = audience === 'organization';

  if (!locked) return children;

  if (loading) {
    return (
      <div
        className={`mm-unknown-portal mm-unknown-portal--loading ${
          isOrg ? 'mm-unknown-portal--organization' : ''
        }`}
        role="status"
      >
        <div className="mm-unknown-portal__brand mm-unknown-portal__brand--center">
          <img src={LOGO} alt="MentorMuni" />
          <div>
            <strong>MentorMuni</strong>
            <span>
              {isOrg
                ? 'Loading college administration portal…'
                : 'Finding your college portal…'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !college?.code || !college?.name) {
    return <UnknownCollegePortalPage audience={audience} />;
  }

  return children;
}
