import React from 'react';
import { Sparkles } from 'lucide-react';

/** Highlighted offer chip — use wherever the coupon USP appears. */
export default function LimitedRewardLabel({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#1A8FC4] via-[#2AAA8A] to-[#15799F] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_2px_14px_-2px_rgba(26,143,196,0.65)] ring-2 ring-white/70 ${className}`}
    >
      <Sparkles className="h-3 w-3 shrink-0 opacity-95" strokeWidth={2.5} aria-hidden />
      Offer
    </span>
  );
}
