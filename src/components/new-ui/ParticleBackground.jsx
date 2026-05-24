import React, { useEffect, useRef } from 'react';
import { useNewUI } from '../../context/NewUIContext';

/** Subtle ambient dots — no network lines (professional, not “tech demo”) */
export default function ParticleBackground() {
  const { newUI } = useNewUI();
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!newUI) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let particles = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      const count = Math.min(28, Math.floor((width * height) / 42000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.08),
        vy: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.08),
        a: Math.random() * 0.12 + 0.04,
      }));
    };

    const draw = () => {
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
        ctx.fillStyle = `rgba(148, 163, 184, ${p.a})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [newUI]);

  if (!newUI) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-100"
    />
  );
}
