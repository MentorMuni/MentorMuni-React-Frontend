import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const GapSummaryCard = ({ summary }) => {
  const { readiness_score, confidence_score, estimated_weeks, can_transition, summary: summaryText } = summary;

  const getReadinessColor = () => {
    if (readiness_score >= 80) return 'text-green-400';
    if (readiness_score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getReadinessBgColor = () => {
    if (readiness_score >= 80) return 'from-green-600/20 to-green-400/10 border-green-600/50';
    if (readiness_score >= 60) return 'from-yellow-600/20 to-yellow-400/10 border-yellow-600/50';
    return 'from-red-600/20 to-red-400/10 border-red-600/50';
  };

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl border border-slate-600 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Your Readiness Score</h2>
          <p className="text-slate-300">Complete analysis of your transition potential</p>
        </div>
        {can_transition ? (
          <CheckCircle size={48} className="text-green-400" />
        ) : (
          <AlertCircle size={48} className="text-red-400" />
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Readiness Score */}
        <div className={`bg-gradient-to-br ${getReadinessBgColor()} border rounded-xl p-6`}>
          <p className="text-slate-300 text-sm font-semibold mb-2">Readiness Score</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className={`text-4xl font-bold ${getReadinessColor()}`}>
              {readiness_score.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-full rounded-full ${
                readiness_score >= 80
                  ? 'bg-green-500'
                  : readiness_score >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              } transition-all`}
              style={{ width: `${readiness_score}%` }}
            />
          </div>
          <p className="text-slate-400 text-xs mt-2">
            {readiness_score >= 80 ? 'Excellent' : readiness_score >= 60 ? 'Good' : 'Needs Work'}
          </p>
        </div>

        {/* Confidence Score */}
        <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-400/10 border border-cyan-600/50 rounded-xl p-6">
          <p className="text-slate-300 text-sm font-semibold mb-2">Confidence</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-bold text-cyan-400">
              {confidence_score.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="h-full rounded-full bg-cyan-500 transition-all"
              style={{ width: `${confidence_score}%` }}
            />
          </div>
          <p className="text-slate-400 text-xs mt-2">How sure we are</p>
        </div>

        {/* Estimated Time */}
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-400/10 border border-purple-600/50 rounded-xl p-6">
          <p className="text-slate-300 text-sm font-semibold mb-2">Estimated Time</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-bold text-purple-400">
              {estimated_weeks}
            </span>
            <span className="text-slate-400 text-lg">weeks</span>
          </div>
          <p className="text-slate-400 text-xs mt-6">
            With ~10-15 hrs/week dedicated learning
          </p>
        </div>

        {/* Status */}
        <div className={`bg-gradient-to-br ${
          can_transition
            ? 'from-green-600/20 to-green-400/10 border-green-600/50'
            : 'from-red-600/20 to-red-400/10 border-red-600/50'
        } border rounded-xl p-6`}>
          <p className="text-slate-300 text-sm font-semibold mb-2">Can Transition?</p>
          <div className="mb-4">
            <span className={`text-2xl font-bold ${
              can_transition ? 'text-green-400' : 'text-red-400'
            }`}>
              {can_transition ? 'Yes' : 'No'}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-6">
            {can_transition
              ? 'You have sufficient foundation'
              : 'Focus on core skills first'
            }
          </p>
        </div>
      </div>

      {/* Summary Text */}
      <div className="mt-8 bg-slate-700/50 border border-slate-600 rounded-xl p-6">
        <p className="text-slate-200 leading-relaxed">
          {summaryText}
        </p>
      </div>
    </div>
  );
};

export default GapSummaryCard;
