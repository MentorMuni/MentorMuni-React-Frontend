import React from 'react';

export default function SkillGapPanel(){
  return (
    <div className="p-4 bg-white rounded shadow">
      <h4 className="font-semibold">Skill Gap</h4>
      <div className="text-sm text-gray-600 mt-2">Top missing skills for your target role:</div>
      <ul className="mt-3 text-sm text-gray-700 list-disc list-inside">
        <li>Python</li>
        <li>System Design basics</li>
      </ul>
    </div>
  );
}
