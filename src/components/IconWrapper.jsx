import React from 'react';

/**
 * Reusable IconWrapper component for consistent icon sizing and styling
 * Usage: <IconWrapper size="md" icon={<MyIcon />} />
 * 
 * Sizes:
 * - xs: 16px (nav items, badges)
 * - sm: 20px (inline text, small cards)
 * - md: 24px (standard cards, buttons)
 * - lg: 32px (feature highlights, section headers)
 * - xl: 40px (hero sections, stat displays)
 */
const IconWrapper = ({ 
  icon, 
  size = 'md',
  className = '',
  color = 'inherit',
  strokeWidth = 2,
  ...props 
}) => {
  const sizeMap = {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '32px',
    xl: '40px',
  };

  const sizePixels = sizeMap[size] || sizeMap.md;

  // Clone the icon with consistent properties
  if (!icon) return null;

  return React.cloneElement(icon, {
    width: sizePixels,
    height: sizePixels,
    strokeWidth,
    className: `inline-block ${color !== 'inherit' ? '' : ''} ${className}`,
    style: {
      color: color !== 'inherit' ? color : 'currentColor',
      ...props.style
    },
    ...props,
  });
};

export default IconWrapper;
