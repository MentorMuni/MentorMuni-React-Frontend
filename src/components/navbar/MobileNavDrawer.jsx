import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, LogIn } from 'lucide-react';
import { goToStartAssessment } from '../../utils/startAssessmentNavigation';
import { PRIMARY_CTA_LABEL, READINESS_TEST_COUPON_BADGE } from '../../constants/brandCopy';
import LimitedRewardLabel from '../LimitedRewardLabel';

const panelMotion = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
};

const backdropMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.18 },
};

function getChromeBottom(anchorEl) {
  const headerBottom = anchorEl?.getBoundingClientRect().bottom ?? 64;
  const betaBar = document.querySelector('[data-mm-beta-switch]');
  const betaBottom = betaBar?.getBoundingClientRect().bottom ?? headerBottom;
  return Math.max(headerBottom, betaBottom);
}

export default function MobileNavDrawer({
  open,
  onClose,
  anchorRef,
  navItems,
  tools,
  moreLinks,
  isActive,
}) {
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const [layout, setLayout] = useState({ top: 64, maxHeight: 'calc(100dvh - 4rem)' });

  const updateLayout = useCallback(() => {
    const top = getChromeBottom(anchorRef?.current);
    setLayout({
      top,
      maxHeight: `calc(100dvh - ${top}px)`,
    });
  }, [anchorRef]);

  useEffect(() => {
    if (!open) {
      setToolsExpanded(false);
      return undefined;
    }

    updateLayout();

    const scrollY = window.scrollY;
    document.body.classList.add('mm-mobile-nav-open');
    document.body.style.top = `-${scrollY}px`;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const onResize = () => updateLayout();

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, { passive: true });

    return () => {
      document.body.classList.remove('mm-mobile-nav-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
    };
  }, [open, onClose, updateLayout]);

  const handleNav = () => onClose();

  const panelStyle = {
    top: layout.top,
    maxHeight: layout.maxHeight,
  };

  const backdropStyle = {
    top: layout.top,
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            className="mm-mobile-nav-backdrop"
            style={backdropStyle}
            {...backdropMotion}
            onClick={onClose}
          />
          <motion.aside
            id="mm-mobile-nav-drawer"
            className="mm-mobile-nav-panel"
            style={panelStyle}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            {...panelMotion}
          >
            <div className="mm-mobile-nav-panel__scroll">
              <nav aria-label="Primary">
                {navItems.map((item) => {
                  const active = isActive(item.path, item.exact);
                  const isRoadmap = item.variant === 'roadmap';
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={handleNav}
                      className={`mm-mobile-nav-link${active ? ' mm-mobile-nav-link--active' : ''}${
                        isRoadmap ? ' mm-mobile-nav-link--roadmap' : ''
                      }${active && isRoadmap ? ' mm-mobile-nav-link--active' : ''}`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mm-mobile-nav-section">
                <div
                  className="mm-mobile-nav-accordion"
                  data-open={toolsExpanded ? 'true' : undefined}
                >
                  <button
                    type="button"
                    className="mm-mobile-nav-accordion__trigger"
                    aria-expanded={toolsExpanded}
                    onClick={() => setToolsExpanded((v) => !v)}
                  >
                    Free tools
                    <ChevronDown size={18} className="mm-mobile-nav-accordion__chevron" aria-hidden />
                  </button>
                  {toolsExpanded && (
                    <div className="mm-mobile-nav-accordion__panel">
                      {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <Link
                            key={tool.href}
                            to={tool.href}
                            onClick={handleNav}
                            className="mm-mobile-nav-tool"
                          >
                            <span className="mm-mobile-nav-tool__icon">
                              <Icon size={15} strokeWidth={2} aria-hidden />
                            </span>
                            <span className="mm-mobile-nav-tool__title">{tool.title}</span>
                          </Link>
                        );
                      })}
                      <div className="mm-mobile-nav-promo">
                        <LimitedRewardLabel className="text-[8px] px-2 py-0.5 [&_svg]:h-2.5 [&_svg]:w-2.5" />
                        <p className="mm-mobile-nav-promo__text">{READINESS_TEST_COUPON_BADGE}</p>
                        <button
                          type="button"
                          onClick={() => {
                            handleNav();
                            goToStartAssessment();
                          }}
                          className="mm-mobile-nav-promo__action"
                        >
                          Start free check →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mm-mobile-nav-section">
                <p className="mm-mobile-nav-section__label">Company</p>
                {moreLinks.map(({ label, path, exact, Icon }) => {
                  const active = isActive(path, exact);
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={handleNav}
                      className={`mm-mobile-nav-company${active ? ' mm-mobile-nav-company--active' : ''}`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className="mm-mobile-nav-company__icon">
                        <Icon size={16} strokeWidth={2} aria-hidden />
                      </span>
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mm-mobile-nav-panel__footer">
              <Link to="/login" onClick={handleNav} className="mm-mobile-nav-cta-login">
                <LogIn size={16} aria-hidden />
                Login
              </Link>
              <Link to="/waitlist" onClick={handleNav} className="mm-mobile-nav-cta-waitlist">
                Join waitlist
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleNav();
                  goToStartAssessment();
                }}
                className="mm-mobile-nav-cta-primary"
              >
                {PRIMARY_CTA_LABEL}
                <ArrowRight size={16} aria-hidden />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
