import React from 'react';
import { Star, Clock, BarChart3, BookOpen, ExternalLink } from 'lucide-react';

const RecommendedCoursesSection = ({ courses }) => {
  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'internal':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'partner':
        return 'bg-blue-500/20 text-blue-400';
      case 'affiliate':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Recommended Courses</h2>
        <p className="text-muted-foreground">
          {courses.length} curated courses to bridge your skill gaps
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="bg-[#FFFDF8] border border-border rounded-xl p-6 hover:border-[#FF9500]/50 transition-all hover:shadow-lg"
          >
            {/* Header with Provider and Type */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  {course.provider}
                </p>
                <h3 className="text-lg font-bold text-foreground mt-1 mb-2 leading-snug">
                  {course.title}
                </h3>
              </div>
              <span className={`${getTypeColor(course.type)} text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap`}>
                {course.type === 'internal' ? 'Our Course' : course.type === 'partner' ? 'Partner' : 'Affiliate'}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {course.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-border">
              {/* Level */}
              <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border ${getLevelColor(course.level)}`}>
                <BarChart3 size={14} />
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-[#FFF4E0] text-foreground border border-border">
                <Clock size={14} />
                {course.duration_hours} hrs
              </div>

              {/* Rating */}
              {course.rating > 0 && (
                <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">
                  <Star size={14} />
                  {course.rating.toFixed(1)}
                </div>
              )}
            </div>

            {/* Skills Covered */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                Skills Covered
              </p>
              <div className="flex flex-wrap gap-2">
                {course.skills_covered.slice(0, 3).map(skill => (
                  <span
                    key={skill}
                    className="bg-[#FF9500]/15 text-[#CC7000] text-xs px-2 py-1 rounded-md border border-[#FF9500]/40"
                  >
                    {skill}
                  </span>
                ))}
                {course.skills_covered.length > 3 && (
                  <span className="text-xs text-muted-foreground px-2 py-1">
                    +{course.skills_covered.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Enrollment Info */}
            {course.students_enrolled > 0 && (
              <div className="text-xs text-muted-foreground mb-4">
                {course.students_enrolled.toLocaleString()} students enrolled
              </div>
            )}

            {/* CTA Button */}
            <button className="w-full bg-gradient-to-r from-[#FF9500] to-[#E88600] text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-[#FF9500]/30 transition-all flex items-center justify-center gap-2">
              <BookOpen size={16} />
              {course.affiliate_url ? 'View Course' : 'Enroll Now'}
              {course.affiliate_url && <ExternalLink size={14} />}
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No courses recommended at this time.</p>
        </div>
      )}

      {/* Learning Path Suggestion */}
      <div className="mt-8 bg-[#FFF4E0] border border-[#FFB347]/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">How to Use These Courses</h3>
        <ul className="space-y-2 text-muted-foreground text-sm">
          <li className="flex gap-3">
            <span className="text-[#1A8C55] font-bold">▪</span>
            <span>Start with courses marked as <strong className="text-foreground">Beginner</strong></span>
          </li>
          <li className="flex gap-3">
            <span className="text-yellow-500 font-bold">▪</span>
            <span>Progress to <strong className="text-foreground">Intermediate</strong> once you're comfortable</span>
          </li>
          <li className="flex gap-3">
            <span className="text-red-500 font-bold">▪</span>
            <span>Advanced courses help you master advanced concepts</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#FF9500] font-bold">▪</span>
            <span>Combine courses with hands-on projects for better learning</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RecommendedCoursesSection;
