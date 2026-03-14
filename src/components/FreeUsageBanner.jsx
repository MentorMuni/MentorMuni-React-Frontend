import React from 'react';
import { Zap } from 'lucide-react';

const FreeUsageBanner = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-500/30 py-3 px-4 text-center">
      <div className="flex items-center justify-center gap-2 text-sm md:text-base text-emerald-200 font-semibold">
        <Zap className="w-5 h-5 text-emerald-400" />
        <p>
          <span className="text-emerald-300">3 Free Attempts</span> on every tool — No signup or credit card required
        </p>
      </div>
    </div>
  );
};

export default FreeUsageBanner;
