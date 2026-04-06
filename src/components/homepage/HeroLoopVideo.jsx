import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { HERO_LOOP_VIDEO_ENABLED } from '../../config';

const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/** Place files under public/MentorMuni-React-Frontend/videos/ (see config). */
const WEBM = `${BASE}videos/hero-loop.webm`;
const MP4 = `${BASE}videos/hero-loop.mp4`;
const POSTER = `${BASE}videos/hero-poster.jpg`;

/**
 * Optional muted hero loop — deferred until after idle + in-view to protect LCP.
 * Enable with VITE_HERO_LOOP_VIDEO=true after adding assets. Renders nothing if disabled,
 * reduced-motion, load error, or missing files.
 */
export function HeroLoopVideo({ className = '' }) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const [idleReady, setIdleReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !HERO_LOOP_VIDEO_ENABLED) return;
    const ric = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 600));
    const id = ric(() => setIdleReady(true), { timeout: 2500 });
    return () => {
      if (window.cancelIdleCallback && typeof id === 'number') window.cancelIdleCallback(id);
    };
  }, []);

  useEffect(() => {
    if (!HERO_LOOP_VIDEO_ENABLED || !idleReady || reduceMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setInView(true);
      },
      { rootMargin: '120px', threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [idleReady, reduceMotion]);

  const onError = useCallback(() => setFailed(true), []);
  const onLoaded = useCallback(() => setLoaded(true), []);

  if (!HERO_LOOP_VIDEO_ENABLED || reduceMotion || failed) return null;

  const showVideo = idleReady && inView;

  return (
    <div
      ref={containerRef}
      className={`mx-auto w-full max-w-[min(100%,420px)] ${className}`}
    >
      <div
        className={`overflow-hidden rounded-2xl border border-border bg-zinc-100/40 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-90'
        }`}
      >
        <p className="border-b border-border bg-white/80 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          See the flow · muted · loops
        </p>
        <div className="relative aspect-video w-full bg-zinc-900/5">
          {!showVideo && (
            <div
              className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#FFF8EE] to-[#f4f4f5]"
              aria-hidden
            />
          )}
          {showVideo && (
            <video
              className="h-full w-full object-cover"
              muted
              playsInline
              loop
              autoPlay
              preload="none"
              poster={POSTER}
              onLoadedData={onLoaded}
              onError={onError}
              aria-label="Short preview of the interview readiness experience"
            >
              <source src={WEBM} type="video/webm" />
              <source src={MP4} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
