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
    <div className="min-h-screen mm-site-theme overflow-x-hidden px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9500] to-blue-400">
              Design System
            </span>
          </h1>
          <p className="max-w-2xl text-xl text-muted-foreground">
            Reference this page to maintain visual consistency across all components. 
            Use these patterns when building new features.
          </p>
        </div>

        {/* COLOR PALETTE SECTION */}
        <section className="mb-20">
          <h2 className="mb-8 text-4xl font-black text-foreground">Color Palette</h2>
          
          {/* Primary Color */}
          <div className="mb-12">
            <h3 className="mb-4 text-2xl font-bold text-foreground">Primary - Indigo/Blue</h3>
            <p className="text-muted-foreground mb-6">Use for primary buttons, links, and main interactive elements.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-gradient-to-r from-[#FF9500] to-blue-600 p-8 text-center text-white">
                <p className="font-bold">Gradient Background</p>
                <p className="mt-2 text-sm text-white/85">from-[#FF9500] to-blue-600</p>
              </div>
              <div className="rounded-2xl border border-cta/35 bg-cta/10 p-8 text-center hover:border-cta/60">
                <p className="font-bold text-foreground">Subtle Background</p>
                <p className="mt-2 text-sm text-warning-text">bg-cta/10</p>
              </div>
            </div>
          </div>

          {/* Secondary Color */}
          <div className="mb-12">
            <h3 className="mb-4 text-2xl font-bold text-foreground">Secondary - Purple</h3>
            <p className="text-muted-foreground mb-6">Use for section highlights and secondary features.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white">
                <p className="font-bold">Gradient Background</p>
                <p className="mt-2 text-sm text-white/85">from-purple-600 to-pink-600</p>
              </div>
              <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-8 text-center hover:border-purple-500/60">
                <p className="font-bold text-foreground">Subtle Background</p>
                <p className="mt-2 text-sm text-violet-700">bg-purple-500/10</p>
              </div>
            </div>
          </div>

          {/* Accent Color */}
          <div className="mb-12">
            <h3 className="mb-4 text-2xl font-bold text-foreground">Accent - Orange (CTA Only)</h3>
            <p className="text-muted-foreground mb-6">Use ONLY for upgrade buttons and critical CTAs.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 p-8 text-center text-white">
                <p className="font-bold">Upgrade Button</p>
                <p className="mt-2 text-sm text-white/85">from-orange-600 to-red-600</p>
              </div>
              <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-8 text-center hover:border-orange-500/60">
                <p className="font-bold text-foreground">Subtle Background</p>
                <p className="mt-2 text-sm text-orange-800">bg-orange-500/10</p>
              </div>
            </div>
          </div>
        </section>

        {/* TYPOGRAPHY SECTION */}
        <section className="mb-20">
          <h2 className="mb-8 text-4xl font-black text-foreground">Typography</h2>
          
          <div className="space-y-8">
            <div className="rounded-2xl border border-border p-8">
              <p className="mb-2 text-xs text-muted-foreground">Hero Heading - 48-56px, font-black</p>
              <h1 className="text-5xl font-black text-foreground md:text-6xl">
                Get Job Ready in Tech
              </h1>
            </div>

            <div className="rounded-2xl border border-border p-8">
              <p className="mb-2 text-xs text-muted-foreground">Section Heading - 28-36px, font-black</p>
              <h2 className="text-4xl font-black text-foreground">
                Popular Career Transitions
              </h2>
            </div>

            <div className="rounded-2xl border border-border p-8">
              <p className="mb-2 text-xs text-muted-foreground">Card Title - 20px, font-bold</p>
              <h3 className="text-xl font-bold text-foreground">
                Manual Testing to QA Engineer
              </h3>
            </div>

            <div className="rounded-2xl border border-border p-8">
              <p className="mb-2 text-xs text-muted-foreground">Body Text - 16px, font-normal</p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Learn software testing fundamentals, automation tools, and testing frameworks 
                to transition into QA roles and advance your career in quality assurance.
              </p>
            </div>
          </div>
        </section>

        {/* BUTTON PATTERNS SECTION */}
        <section className="mb-20">
          <h2 className="mb-8 text-4xl font-black text-foreground">Button Patterns</h2>
          
          <div className="space-y-8">
            {/* Primary Button */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">Primary Button (Indigo)</p>
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
              <p className="text-sm text-muted-foreground mb-3">Secondary Button (Purple)</p>
              <button className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-8 py-3 
                              font-bold text-foreground hover:border-purple-500/50 hover:bg-purple-500/20 
                              transition-all active:scale-95">
                Learn More
              </button>
            </div>

            {/* CTA Button */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">CTA Button (Orange - Upgrade Only)</p>
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
              <p className="text-sm text-muted-foreground mb-3">Outline Button</p>
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
          <h2 className="mb-8 text-4xl font-black text-foreground">Card Patterns</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Interactive Card */}
            <div className="group bg-gradient-to-br from-[#FF9500]/20 to-blue-600/20 
                          border border-[#FF9500]/35 rounded-2xl p-6 
                          hover:border-[#FF9500]/60 transition-all 
                          hover:shadow-lg hover:shadow-[0_4px_14px_rgba(255,149,0,0.25)]">
              <Zap className="w-6 h-6 text-[#FF9500] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="mb-2 text-xl font-bold text-foreground">Interactive Card</h3>
              <p className="text-sm text-muted-foreground">
                Cards with hover effects and color gradients for features and paths.
              </p>
            </div>

            {/* Information Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:border-primary/30">
              <Code className="mb-3 h-6 w-6 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-bold text-foreground">Information Card</h3>
              <p className="text-sm text-muted-foreground">
                Simple cards for displaying information without heavy interactivity.
              </p>
            </div>
          </div>
        </section>

        {/* CAREER PATH EXAMPLE */}
        <section className="mb-20">
          <h2 className="mb-8 text-4xl font-black text-foreground">Example: Career Path Cards</h2>
          
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
                <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{desc}</p>
                <button type="button" className="text-sm font-semibold text-cta hover:text-warning-text">
                  View Path →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER NOTE */}
        <div className="border-t border-border pt-12">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">How to use this:</strong> Keep this page open in another tab while developing.
            Reference the patterns above when creating new components. Import from
            <code className="ml-2 rounded bg-secondary px-2 py-1 text-xs text-foreground">designSystem.js</code>
            and
            <code className="ml-2 rounded bg-secondary px-2 py-1 text-xs text-foreground">DesignSystemComponents.jsx</code>
            for consistent styling.
          </p>
        </div>
      </div>
    </div>
  );
}
