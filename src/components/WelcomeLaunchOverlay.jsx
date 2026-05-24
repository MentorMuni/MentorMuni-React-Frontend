import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, X, Sparkles } from 'lucide-react';

const OVERLAY_SESSION_KEY = 'mm_welcome_overlay_seen_v2';

function posterAsset(filename) {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  return `${base}MentorMuni-React-Frontend/images/poster-carousel/${filename}`;
}

export default function WelcomeLaunchOverlay() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname !== '/') {
      setOpen(false);
      return;
    }
    try {
      const seen = sessionStorage.getItem(OVERLAY_SESSION_KEY);
      if (!seen) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [pathname]);

  const closeOverlay = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(OVERLAY_SESSION_KEY, '1');
    } catch {
      // ignore storage errors
    }
  };

  const whatsappShareUrl = useMemo(() => {
    const siteUrl = window.location.origin + '/';
    const text =
      'I found MentorMuni for placement preparation: Interview Readiness Test, Aptitude, and Resume ATS tools. Check it out: ' +
      siteUrl;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, []);

  const valueHighlights = [
    { label: 'Mock interviews', short: 'Mocks' },
    { label: 'HR + Technical prep', short: 'HR + Tech' },
    { label: '1:1 Mentorship', short: 'Mentor' },
    { label: 'Study plan', short: 'Plan' },
  ];

  const quickLinks = [
    { label: 'Readiness check', to: '/start-assessment' },
    { label: 'Resume ATS', to: '/resume-analyzer' },
    { label: 'AI mock', to: '/tools/interview-readiness' },
    { label: 'Aptitude', to: '/start-assessment' },
  ];

  if (pathname !== '/') return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[220] flex items-end justify-center sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mm-overlay-title"
        >
          <button
            type="button"
            onClick={closeOverlay}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close welcome overlay"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="relative z-10 flex max-h-[min(92dvh,640px)] w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-white shadow-2xl sm:max-h-[min(90vh,720px)] sm:w-[min(100%,28rem)] sm:rounded-2xl md:max-h-[min(92vh,640px)] md:w-full md:max-w-3xl md:rounded-[1.25rem]"
          >
            <button
              type="button"
              onClick={closeOverlay}
              aria-label="Close"
              className="absolute right-3 top-3 z-30 rounded-full border border-border bg-white/95 p-2 text-muted-foreground shadow-md hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Mobile: content first · Desktop: side-by-side */}
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:grid md:max-h-[min(92vh,640px)] md:grid-cols-[1fr_0.9fr] md:overflow-hidden">
              <div className="flex shrink-0 flex-col p-4 pt-10 sm:p-5 md:overflow-y-auto md:p-6">
                <div className="flex items-center gap-2">
                  <img
                    src={`${import.meta.env.BASE_URL}mentormuni-logo.png`}
                    alt=""
                    className="h-7 w-7 rounded-full border border-border object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary">MentorMuni</p>
                    <p className="truncate text-[11px] text-muted-foreground">Placement readiness</p>
                  </div>
                </div>

                <h2
                  id="mm-overlay-title"
                  className="mt-3 text-xl font-black leading-tight text-foreground sm:text-2xl"
                >
                  Crack placements with AI + mentor
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Free 5-min readiness check → score, gaps, and what to fix first.
                </p>

                <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
                  {valueHighlights.map((item) => (
                    <li
                      key={item.label}
                      className="rounded-lg border border-border bg-secondary/80 px-2 py-1.5 text-[10px] font-semibold leading-snug text-foreground sm:text-[11px]"
                    >
                      <span className="md:hidden">{item.short}</span>
                      <span className="hidden md:inline">{item.label}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 grid grid-cols-2 gap-1.5 sm:mt-4">
                  {quickLinks.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={closeOverlay}
                      className="rounded-lg border border-border bg-white px-2 py-2 text-center text-[10px] font-bold text-primary hover:border-cta-mid hover:bg-secondary sm:text-[11px]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to="/start-assessment"
                    onClick={closeOverlay}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cta px-3 py-2.5 text-xs font-bold text-white shadow-button sm:text-sm"
                  >
                    <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    Free readiness check
                  </Link>
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Share on WhatsApp"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Visual panel — short on mobile, rich on desktop */}
              <div className="relative h-28 shrink-0 overflow-hidden border-t border-border sm:h-32 md:h-auto md:min-h-0 md:border-l md:border-t-0">
                <img
                  src={posterAsset('hr-technical.jpg')}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent md:from-black/80 md:via-black/40"
                  aria-hidden
                />

                <p className="absolute bottom-2 left-3 right-12 text-[10px] font-medium text-white/90 md:hidden">
                  TCS · Infosys · Wipro-style prep
                </p>

                {/* Desktop-only detail cards */}
                <div className="absolute left-3 top-3 hidden max-w-[85%] rounded-lg border border-white/20 bg-black/50 px-2.5 py-2 backdrop-blur-sm md:block">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-sky-200">Live prep</p>
                  <p className="text-[11px] font-semibold text-white">Mock · HR · Tech · Mentor</p>
                </div>
                <div className="absolute bottom-3 left-3 right-3 hidden rounded-lg border border-white/15 bg-black/45 px-3 py-2 backdrop-blur-sm md:block">
                  <p className="text-[11px] text-white/90">Placement confidence + real interview practice</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
