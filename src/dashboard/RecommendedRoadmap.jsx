import React from 'react';

export default function RecommendedRoadmap(){
  return (
    <div className="p-4 bg-white rounded shadow">
      <h4 className="font-semibold">Recommended Roadmap</h4>
      <ol className="mt-3 text-sm text-gray-700 list-decimal list-inside">
        <li>Complete JS fundamentals (2 weeks)</li>
        <li>Build 2 portfolio projects (4 weeks)</li>
        <li>Mock interviews & system design (2 weeks)</li>
      </ol>
    </div>
  );
}
