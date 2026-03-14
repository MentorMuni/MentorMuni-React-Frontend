import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTAButtons = ({ 
  primaryText = "Check My Interview Readiness", 
  primaryHref = "/start-assessment",
  secondaryText = "Analyze My Resume",
  secondaryHref = "/resume-analyzer",
  variant = "default",
  className = ""
}) => {
  const isPrimary = variant === 'primary';

  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      {/* Primary CTA */}
      <Link 
        to={primaryHref}
        className="btn-primary px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2 group"
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        {primaryText} <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Secondary CTA */}
      <Link 
        to={secondaryHref}
        className="btn-secondary px-8 py-4 rounded-xl font-bold transition-all inline-flex items-center justify-center gap-2 group"
      >
        {secondaryText} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default CTAButtons;
