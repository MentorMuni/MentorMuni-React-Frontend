import React from 'react';
import { Zap, Code, BarChart3, Shield, Smartphone, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRIMARY_CTA_LABEL } from '../constants/brandCopy';

/**
 * DESIGN SYSTEM DEMO COMPONENT
 * 
 * This component showcases all the design patterns from MentorMuni's design system.
 * Reference this component when creating new UI elements to maintain visual consistency.
 * 
 * Route: /design-system (hidden from navigation)
 * Access for development: http://localhost:5173/design-system
 */

export default function DesignSystemDemo() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1A1A1A] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9500] to-blue-400">
              Design System
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Reference this page to maintain visual consistency across all components. 
            Use these patterns when building new features.
          </p>
        </div>

        {/* COLOR PALETTE SECTION */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-white mb-8">Color Palette</h2>
          
          {/* Primary Color */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">Primary - Indigo/Blue</h3>
            <p className="text-slate-400 mb-6">Use for primary buttons, links, and main interactive elements.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-[#FF9500] to-blue-600 rounded-2xl p-8 text-center">
                <p className="font-bold">Gradient Background</p>
                <p className="text-sm text-indigo-100 mt-2">from-[#FF9500] to-blue-600</p>
              </div>
              <div className="border border-[#FF9500]/35 bg-[#FF9500]/10 rounded-2xl p-8 text-center hover:border-[#FF9500]/60">
                <p className="font-bold">Subtle Background</p>
                <p className="text-sm text-[#CC7000] mt-2">bg-[#FF9500]/10</p>
              </div>
            </div>
          </div>

          {/* Secondary Color */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">Secondary - Purple</h3>
            <p className="text-slate-400 mb-6">Use for section highlights and secondary features.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center">
                <p className="font-bold">Gradient Background</p>
                <p className="text-sm text-purple-100 mt-2">from-purple-600 to-pink-600</p>
              </div>
              <div className="border border-purple-500/30 bg-purple-500/10 rounded-2xl p-8 text-center hover:border-purple-500/60">
                <p className="font-bold">Subtle Background</p>
                <p className="text-sm text-purple-300 mt-2">bg-purple-500/10</p>
              </div>
            </div>
          </div>

          {/* Accent Color */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">Accent - Orange (CTA Only)</h3>
            <p className="text-slate-400 mb-6">Use ONLY for upgrade buttons and critical CTAs.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center">
                <p className="font-bold">Upgrade Button</p>
                <p className="text-sm text-orange-100 mt-2">from-orange-600 to-red-600</p>
              </div>
              <div className="border border-orange-500/30 bg-orange-500/10 rounded-2xl p-8 text-center hover:border-orange-500/60">
                <p className="font-bold">Subtle Background</p>
                <p className="text-sm text-orange-300 mt-2">bg-orange-500/10</p>
              </div>
            </div>
          </div>
        </section>

        {/* TYPOGRAPHY SECTION */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-white mb-8">Typography</h2>
          
          <div className="space-y-8">
            <div className="border border-slate-700 rounded-2xl p-8">
              <p className="text-xs text-slate-500 mb-2">Hero Heading - 48-56px, font-black</p>
              <h1 className="text-5xl md:text-6xl font-black text-white">
                Get Job Ready in Tech
              </h1>
            </div>

            <div className="border border-slate-700 rounded-2xl p-8">
              <p className="text-xs text-slate-500 mb-2">Section Heading - 28-36px, font-black</p>
              <h2 className="text-4xl font-black text-white">
                Popular Career Transitions
              </h2>
            </div>

            <div className="border border-slate-700 rounded-2xl p-8">
              <p className="text-xs text-slate-500 mb-2">Card Title - 20px, font-bold</p>
              <h3 className="text-xl font-bold text-white">
                Manual Testing to QA Engineer
              </h3>
            </div>

            <div className="border border-slate-700 rounded-2xl p-8">
              <p className="text-xs text-slate-500 mb-2">Body Text - 16px, font-normal</p>
              <p className="text-base text-slate-300 leading-relaxed">
                Learn software testing fundamentals, automation tools, and testing frameworks 
                to transition into QA roles and advance your career in quality assurance.
              </p>
            </div>
          </div>
        </section>

        {/* BUTTON PATTERNS SECTION */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-white mb-8">Button Patterns</h2>
          
          <div className="space-y-8">
            {/* Primary Button */}
            <div>
              <p className="text-sm text-slate-400 mb-3">Primary Button (Indigo)</p>
              <button className="px-8 py-3 rounded-lg font-bold text-white 
                              bg-gradient-to-r from-[#FF9500] to-blue-600 
                              hover:from-[#FF9500] hover:to-blue-500 
                              hover:shadow-lg hover:shadow-[0_4px_14px_rgba(255,149,0,0.2)]
                              transition-all active:scale-95">
                {PRIMARY_CTA_LABEL}
              </button>
            </div>

            {/* Secondary Button */}
            <div>
              <p className="text-sm text-slate-400 mb-3">Secondary Button (Purple)</p>
              <button className="px-8 py-3 rounded-lg font-bold text-slate-300 
                              border border-purple-500/30 
                              bg-purple-500/10 hover:bg-purple-500/20 
                              hover:border-purple-500/50 
                              transition-all active:scale-95">
                Learn More
              </button>
            </div>

            {/* CTA Button */}
            <div>
              <p className="text-sm text-slate-400 mb-3">CTA Button (Orange - Upgrade Only)</p>
              <button className="px-8 py-3 rounded-lg font-bold text-white 
                              bg-gradient-to-r from-orange-600 to-red-600 
                              hover:from-orange-500 hover:to-red-500 
                              hover:shadow-lg hover:shadow-orange-500/30
                              transition-all active:scale-95">
                Upgrade to Pro Now
              </button>
            </div>

            {/* Outline Button */}
            <div>
              <p className="text-sm text-slate-400 mb-3">Outline Button</p>
              <button className="px-8 py-3 rounded-lg font-bold text-[#FF9500] 
                              border border-[#FF9500]/35 
                              hover:border-[#FF9500]/60 hover:bg-[#E88600]/10
                              transition-all active:scale-95">
                View Roadmap
              </button>
            </div>
          </div>
        </section>

        {/* CARD PATTERNS SECTION */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-white mb-8">Card Patterns</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Interactive Card */}
            <div className="group bg-gradient-to-br from-[#FF9500]/20 to-blue-600/20 
                          border border-[#FF9500]/35 rounded-2xl p-6 
                          hover:border-[#FF9500]/60 transition-all 
                          hover:shadow-lg hover:shadow-[0_4px_14px_rgba(255,149,0,0.25)]">
              <Zap className="w-6 h-6 text-[#FF9500] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Interactive Card</h3>
              <p className="text-slate-300 text-sm">
                Cards with hover effects and color gradients for features and paths.
              </p>
            </div>

            {/* Information Card */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/20 
                          border border-slate-700/50 rounded-2xl p-6 
                          hover:border-slate-600 transition-all">
              <Code className="w-6 h-6 text-slate-400 mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Information Card</h3>
              <p className="text-slate-300 text-sm">
                Simple cards for displaying information without heavy interactivity.
              </p>
            </div>
          </div>
        </section>

        {/* CAREER PATH EXAMPLE */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-white mb-8">Example: Career Path Cards</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'QA Engineer', desc: 'Master testing fundamentals' },
              { icon: BarChart3, title: 'Data Analyst', desc: 'Learn SQL and visualization' },
              { icon: Code, title: 'Frontend Dev', desc: 'Build modern web apps' },
              { icon: Zap, title: 'DevOps Engineer', desc: 'Master CI/CD and cloud' }
            ].map(({ icon: Icon, title, desc }, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-[#FF9500]/20 to-blue-600/20 
                          border border-[#FF9500]/35 rounded-2xl p-6 
                          hover:border-[#FF9500]/60 transition-all 
                          hover:shadow-lg hover:shadow-[0_4px_14px_rgba(255,149,0,0.25)]"
              >
                <div className="mb-4 p-3 rounded-lg bg-[#FF9500]/20">
                  <Icon className="w-6 h-6 text-[#FF9500] group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-300 text-sm mb-4">{desc}</p>
                <button className="text-[#FF9500] hover:text-[#CC7000] font-semibold text-sm">
                  View Path →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER NOTE */}
        <div className="border-t border-slate-800 pt-12">
          <p className="text-slate-400 text-sm">
            <strong>How to use this:</strong> Keep this page open in another tab while developing. 
            Reference the patterns above when creating new components. Import from 
            <code className="bg-slate-800 px-2 py-1 rounded text-xs ml-2">designSystem.js</code> 
            and 
            <code className="bg-slate-800 px-2 py-1 rounded text-xs ml-2">DesignSystemComponents.jsx</code>
            for consistent styling.
          </p>
        </div>
      </div>
    </div>
  );
}
