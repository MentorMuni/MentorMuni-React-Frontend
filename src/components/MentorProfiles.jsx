import React from 'react';

const MentorCard = ({name, role, company}) => (
  <div className="p-4 bg-white rounded shadow flex items-center gap-4">
    <div className="w-14 h-14 rounded-full bg-gray-200" />
    <div>
      <div className="font-semibold">{name}</div>
      <div className="text-sm text-gray-600">{role} • {company}</div>
    </div>
  </div>
);

export default function MentorProfiles(){
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold">Mentors</h3>
        <p className="text-gray-600 mt-2">Find experienced mentors who guide you through interviews and projects.</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MentorCard name="Priya K" role="Senior Frontend Engineer" company="Acme" />
          <MentorCard name="Rahul M" role="Data Scientist" company="DataCorp" />
          <MentorCard name="Sara L" role="SRE" company="CloudOps" />
        </div>
      </div>
    </section>
  );
}
