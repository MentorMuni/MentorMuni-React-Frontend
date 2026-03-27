import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearningPathsDropdown = ({ isActive, learningPathsItems, variant }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect mobile/desktop changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Position dropdown from the left so options are never cut off on the right
  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current && isOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        const margin = 16;
        const width = window.innerWidth - margin * 2;
        setDropdownStyle({
          position: 'fixed',
          top: `${rect.bottom + 4}px`,
          left: `${margin}px`,
          width: `${width}px`,
          maxWidth: '1280px',
          zIndex: 9999,
          pointerEvents: 'auto',
        });
      }
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isClickInButton = buttonRef.current && buttonRef.current.contains(e.target);
      const isClickInDropdown = dropdownRef.current && dropdownRef.current.contains(e.target);
      
      if (!isClickInButton && !isClickInDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle hover with delay to prevent flickering
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (!isMobile) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      // Add 150ms delay before closing to prevent flicker when cursor moves to dropdown
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  const handleClick = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Button - prominent when variant="usp" (Our USP) */}
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
          variant === 'usp'
            ? isOpen || isActive
              ? 'text-cyan-400 bg-cyan-400/15 border border-cyan-500/40'
              : 'text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/15 hover:border-cyan-400/60 hover:text-white'
            : isOpen || isActive
            ? 'text-[#FF9500] bg-[#FFB347]/10'
            : 'text-slate-300 hover:text-white hover:bg-white/5'
        }`}
      >
        {variant === 'usp' && <Zap size={14} className="flex-shrink-0" />}
        Learning Paths
        <ChevronDown
          size={15}
          className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Portal Dropdown - Renders at document body level */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="bg-slate-900 border border-[#E0DCCF] rounded-xl shadow-2xl p-6 sm:p-8 transition-all duration-300 ease-out opacity-100 visible translate-y-0 animate-in fade-in slide-in-from-top-2"
          >
            {/* Grid Layout - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
              {learningPathsItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => {
                    setIsOpen(false);
                    if (closeTimeoutRef.current) {
                      clearTimeout(closeTimeoutRef.current);
                    }
                  }}
                  className="group/item p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800/80 border border-[#E0DCCF] hover:border-[#FF9500]/50 transition-all duration-200 transform hover:scale-105 hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className="text-2xl mb-3 group-hover/item:scale-125 transition-transform duration-200">
                    {item.icon}
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-white mb-1.5 text-sm">{item.title}</h4>

                  {/* Description */}
                  <p className="text-xs text-slate-300 group-hover/item:text-slate-200 transition-colors line-clamp-2">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>

            {/* Optional: Divider line at bottom */}
            <div className="mt-5 pt-5 border-t border-[#F0ECE0]">
              <p className="text-xs text-slate-500">
                Tip: Choose a learning path that matches your goals and skill level
              </p>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default LearningPathsDropdown;
