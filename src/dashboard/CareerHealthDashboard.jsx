import React from 'react';

export default function CareerHealthDashboard(){
  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold">Career Health Dashboard</h2>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded">Resume Score<br/><strong>62 / 100</strong></div>
        <div className="p-4 bg-gray-50 rounded">Skill Gap<br/><strong>Python missing</strong></div>
        <div className="p-4 bg-gray-50 rounded">Interview Readiness<br/><strong>Beginner</strong></div>
      </div>
      <div className="mt-6">Next actions: follow your roadmap, upskill in missing skills, schedule mock interview.</div>
    </div>
  );
}
