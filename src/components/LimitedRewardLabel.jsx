import React from 'react';
import { Sparkles } from 'lucide-react';

/** Highlighted “Limited reward” chip — use wherever the coupon USP appears. */
export default function LimitedRewardLabel({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FF9500] via-[#F97316] to-[#EA580C] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_2px_14px_-2px_rgba(234,88,12,0.65)] ring-2 ring-white/70 ${className}`}
    >
      <Sparkles className="h-3 w-3 shrink-0 opacity-95" strokeWidth={2.5} aria-hidden />
      Limited reward
    </span>
  );
}
