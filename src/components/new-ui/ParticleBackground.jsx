import React, { useEffect, useRef } from 'react';
import { useNewUI } from '../../context/NewUIContext';

const MOBILE_MQ = '(max-width: 639px)';
const DESKTOP_PARTICLE_CAP = 20;

/** Subtle ambient dots — desktop only; pauses when tab hidden */
export default function ParticleBackground() {
  const { newUI } = useNewUI();
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!newUI) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const mobileMq = window.matchMedia(MOBILE_MQ);
    if (mobileMq.matches) return undefined;

    const ctx = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let particles = [];

    const resize = () => {
      if (mobileMq.matches) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      const count = Math.min(
        DESKTOP_PARTICLE_CAP,
        Math.floor((width * height) / 52000),
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.08),
        vy: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.08),
        a: Math.random() * 0.1 + 0.05,
      }));
    };

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      if (pausedRef.current || mobileMq.matches) return;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 211, 252, ${p.a})`;
        ctx.fill();
      }
    };

    const onVisibility = () => {
      pausedRef.current = document.hidden;
    };

    const onMqChange = () => {
      if (mobileMq.matches) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        return;
      }
      resize();
    };

    resize();
    draw();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', resize);
    mobileMq.addEventListener('change', onMqChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      mobileMq.removeEventListener('change', onMqChange);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [newUI]);

  if (!newUI) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden sm:block"
    />
  );
}
