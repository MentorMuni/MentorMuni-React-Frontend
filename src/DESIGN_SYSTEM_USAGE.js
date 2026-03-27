/**
 * DESIGN SYSTEM USAGE GUIDE
 * 
 * This file documents how to use MentorMuni's design system throughout the application.
 * Follow these patterns to ensure visual consistency across all components.
 * 
 * ============================================================
 * QUICK START
 * ============================================================
 * 
 * Import the design system:
 * import { colors, typography, componentStyles, spacing } from '../designSystem';
 * 
 * Import reusable components:
 * import { Button, Card, SectionHeading, FeatureCard, GradientText } from './DesignSystemComponents';
 * 
 * ============================================================
 * COLOR PALETTE USAGE
 * ============================================================
 * 
 * PRIMARY (Indigo/Blue) - #6366f1
 * Use for:
 *   - Primary action buttons ("Check Interview Readiness", "Start Free")
 *   - Main navigation highlights
 *   - Primary interactive elements
 *   - Links and focus states
 * 
 * Example:
 *   className="bg-gradient-to-r from-[#FF9500] to-blue-600 
 *             hover:from-[#FF9500] hover:to-blue-500"
 * 
 * 
 * SECONDARY (Purple) - #a855f7
 * Use for:
 *   - Feature cards and highlights
 *   - Secondary UI elements
 *   - Section backgrounds
 *   - Alternative accent elements
 * 
 * Example:
 *   className="border border-purple-500/30 
 *             bg-purple-500/10 hover:bg-purple-500/20"
 * 
 * 
 * ACCENT (Orange) - #f97316
 * Use ONLY for:
 *   - "Upgrade" buttons and CTAs
 *   - Critical conversion actions
 *   - High priority call-to-action messages
 *   - Premium feature highlights
 * 
 * Example:
 *   className="bg-gradient-to-r from-orange-600 to-red-600 
 *             hover:from-orange-500 hover:to-red-500"
 * 
 * 
 * NEUTRAL (Slate Gray)
 * Use for:
 *   - Text content
 *   - Backgrounds
 *   - Borders
 *   - Secondary UI
 * 
 * Text colors:
 *   - text-white (headings, important text)
 *   - text-slate-300 (body text)
 *   - text-slate-400 (secondary text)
 *   - text-slate-500 (captions)
 * 
 * Background colors:
 *   - bg-slate-900/80 (dark backgrounds)
 *   - bg-slate-800/50 (cards)
 *   - bg-slate-700/30 (borders)
 * 
 * ============================================================
 * COMPONENT PATTERNS
 * ============================================================
 * 
 * BUTTON PATTERNS
 * 
 * Primary Button (Indigo/Blue gradient):
 *   <Link to="/path"
 *     className="px-6 py-3 rounded-lg font-bold text-white 
 *               bg-gradient-to-r from-[#FF9500] to-blue-600 
 *               hover:from-[#FF9500] hover:to-blue-500 
 *               hover:shadow-lg hover:shadow-[0_4px_14px_rgba(255,149,0,0.2)]
 *               transition-all active:scale-95"
 *   >
 *     Check My Status
 *   </Link>
 * 
 * 
 * Secondary Button (Purple outline):
 *   <button
 *     className="px-6 py-3 rounded-lg font-bold text-slate-300 
 *               border border-purple-500/30 
 *               bg-purple-500/10 hover:bg-purple-500/20 
 *               hover:border-purple-500/50 
 *               transition-all active:scale-95"
 *   >
 *     Learn More
 *   </button>
 * 
 * 
 * CTA Button (Orange gradient - UPGRADE ONLY):
 *   <button
 *     className="px-6 py-3 rounded-lg font-bold text-white 
 *               bg-gradient-to-r from-orange-600 to-red-600 
 *               hover:from-orange-500 hover:to-red-500 
 *               hover:shadow-lg hover:shadow-orange-500/30
 *               transition-all active:scale-95"
 *   >
 *     Upgrade Now
 *   </button>
 * 
 * 
 * CARD PATTERNS
 * 
 * Base Card (for information):
 *   className="bg-gradient-to-br from-slate-800/50 to-slate-800/20 
 *             border border-slate-700/50 rounded-2xl p-6 
 *             hover:border-slate-600 transition-all"
 * 
 * 
 * Interactive Card (for features/paths):
 *   className="bg-gradient-to-br from-slate-800/50 to-slate-800/20 
 *             border border-slate-700/50 rounded-2xl p-6 
 *             hover:border-[#FF9500]/50 hover:shadow-lg 
 *             hover:shadow-[0_2px_12px_rgba(255,149,0,0.15)] transition-all"
 * 
 * 
 * Features Card with Color Scheme:
 *   const colorScheme = 'indigo'; // or 'purple', 'orange', 'cyan'
 *   className={`bg-gradient-to-br from-${colorScheme}-600/20 to-${colorScheme}-600/20 
 *              border border-${colorScheme}-500/30 rounded-2xl p-6`}
 *   // NOTE: Tailwind doesn't support dynamic classes, so you may need inline styles
 *   // or a map of predefined classes
 * 
 * 
 * TYPOGRAPHY PATTERNS
 * 
 * Hero Heading (Page title):
 *   className="text-5xl sm:text-6xl md:text-7xl font-black 
 *             leading-[1.1] tracking-tight
 *             text-transparent bg-clip-text 
 *             bg-gradient-to-r from-white to-indigo-300"
 * 
 * 
 * Section Heading:
 *   className="text-4xl md:text-5xl font-black text-white mb-4"
 * 
 * 
 * Card Title:
 *   className="text-xl font-bold text-white"
 * 
 * 
 * Body Text:
 *   className="text-base text-slate-300 leading-relaxed"
 * 
 * 
 * Small Text / Caption:
 *   className="text-sm text-slate-400"
 * 
 * 
 * GRADIENT TEXT
 * 
 * Use GradientText component:
 *   import { GradientText } from './DesignSystemComponents';
 *   
 *   <h1>
 *     Welcome to <GradientText>MentorMuni</GradientText>
 *   </h1>
 *   
 *   // With custom gradient
 *   <p>
 *     <GradientText gradient="accent">Upgrade to Pro</GradientText>
 *   </p>
 * 
 * ============================================================
 * SPACING & LAYOUT
 * ============================================================
 * 
 * Sections:
 *   py-20 px-6 (vertical padding, responsive horizontal)
 * 
 * Containers:
 *   max-w-7xl mx-auto (max width with center alignment)
 * 
 * Cards:
 *   gap-6 (consistent spacing between cards)
 *   p-6 (internal padding)
 * 
 * Buttons:
 *   px-6 py-3 (horizontal, vertical padding)
 *   gap-2 (spacing between icon and text)
 * 
 * ============================================================
 * HOVER EFFECTS
 * ============================================================
 * 
 * All interactive elements should have:
 *   transition-all (smooth transitions)
 *   active:scale-95 (press feedback)
 *   hover:shadow-lg and hover:shadow-{color}/30 (depth)
 * 
 * Primary Button:
 *   hover:scale-[1.02] (slight growth)
 *   hover:shadow-lg hover:shadow-[0_4px_14px_rgba(255,149,0,0.2)]
 * 
 * Card:
 *   hover:border-[#FF9500]/50 (color change)
 *   hover:shadow-lg hover:shadow-[0_2px_12px_rgba(255,149,0,0.15)] (shadow)
 * 
 * ============================================================
 * DO's AND DON'Ts
 * ============================================================
 * 
 * DO:
 * ✓ Use only the three primary colors (indigo, purple, orange)
 * ✓ Follow the typography scale (hero, section, card, body)
 * ✓ Use gradients for interactive elements
 * ✓ Maintain consistent padding and spacing
 * ✓ Add hover effects to all interactive elements
 * ✓ Use semi-transparent overlays (e.g., /30, /50)
 * ✓ Use backdrop-blur for depth
 * ✓ Keep shadows consistent with color scheme
 * 
 * DON'T:
 * ✗ Introduce new colors not in the palette
 * ✗ Use different button styles for the same action
 * ✗ Mix multiple gradient colors in one element
 * ✗ Use orange for anything other than upgrades/CTAs
 * ✗ Inconsistent typography sizes
 * ✗ Dense layouts without whitespace
 * ✗ Static UI without hover effects
 * ✗ Clash gradient colors with text colors
 * 
 * ============================================================
 * EXAMPLES
 * ============================================================
 * 
 * EXAMPLE 1: Feature Card Section
 * 
 * const careerPaths = [
 *   {
 *     title: 'Frontend Developer',
 *     description: 'Learn React and JavaScript',
 *     icon: Code,
 *     colorScheme: 'indigo'
 *   }
 * ];
 * 
 * {careerPaths.map(path => (
 *   <div 
 *     key={path.title}
 *     className="bg-gradient-to-br from-[#FF9500]/20 to-blue-600/20 
 *               border border-[#FF9500]/35 rounded-2xl p-6 
 *               hover:border-[#FF9500]/60 transition-all 
 *               hover:shadow-lg hover:shadow-[0_4px_14px_rgba(255,149,0,0.25)]"
 *   >
 *     <path.icon className="w-6 h-6 text-[#FF9500] mb-4" />
 *     <h3 className="text-xl font-bold text-white mb-2">{path.title}</h3>
 *     <p className="text-slate-300 text-sm">{path.description}</p>
 *   </div>
 * ))}
 * 
 * 
 * EXAMPLE 2: Consistent CTA Buttons
 * 
 * // Primary action (Indigo)
 * <Link to="/assess"
 *   className="px-8 py-3 rounded-lg bg-gradient-to-r 
 *             from-[#FF9500] to-blue-600 
 *             hover:from-[#FF9500] hover:to-blue-500
 *             text-white font-bold transition-all 
 *             hover:shadow-lg hover:shadow-[0_4px_14px_rgba(255,149,0,0.2)]"
 * >
 *   Start Assessment
 * </Link>
 * 
 * // Upgrade action (Orange)
 * <Button 
 *   to="/upgrade"
 *   className="px-8 py-3 rounded-lg bg-gradient-to-r 
 *             from-orange-600 to-red-600 
 *             hover:from-orange-500 hover:to-red-500
 *             text-white font-bold transition-all 
 *             hover:shadow-lg hover:shadow-orange-500/30"
 * >
 *   Upgrade to Pro
 * </Button>
 * 
 * ============================================================
 */

export const DESIGN_SYSTEM_REFERENCE = {
  version: '1.0.0',
  colors: {
    primary: 'Indigo (#6366f1) - Main brand color',
    secondary: 'Purple (#a855f7) - Accent color',
    accent: 'Orange (#f97316) - CTA/Upgrade only',
    neutral: 'Slate Gray - Text, backgrounds, borders',
  },
  typography: {
    headings: 'Inter, Poppins',
    body: 'Inter',
    heroSize: '48-56px',
    sectionSize: '28-36px',
    cardSize: '20-24px',
    bodySize: '16-18px',
  },
  patterns: {
    buttons: ['primary', 'secondary', 'accent', 'outline'],
    cards: ['base', 'interactive', 'elevated'],
    spacing: ['section', 'container', 'card', 'button'],
  },
};

export default DESIGN_SYSTEM_REFERENCE;
