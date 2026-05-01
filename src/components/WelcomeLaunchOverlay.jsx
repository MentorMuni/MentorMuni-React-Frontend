import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, X, Sparkles } from 'lucide-react';

const OVERLAY_SESSION_KEY = 'mm_welcome_overlay_seen_v1';

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
    {
      label: 'Mock Interviews',
      style:
        'border-[#FED7AA] bg-gradient-to-r from-[#FFF3E8] to-[#FFE8D2] text-[#9A3412] shadow-[0_8px_24px_-12px_rgba(234,88,12,0.55)]',
      dot: 'bg-[#F97316]',
    },
    {
      label: 'AI-driven Interview Prep (HR + Technical)',
      style:
        'border-[#BFDBFE] bg-gradient-to-r from-[#EAF3FF] to-[#DCEBFF] text-[#1E3A8A] shadow-[0_8px_24px_-12px_rgba(37,99,235,0.5)]',
      dot: 'bg-[#2563EB]',
    },
    {
      label: '1:1 Mentorship',
      style:
        'border-[#DDD6FE] bg-gradient-to-r from-[#F2ECFF] to-[#E9DDFF] text-[#5B21B6] shadow-[0_8px_24px_-12px_rgba(124,58,237,0.5)]',
      dot: 'bg-[#7C3AED]',
    },
    {
      label: 'Personalized Study Plan',
      style:
        'border-[#BBF7D0] bg-gradient-to-r from-[#ECFDF3] to-[#DCFCE7] text-[#166534] shadow-[0_8px_24px_-12px_rgba(22,163,74,0.5)]',
      dot: 'bg-[#16A34A]',
    },
  ];

  const testTracks = [
    { label: 'HR + Tech', style: 'border-[#FFE3B5] bg-[#FFF7ED] text-[#C2410C]' },
    { label: 'Aptitude', style: 'border-[#C7D2FE] bg-[#EEF2FF] text-[#3730A3]' },
    { label: 'ATS Resume', style: 'border-[#BBF7D0] bg-[#ECFDF3] text-[#166534]' },
  ];

  const quickLinks = [
    { label: 'Resume ATS Score', to: '/resume-analyzer' },
    { label: 'Readiness Test', to: '/start-assessment' },
    { label: 'Aptitude Test', to: '/start-assessment' },
    { label: 'AI Mock Test', to: '/tools/interview-readiness' },
  ];

  if (pathname !== '/') return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[220] flex items-center justify-center p-4 sm:p-6"
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
            className="absolute inset-0 bg-black/65 backdrop-blur-md sm:backdrop-blur-lg"
            aria-label="Close welcome overlay backdrop"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="relative z-10 w-[min(95vw,30rem)] overflow-hidden rounded-[1.2rem] border border-white/15 bg-white shadow-[0_35px_100px_-25px_rgba(0,0,0,0.45)] sm:w-full sm:max-w-4xl sm:rounded-[1.6rem] sm:max-h-[min(92vh,840px)]"
          >
            <button
              type="button"
              onClick={closeOverlay}
              aria-label="Close welcome card"
              className="absolute right-3 top-3 z-30 rounded-full border border-white/25 bg-gradient-to-br from-[#FF4D4F] to-[#EA580C] p-2 text-white shadow-[0_8px_22px_-8px_rgba(239,68,68,0.75)] transition hover:brightness-110"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid max-h-[90vh] overflow-y-auto md:grid-cols-[1.05fr_0.95fr] md:max-h-[min(92vh,840px)] md:overflow-hidden">
              <div className="order-2 p-4 sm:order-1 sm:p-6 md:p-8">
                <div className="flex items-center gap-2">
                  <img
                    src={`${import.meta.env.BASE_URL}mentormuni-logo.png`}
                    alt="MentorMuni logo"
                    className="h-8 w-8 rounded-full border border-[#FFE3B5] object-cover sm:h-9 sm:w-9"
                  />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B45309]">MentorMuni</p>
                    <p className="text-xs text-muted-foreground">Placement Readiness Platform</p>
                  </div>
                </div>

                <h2 id="mm-overlay-title" className="mt-3 text-2xl font-black leading-tight text-foreground sm:mt-4 sm:text-3xl md:text-4xl">
                  Crack placements.
                  <br />
                  With AI + Mentor.
                </h2>
                <p className="mt-2 text-sm font-semibold text-[#B45309] sm:mt-3 sm:text-base">
                  5-min reality check to clear action plan.
                </p>

                <motion.div
                  className="mt-4 grid gap-2 sm:mt-5 sm:gap-3"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.09, delayChildren: 0.08 },
                    },
                  }}
                >
                  {valueHighlights.map((item) => (
                    <motion.div
                      key={item.label}
                      variants={{
                        hidden: { opacity: 0, y: 8, scale: 0.98 },
                        visible: { opacity: 1, y: 0, scale: 1 },
                      }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black sm:gap-2.5 sm:px-4 sm:py-2 sm:text-xs md:px-4.5 md:py-2.5 md:text-[13px] ${item.style}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                      {item.label}
                    </motion.div>
                  ))}
                </motion.div>

                <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:flex-wrap sm:gap-2">
                  <Link
                    to="/start-assessment"
                    onClick={closeOverlay}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#EA580C] px-4 py-2.5 text-sm font-bold text-white"
                  >
                    <Sparkles className="h-4 w-4" />
                    Take Free Reality Check
                  </Link>
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Share on WhatsApp"
                    title="Share on WhatsApp"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#22C55E]/40 bg-[#ECFDF3] text-[#166534] shadow-sm transition hover:bg-[#DFF7E8]"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="relative order-1 min-h-[430px] md:order-2 md:min-h-full">
                <img
                  src={posterAsset('hr-technical.jpg')}
                  alt="MentorMuni interview readiness dashboard"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" aria-hidden />
                <motion.div
                  className="absolute left-3 top-3 z-20 rounded-xl border border-orange-200/60 bg-black/45 px-3 py-2 text-white backdrop-blur-sm sm:left-4 sm:top-4"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200">Live prep stack</p>
                  <p className="mt-1 text-xs font-semibold">Mock + HR + Technical + Mentor</p>
                </motion.div>
                <div className="absolute left-3 right-3 top-16 rounded-xl border border-white/25 bg-black/45 p-3 backdrop-blur-sm sm:left-4 sm:right-4 sm:top-20">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-200">For you if you want</p>
                  <p className="mt-1 text-xs font-semibold text-white sm:text-sm">Placement confidence + real interview practice.</p>
                </div>
                <div className="absolute left-3 right-3 top-36 z-20 rounded-xl border border-[#FCDDB3] bg-gradient-to-br from-[#FFF8EE] to-white p-2.5 shadow-[0_12px_28px_-14px_rgba(249,115,22,0.55)] sm:left-4 sm:right-4 sm:p-3">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#9A3412]">Assessment tracks</p>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    {testTracks.map((item) => (
                      <div key={item.label} className={`rounded-lg border px-1.5 py-1.5 shadow-sm ${item.style}`}>
                        <p className="text-[9px] font-black leading-tight">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-16 left-3 right-3 z-20 rounded-xl border border-[#BFDBFE] bg-gradient-to-br from-[#F0F7FF] to-white p-2.5 shadow-[0_12px_28px_-14px_rgba(37,99,235,0.45)] sm:bottom-16 sm:left-4 sm:right-4 sm:p-3">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#1E3A8A]">Quick actions</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {quickLinks.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={closeOverlay}
                        className="rounded-md border border-[#D1E6FF] bg-white px-2 py-1.5 text-[10px] font-bold text-[#1E3A8A] hover:border-[#60A5FA]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/20 bg-black/50 p-2.5 backdrop-blur-sm sm:bottom-4 sm:left-4 sm:right-4 sm:p-3">
                  <p className="text-[11px] text-white/90 sm:text-xs">
                    TCS | Infosys | Wipro style prep
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
