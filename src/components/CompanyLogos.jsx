import React from 'react'

const companiesDefault = ['TCS','Infosys','Capgemini','Accenture']

export default function CompanyLogos({ companies = companiesDefault }){
  return (
    <div className="mt-6">
      <div className="text-sm text-on-dark-sub mb-3">Students placed in</div>
      <div className="flex items-center gap-6 flex-wrap">
        {companies.map((c) => (
          <div key={c} className="flex items-center justify-center h-8 px-4 grayscale opacity-80 hover:opacity-100 transition-opacity duration-200 rounded bg-transparent border border-transparent">
            <div className="text-sm font-semibold text-on-dark">{c}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
