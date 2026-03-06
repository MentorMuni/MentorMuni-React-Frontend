import React, { useState } from 'react';
import { Info, ChevronDown, Star, Award, Send } from 'lucide-react';

/**
 * Enhanced Score Card with tooltip and progress indicator
 * Displays a single score metric with interactive tooltips
 */
const ScoreCard = ({ title, score, icon: Icon, tooltipText, maxScore = 100 }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const percentage = (score / maxScore) * 100;
  
  // Color coding based on score
  const getScoreColor = () => {
    if (score >= 75) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const getScoreLabel = () => {
    if (score >= 75) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
        {/* Header with tooltip */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Icon size={24} className="text-gray-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          </div>
          
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Info size={16} className="text-gray-400" />
            </button>
            
            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-10">
                <p>{tooltipText}</p>
                <div className="absolute top-0 right-3 w-2 h-2 bg-gray-900 transform -translate-y-1 rotate-45"></div>
              </div>
            )}
          </div>
        </div>

        {/* Score Display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold" style={{ color: getScoreColor() }}>
              {score}
            </span>
            <span className="text-gray-400 text-sm">/ {maxScore}</span>
          </div>
          <p className="text-xs font-semibold" style={{ color: getScoreColor() }}>
            {getScoreLabel()}
          </p>
        </div>

        {/* Animated Progress Indicator */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: getScoreColor()
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
