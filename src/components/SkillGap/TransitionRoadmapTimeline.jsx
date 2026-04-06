import React, { useState } from 'react';
import { ChevronDown, CheckCircle, Zap, Code, BookOpen, Briefcase } from 'lucide-react';

const TransitionRoadmapTimeline = ({ roadmap }) => {
  const [expandedPhase, setExpandedPhase] = useState(0);

  const phaseIcons = {
    fundamentals: BookOpen,
    hands_on: Code,
    projects: Briefcase,
    interview_prep: Zap,
  };

  const phaseColors = {
    fundamentals: 'from-cyan-600/30 to-cyan-400/10 border-cyan-600/50',
    hands_on: 'from-emerald-600/30 to-emerald-400/10 border-emerald-600/50',
    projects: 'from-purple-600/30 to-purple-400/10 border-purple-600/50',
    interview_prep: 'from-yellow-600/30 to-yellow-400/10 border-yellow-600/50',
  };

  const phaseTextColors = {
    fundamentals: 'text-cyan-400',
    hands_on: 'text-emerald-400',
    projects: 'text-purple-400',
    interview_prep: 'text-yellow-400',
  };

  const getTotalWeeks = () => {
    return roadmap.reduce((total, phase) => total + phase.estimated_weeks, 0);
  };

  const getPhasePercentage = (phase) => {
    const total = getTotalWeeks();
    return (phase.estimated_weeks / total) * 100;
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Transition Roadmap</h2>
        <p className="text-muted-foreground">
          4-phase structured plan spanning approximately {getTotalWeeks()} weeks
        </p>
      </div>

      {/* Timeline Visual */}
      <div className="mb-8 space-y-4">
        {roadmap.map((phase, index) => {
          const Icon = phaseIcons[phase.phase];
          const isExpanded = expandedPhase === index;
          
          return (
            <div key={phase.phase}>
              {/* Phase Header */}
              <button
                onClick={() => setExpandedPhase(isExpanded ? -1 : index)}
                className={`w-full bg-gradient-to-r ${phaseColors[phase.phase]} border rounded-xl p-4 flex items-center justify-between hover:opacity-80 transition-opacity`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FFF4E0] border border-border">
                    <span className={`font-bold text-lg ${phaseTextColors[phase.phase]}`}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${phaseTextColors[phase.phase]}`}>
                      Phase {index + 1}: {phase.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {phase.estimated_weeks} weeks · Focus: {phase.focus_areas.slice(0, 2).join(', ')}
                      {phase.focus_areas.length > 2 ? '...' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-bold ${phaseTextColors[phase.phase]}`}>
                      {phase.estimated_weeks}w
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getPhasePercentage(phase).toFixed(0)}% of timeline
                    </p>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-muted-foreground transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Phase Details */}
              {isExpanded && (
                <div className="mt-2 ml-4 bg-[#FFFDF8] border border-border rounded-xl p-6 space-y-4">
                  {/* Focus Areas */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                      Focus Areas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {phase.focus_areas.map(area => (
                        <span
                          key={area}
                          className={`bg-[#FFF4E0] text-foreground text-sm px-3 py-1 rounded-full border border-border`}
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Skills */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                      Key Skills to Master
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {phase.key_skills.map(skill => (
                        <span
                          key={skill}
                          className={`bg-emerald-600/20 text-emerald-300 text-sm px-3 py-1 rounded-full border border-emerald-600/50`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                      Milestones & Deliverables
                    </p>
                    <ul className="space-y-2">
                      {phase.milestones.map((milestone, idx) => (
                        <li key={idx} className="flex gap-3 text-foreground text-sm">
                          <CheckCircle size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Learning Tips */}
                  <div className="bg-[#FFF4E0] border border-border rounded-lg p-3 mt-4">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold">Learning Tips:</p>
                    <ul className="space-y-1 text-xs text-foreground">
                      <li>• Combine theory with hands-on practice</li>
                      <li>• Build small projects to solidify concepts</li>
                      <li>• Join communities and discuss with peers</li>
                      <li>• Track your progress weekly</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {index < roadmap.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-slate-600 to-slate-700" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Timeline Visualization */}
      <div className="mt-8 bg-[#FFFDF8] border border-border rounded-xl p-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
          Timeline Breakdown
        </p>
        <div className="flex gap-1 h-8">
          {roadmap.map(phase => (
            <div
              key={phase.phase}
              style={{ width: `${getPhasePercentage(phase)}%` }}
              className={`rounded-lg transition-all hover:shadow-lg cursor-pointer ${
                phase.phase === 'fundamentals'
                  ? 'bg-cyan-500'
                  : phase.phase === 'hands_on'
                  ? 'bg-emerald-500'
                  : phase.phase === 'projects'
                  ? 'bg-purple-500'
                  : 'bg-yellow-500'
              }`}
              title={`${phase.title} (${phase.estimated_weeks}w)`}
            />
          ))}
        </div>
        <div className="grid md:grid-cols-4 gap-4 mt-4">
          {roadmap.map((phase, idx) => (
            <div key={phase.phase} className="text-center text-xs">
              <p className="text-muted-foreground font-semibold">Phase {idx + 1}</p>
              <p className="text-foreground mt-1">{phase.estimated_weeks} weeks</p>
            </div>
          ))}
        </div>
      </div>

      {/* Success Tips */}
      <div className="mt-8 bg-[#FFF4E0] border border-[#FFB347]/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Success Tips</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-[#1A8C55] font-bold">✓</span>
            <span>Stay consistent with learning - set specific weekly goals</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1A8C55] font-bold">✓</span>
            <span>Build projects in each phase to apply what you learn</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1A8C55] font-bold">✓</span>
            <span>Document your learning journey on GitHub or a blog</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1A8C55] font-bold">✓</span>
            <span>Engage with communities and mentors for guidance</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1A8C55] font-bold">✓</span>
            <span>Review your progress monthly and adjust if needed</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TransitionRoadmapTimeline;
