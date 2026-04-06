import React from 'react';
import { Zap, Target, Briefcase } from 'lucide-react';

/**
 * Assessment Badge System
 * Displays dynamic badge and explanation based on ATS score
 */
const AssessmentBadge = ({ atsScore, targetRole }) => {
  // Determine badge level and details
  const getAssessmentLevel = () => {
    if (atsScore >= 75) {
      return {
        level: 'Strong Candidate',
        badge: 'strong',
        icon: Zap,
        color: '#10b981',
        bgColor: '#ecfdf5',
        borderColor: '#a7f3d0',
        explanation: `Your ${targetRole} resume is well-structured and showcases strong technical fundamentals. Continue building specialized expertise in high-demand areas.`
      };
    } else if (atsScore >= 60) {
      return {
        level: 'Competitive',
        badge: 'competitive',
        icon: Target,
        color: '#f59e0b',
        bgColor: '#fffbeb',
        borderColor: '#fde68a',
        explanation: `Your resume demonstrates solid experience for a ${targetRole} role. Strategic optimization can significantly improve your chances with top companies.`
      };
    } else {
      return {
        level: 'Needs Improvement',
        badge: 'needs-improvement',
        icon: Briefcase,
        color: '#ef4444',
        bgColor: '#fef2f2',
        borderColor: '#fecaca',
        explanation: `Your ${targetRole} resume needs improvement in key areas. Adding specific achievements and technical depth can dramatically boost your candidacy.`
      };
    }
  };

  const assessment = getAssessmentLevel();
  const Icon = assessment.icon;

  return (
    <div className="w-full">
      {/* Badge Header */}
      <div
        className="rounded-xl p-6 border-2 transition-all hover:shadow-md"
        style={{
          backgroundColor: assessment.bgColor,
          borderColor: assessment.borderColor
        }}
      >
        {/* Badge Title */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: assessment.color + '20' }}
          >
            <Icon size={24} style={{ color: assessment.color }} />
          </div>
          <h3 className="text-xl font-bold" style={{ color: assessment.color }}>
            {assessment.level}
          </h3>
        </div>

        {/* Explanation */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {assessment.explanation}
        </p>

        {/* Action Hint */}
        <div className="mt-4 pt-4 border-t border-gray-300 border-opacity-40">
          <p className="text-xs text-muted-foreground font-semibold">
            💡 Tip: Use our professional services to optimize your resume
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentBadge;
