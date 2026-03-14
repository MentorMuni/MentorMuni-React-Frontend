import React from 'react';

export default function ResumeAnalyzer(){
  return (
    <div className="p-4 bg-white rounded shadow">
      <h4 className="font-semibold">Why Your Resume Isn't Getting Interview Calls</h4>
      <div className="text-sm text-gray-600 mt-2">Upload your resume — our AI pinpoints wording, achievements, and structure issues that stop interview invites.</div>
      <div className="mt-4">
        <input type="file" accept=".pdf,.doc,.docx" />
        <div className="mt-3 text-sm text-gray-500">Analyzing resume for keywords, achievements, and role-fit... (simulated)</div>
      </div>
    </div>
  );
}
