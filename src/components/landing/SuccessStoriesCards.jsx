import React from 'react';
import { Star, Building2 } from 'lucide-react';

const STORIES = [
  {
    name: 'Rahul',
    college: 'VIT',
    before: 'Failed 4 interviews',
    after: 'Placed at Deloitte',
    quote: 'MentorMuni’s readiness test showed exactly where I was weak. The AI mocks and mentor sessions got me interview-ready in weeks.',
    avatar: 'R',
  },
  {
    name: 'Priya',
    college: 'BITS Pilani',
    before: 'Low confidence in HR rounds',
    after: 'Placed at Amazon',
    quote: 'The AI mock interviews felt so real. I got detailed feedback and improved my communication. Cracked my dream company!',
    avatar: 'P',
  },
  {
    name: 'Arjun',
    college: 'IIIT Hyderabad',
    before: 'Struggled with DSA rounds',
    after: 'Placed at Microsoft',
    quote: 'From 40% readiness to 85% in 6 weeks. The personalized plan and mentor guidance made all the difference.',
    avatar: 'A',
  },
];

export default function SuccessStoriesCards() {
  return (
    <section className="py-20 md:py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4">
          Outcomes
        </h2>
        <p className="text-slate-600 text-center text-lg max-w-2xl mx-auto mb-16">
          Real students. Real placements. Real results.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {STORIES.map((story, i) => (
            <div
              key={story.name}
              className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 hover:shadow-card hover:border-slate-300 transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">&ldquo;{story.quote}&rdquo;</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-bold">
                  {story.avatar}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{story.name} – {story.college}</p>
                  <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3" /> {story.after}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-md bg-red-50 text-red-700">Before: {story.before}</span>
                <span className="px-2 py-1 rounded-md bg-success/10 text-green-700">After: {story.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
