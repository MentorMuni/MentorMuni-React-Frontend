import React from 'react'
import { Check } from 'lucide-react'

export default function CredibilityIndicators({ points = ["3 Free Career Analyses", "AI-driven personalized roadmap", "No credit card required"] }) {
  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 text-sm text-on-dark-sub">
        {points.map((p, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-800/20 text-primary">
              <Check className="w-3 h-3 text-primary" />
            </span>
            <span className="text-on-dark-sub text-sm">{p}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
