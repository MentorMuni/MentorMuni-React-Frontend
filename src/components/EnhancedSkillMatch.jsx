import React, { useState } from 'react';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';

/**
 * Enhanced Skill Match Section
 * Shows top missing skills preview, benchmark comparison, and detailed report button
 */
const EnhancedSkillMatch = ({ 
  matchPercentage, 
  strongSkills, 
  missingSkills, 
  targetRole,
  isPremium,
  onViewDetailedReport 
}) => {
  const [expandMissing, setExpandMissing] = useState(false);
  
  // Top 5 missing skills preview
  const topMissingSkills = missingSkills.slice(0, 5);
  
  // Benchmark skills for the role (configurable per role)
  const getBenchmarkSkills = (role) => {
    const benchmarks = {
      'backend-developer': ['Docker', 'CI/CD', 'System Design', 'Microservices', 'API Design'],
      'frontend-developer': ['React', 'TypeScript', 'State Management', 'Web Performance', 'Testing'],
      'devops-engineer': ['Kubernetes', 'Infrastructure as Code', 'Monitoring', 'Cloud', 'Scripting'],
      'data-scientist': ['Machine Learning', 'Statistical Analysis', 'Data Visualization', 'Python', 'SQL'],
      'ai-ml-engineer': ['Deep Learning', 'ML Models', 'Neural Networks', 'Natural Language Processing', 'Computer Vision'],
    };
    return benchmarks[role] || ['Technical Depth', 'System Design', 'Problem Solving', 'Leadership', 'Communication'];
  };

  const benchmarkSkills = getBenchmarkSkills(targetRole);

  return (
    <div className="w-full space-y-6">
      {/* Skill Match Percentage */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Skill Match Analysis</h3>
          <div className="text-right">
            <p className="text-3xl font-bold text-indigo-600">{matchPercentage}%</p>
            <p className="text-xs text-gray-500">Match Percentage</p>
          </div>
        </div>

        {/* Match Bar */}
        <div className="relative h-3 bg-blue-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${matchPercentage}%` }}
          ></div>
        </div>

        {/* Match Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">{strongSkills.length}</p>
            <p className="text-xs text-gray-600">Strong Skills</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600">{missingSkills.length}</p>
            <p className="text-xs text-gray-600">Missing Skills</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{Math.round(matchPercentage / 10)}/10</p>
            <p className="text-xs text-gray-600">Score</p>
          </div>
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-gray-600" />
          <h4 className="font-semibold text-gray-800">Top 10% {targetRole.replace(/-/g, ' ')} Have:</h4>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {benchmarkSkills.map((skill, idx) => (
            <div
              key={idx}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                strongSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              {skill}
              {strongSkills.some(s => s.toLowerCase().includes(skill.toLowerCase())) && ' ✓'}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Industry benchmark skills for {targetRole.replace(/-/g, ' ')} roles in India
        </p>
      </div>

      {/* Missing Skills Preview */}
      {missingSkills.length > 0 && (
        <div className={`rounded-2xl p-6 border-2 transition-all ${
          isPremium
            ? 'bg-white border-gray-100'
            : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
        }`}>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setExpandMissing(!expandMissing)}
          >
            <h4 className="font-semibold text-gray-800">
              {expandMissing ? 'All Missing Skills' : 'Top 5 Missing Skills'}
            </h4>
            <div className="text-gray-400">
              {expandMissing ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Skills List */}
          <div className={`mt-4 grid gap-2 ${expandMissing ? 'grid-cols-3' : 'grid-cols-1'}`}>
            {(!expandMissing ? topMissingSkills : missingSkills).map((skill, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  isPremium
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 border border-gray-300'
                }`}
                style={!isPremium ? { filter: 'blur(2px)' } : {}}
              >
                {skill}
              </div>
            ))}
          </div>

          {/* Premium Unlock Message */}
          {!isPremium && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-xs text-blue-700 font-medium">
                🔒 Unlock detailed skill gap analysis and personalized roadmap
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onViewDetailedReport}
          className="flex-1 px-4 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all"
        >
          View Detailed Skill Gap Report
        </button>
        
        <button className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all">
          Get Improvement Roadmap
        </button>
      </div>
    </div>
  );
};

export default EnhancedSkillMatch;
