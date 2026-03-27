import React from 'react';
import { colors, componentStyles } from '../designSystem';

/**
 * Consistent Button Component using Design System
 * Supports primary, secondary, accent, and outline variants
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses = componentStyles.buttons[variant] || componentStyles.buttons.primary;
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }[size];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Consistent Card Component using Design System
 */
export const Card = ({
  variant = 'base',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = componentStyles.cards[variant] || componentStyles.cards.base;

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Gradient Text Component
 */
export const GradientText = ({ children, gradient = 'primary', className = '' }) => {
  const gradientMap = {
    primary: 'from-[#FF9500] to-blue-400',
    secondary: 'from-purple-400 to-pink-400',
    accent: 'from-orange-400 to-red-400',
    cool: 'from-cyan-400 to-blue-400',
  };

  return (
    <span className={`bg-gradient-to-r ${gradientMap[gradient]} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
};

/**
 * Section Heading Component with consistent typography
 */
export const SectionHeading = ({ 
  title, 
  subtitle, 
  centered = true,
  className = '' 
}) => {
  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

/**
 * Feature Card with consistent styling
 */
export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  colorScheme = 'indigo',
  cta,
  className = '',
  ...props
}) => {
  const colorMap = {
    indigo: { bg: 'from-[#FF9500]/20 to-blue-600/20', border: 'border-[#FF9500]/35', icon: 'text-[#FF9500]' },
    purple: { bg: 'from-purple-600/20 to-pink-600/20', border: 'border-purple-500/30', icon: 'text-purple-400' },
    orange: { bg: 'from-orange-600/20 to-red-600/20', border: 'border-orange-500/30', icon: 'text-orange-400' },
    cyan: { bg: 'from-cyan-600/20 to-emerald-600/20', border: 'border-cyan-500/30', icon: 'text-cyan-400' },
  };

  const color = colorMap[colorScheme] || colorMap.indigo;

  return (
    <Card 
      variant="interactive" 
      className={`bg-gradient-to-br ${color.bg} border ${color.border} ${className}`}
      {...props}
    >
      {Icon && (
        <div className="mb-4 p-3 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900">
          <Icon className={`w-6 h-6 ${color.icon}`} />
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-300 text-sm mb-4 flex-grow">{description}</p>
      {cta && (
        <div className="mt-auto">
          {typeof cta === 'string' ? (
            <a href="#" className="text-[#FF9500] hover:text-[#CC7000] font-semibold text-sm inline-flex items-center gap-1">
              {cta} →
            </a>
          ) : (
            cta
          )}
        </div>
      )}
    </Card>
  );
};

export default { Button, Card, GradientText, SectionHeading, FeatureCard };
