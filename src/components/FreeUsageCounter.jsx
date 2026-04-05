import React, { useState, useEffect } from 'react';
import { Zap, AlertCircle } from 'lucide-react';

const MAX_FREE_ATTEMPTS = 3;

export default function FreeUsageCounter({ toolName, onLimitReached, compact = false }) {
  const MAX_ATTEMPTS = MAX_FREE_ATTEMPTS;
  const storageKey = `mentormuni_${toolName}_usage`;

  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load usage from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      const used = stored ? parseInt(stored, 10) : 0;
      setAttemptsUsed(Math.min(used, MAX_ATTEMPTS)); // Cap at MAX_ATTEMPTS
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading usage from localStorage:', error);
      setIsLoading(false);
    }
  }, [storageKey]);

  const attemptsRemaining = MAX_ATTEMPTS - attemptsUsed;
  const usagePercentage = (attemptsUsed / MAX_ATTEMPTS) * 100;
  const isLimitReached = attemptsRemaining <= 0;

  // Function to increment usage (called when analysis completes)
  const incrementUsage = () => {
    try {
      const newUsage = Math.min(attemptsUsed + 1, MAX_ATTEMPTS);
      setAttemptsUsed(newUsage);
      localStorage.setItem(storageKey, newUsage.toString());

      // Trigger callback when limit is reached
      if (newUsage >= MAX_ATTEMPTS && onLimitReached) {
        onLimitReached();
      }

      return newUsage;
    } catch (error) {
      console.error('Error updating usage:', error);
      return attemptsUsed;
    }
  };

  // Function to reset usage (for testing or admin)
  const resetUsage = () => {
    try {
      setAttemptsUsed(0);
      localStorage.setItem(storageKey, '0');
    } catch (error) {
      console.error('Error resetting usage:', error);
    }
  };

  if (isLoading) {
    return null;
  }

  if (compact) {
    // Compact badge version for headers
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF9500]/20 border border-[#FF9500]/35 text-sm font-medium">
        <Zap size={14} className="text-[#FF9500]" />
        <span className="text-slate-300">
          {attemptsRemaining} / {MAX_ATTEMPTS} free
        </span>
        {isLimitReached && (
          <span className="text-amber-400 font-bold">•</span>
        )}
      </div>
    );
  }

  // Full card version
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={16} className={isLimitReached ? 'text-red-400' : 'text-[#FF9500]'} />
          <p className="text-sm font-semibold text-slate-300">
            Free Attempts
          </p>
        </div>
        <p className={`text-sm font-bold ${
          isLimitReached ? 'text-red-400' : 'text-[#CC7000]'
        }`}>
          {attemptsRemaining} / {MAX_ATTEMPTS}
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-600/30">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            isLimitReached
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : 'bg-gradient-to-r from-[#FF9500] to-cyan-500'
          }`}
          style={{ width: `${usagePercentage}%` }}
        />
      </div>

      {/* Attempts visualization */}
      <div className="flex gap-1.5 mt-3">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-2 rounded-sm transition-all ${
              index < attemptsUsed
                ? 'bg-[#FF9500]'
                : 'bg-slate-700/40 border border-slate-600/30'
            }`}
          />
        ))}
      </div>

      {/* Status message */}
      {isLimitReached && (
        <div className="flex items-start gap-2 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">
            Free limit reached. Upgrade to continue analyzing.
          </p>
        </div>
      )}

      {/* Remaining attempts message */}
      {!isLimitReached && attemptsRemaining <= 1 && (
        <div className="flex items-start gap-2 mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300">
            {attemptsRemaining} attempt left before upgrade
          </p>
        </div>
      )}

      {/* For development: hidden reset button */}
      <div className="mt-2 hidden">
        <button
          onClick={resetUsage}
          className="text-xs text-muted-foreground hover:text-muted-foreground"
        >
          [Dev: Reset]
        </button>
      </div>
    </div>
  );
}

// Export the increment function via a hook for external usage
export function useFreeUsageTracker(toolName) {
  const storageKey = `mentormuni_${toolName}_usage`;
  const MAX_ATTEMPTS = 3;

  const incrementUsage = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      const currentUsage = stored ? parseInt(stored, 10) : 0;
      const newUsage = Math.min(currentUsage + 1, MAX_ATTEMPTS);
      localStorage.setItem(storageKey, newUsage.toString());
      return {
        newUsage,
        isLimitReached: newUsage >= MAX_ATTEMPTS
      };
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return { newUsage: 0, isLimitReached: false };
    }
  };

  const getUsageInfo = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      const used = stored ? parseInt(stored, 10) : 0;
      const capped = Math.min(used, MAX_ATTEMPTS);
      return {
        used: capped,
        remaining: MAX_ATTEMPTS - capped,
        max: MAX_ATTEMPTS,
        isLimitReached: capped >= MAX_ATTEMPTS
      };
    } catch (error) {
      console.error('Error getting usage info:', error);
      return {
        used: 0,
        remaining: MAX_ATTEMPTS,
        max: MAX_ATTEMPTS,
        isLimitReached: false
      };
    }
  };

  const resetUsage = () => {
    try {
      localStorage.setItem(storageKey, '0');
    } catch (error) {
      console.error('Error resetting usage:', error);
    }
  };

  return { incrementUsage, getUsageInfo, resetUsage };
}
