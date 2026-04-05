import React, { useState } from 'react';
import { ChevronDown, AlertCircle, Info, Lightbulb } from 'lucide-react';

const MissingSkillsSection = ({ skills }) => {
  const [expandedPriority, setExpandedPriority] = useState('critical');

  const priorityConfig = {
    critical: {
      label: 'Critical Skills',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      icon: AlertCircle,
      description: 'Must-have for the role. Focus on these first.',
    },
    important: {
      label: 'Important Skills',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/50',
      icon: Info,
      description: 'Highly valuable. Learn these after critical skills.',
    },
    nice_to_have: {
      label: 'Nice to Have',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50',
      icon: Lightbulb,
      description: 'Bonus skills that differentiate you.',
    },
  };

  const categoryCounts = {
    critical: skills.critical?.length || 0,
    important: skills.important?.length || 0,
    nice_to_have: skills.nice_to_have?.length || 0,
  };

  const totalSkills = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  const skillsByCategory = {
    core_skills: 'Core Skills',
    tools: 'Tools & Frameworks',
    concepts: 'Concepts & Principles',
    soft_skills: 'Soft Skills',
  };

  const renderSkillsByPriority = (priority) => {
    const prioritySkills = skills[priority] || [];
    if (!prioritySkills.length) return null;

    // Group by category
    const grouped = {};
    prioritySkills.forEach(skill => {
      const category = skill.category || 'other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(skill.name);
    });

    return (
      <div key={priority} className="mb-6">
        <button
          onClick={() => setExpandedPriority(expandedPriority === priority ? null : priority)}
          className={`w-full ${priorityConfig[priority].bgColor} ${priorityConfig[priority].borderColor} border rounded-xl p-4 flex items-center justify-between hover:opacity-80 transition-opacity`}
        >
          <div className="flex items-center gap-3">
            {React.createElement(priorityConfig[priority].icon, { size: 20, className: priorityConfig[priority].color })}
            <div className="text-left">
              <p className={`font-semibold ${priorityConfig[priority].color}`}>
                {priorityConfig[priority].label}
              </p>
              <p className="text-xs text-muted-foreground">
                {priorityConfig[priority].description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-lg font-bold ${priorityConfig[priority].color}`}>
              {categoryCounts[priority]}
            </span>
            <ChevronDown
              size={20}
              className={`text-muted-foreground transition-transform ${
                expandedPriority === priority ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {expandedPriority === priority && (
          <div className="mt-3 ml-4 space-y-4">
            {Object.entries(grouped).map(([category, skillList]) => (
              <div key={category}>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                  {skillsByCategory[category] || category}
                </p>
                <div className="grid md:grid-cols-2 gap-2">
                  {skillList.map(skillName => (
                    <div
                      key={skillName}
                      className="bg-[#FFF4E0] border border-[#E0DCCF] rounded-lg px-4 py-2 text-sm text-foreground hover:border-[#FFB347] transition-colors"
                    >
                      {skillName}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E0DCCF] p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">Missing Skills Analysis</h2>
        <p className="text-muted-foreground">
          {totalSkills} skills identified across {Object.keys(skillsByCategory).length} categories
        </p>
      </div>

      <div className="space-y-4">
        {renderSkillsByPriority('critical')}
        {renderSkillsByPriority('important')}
        {renderSkillsByPriority('nice_to_have')}
      </div>

      {/* Learning Strategy */}
      <div className="mt-8 bg-[#FFF4E0] border border-[#FFB347]/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recommended Learning Strategy</h3>
        <ol className="space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-bold text-[#1A8C55] flex-shrink-0">1.</span>
            <div>
              <p className="font-semibold text-foreground">Focus on Critical Skills First</p>
              <p className="text-sm text-muted-foreground">These are necessary for the role. Dedicate 4-6 weeks here.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-[#FF9500] flex-shrink-0">2.</span>
            <div>
              <p className="font-semibold text-foreground">Master Important Skills</p>
              <p className="text-sm text-muted-foreground">Build depth with hands-on projects. 4-5 weeks of learning.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-purple-600 flex-shrink-0">3.</span>
            <div>
              <p className="font-semibold text-foreground">Add Nice-to-Have Skills</p>
              <p className="text-sm text-muted-foreground">Differentiators that help you stand out. Time permitting.</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default MissingSkillsSection;
