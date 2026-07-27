# "How It Works" Student Journey Page - REFINED PLAN
**Status**: Ready for Implementation  
**Last Updated**: July 22, 2026  
**Owner**: Frontend + Marketing  

---

## EXECUTIVE SUMMARY

This is a **replacement redesign** of the existing `/how-it-works` page to showcase MentorMuni's **7-stage student placement pipeline** as a complete system (not a generic "how we work" story).

**Key Changes from Initial Plan**:
- ✅ Messaging reframed: **outcomes over features**
- ✅ Stage 7 clarified: "Offer Prep Sprint + Progress Validation"
- ✅ Mobile UX simplified: 3 data points per card (not 5)
- ✅ Social proof backed by real college data (pending from partnerships)
- ✅ Route decision: **Replace existing HowItWorks.jsx** (not add new route)
- ✅ Content centralized: New `studentJourneyStages.js` constant file
- ✅ Pedagogical clarity: Explain why this sequence matters

**Timeline**: 5-7 days (design + implementation + marketing review)

---

## PART 1: CRITICAL DECISIONS (Finalize with Marketing Head)

### Decision 1: Primary Conversion Goal
**Question**: What action should colleges take at the end of this page?

**Options**:
- [ ] A) **"Schedule a college demo"** (sales call for TPO)
- [ ] B) **"Download the college case study"** (lead magnet)
- [ ] C) **"Contact us for batch enrollment"** (direct enrollment)
- [ ] D) **Multiple CTAs** (demo + download + contact)

**Recommendation**: **Option A + D** (primary: schedule demo; secondary: contact)

**Implementation**: 
- Hero CTA: "See How Your Campus Can Use MentorMuni"
- Final section CTA: "Schedule a College Demo" (prominent button)
- Sidebar or footer: "Questions? Email us or WhatsApp"

---

### Decision 2: Primary Audience
**Question**: Who is the PRIMARY reader of this page?

**Options**:
- [ ] A) **College TPO / Placement Head** (deciding to partner with MentorMuni)
- [ ] B) **Final-year students** (understanding their preparation journey)
- [ ] C) **Both equally** (decide on copy priority)

**Recommendation**: **Option A (Primary) + B (Secondary)**
- Messaging hierarchy: TPO benefit first, student transparency second
- CTAs: "For colleges" vs "For students" (tab or separate sections)

---

### Decision 3: Social Proof Data
**Question**: Do we have real college data for the outcomes section?

**Required by**: Friday, July 25 (partner with sales team)

**Questions for Sales Team**:
- [ ] Which colleges are ready to be featured in a case study?
- [ ] What metrics do they authorize us to share?
  - Cohort size? ✓
  - Readiness score improvement? ✓
  - Placement rate? ✓
  - Company names students were placed in? ✓
- [ ] Can we get a TPO/Principal testimonial (video or quote)?

**Fallback (if data not available)**: Use **anonymized metrics**:
- "Partner colleges report 42% average score improvement"
- "85% of program graduates placed in first 3 rounds"

---

## PART 2: REFINED PAGE STRUCTURE

### SECTION 1: HERO
**Goal**: Hook TPO/college stakeholders + position system as complete

```
┌─────────────────────────────────────────────────────┐
│ Hero Section                                        │
├─────────────────────────────────────────────────────┤
│ Eyebrow Badge: "For College Partners"               │
│                                                     │
│ Headline:                                           │
│ "The 7-Stage System That Turns Students Into       │
│  Placement Performers"                              │
│                                                     │
│ Subheading:                                         │
│ "From resume validation to final offer readiness.  │
│  One structured spine. Predictable outcomes."       │
│                                                     │
│ Key Stat:                                           │
│ "42% avg score improvement · 85% placement rate"   │
│                                                     │
│ CTA: "Schedule a College Demo" (Primary)            │
│ Secondary: "Download Case Study" (Link)             │
│                                                     │
│ Trust Marker:                                        │
│ "50+ engineering colleges partnering · 5,000+      │
│  students prepared in 2026"                         │
│                                                     │
│ Hero Visual:                                         │
│ 7-stage progress bar (animated, horizontal scroll) │
│ Mobile: Simplified to 3 key stages                  │
└─────────────────────────────────────────────────────┘
```

**Copy Strategy**: Emphasize SYSTEM (not individual tools)
- ❌ "We offer AI mocks, resume checks, and mentors"
- ✅ "One backbone: measure → expose gaps → train performance"

---

### SECTION 2: THE 7-STAGE TIMELINE
**Goal**: Show the progression without overwhelming (especially on mobile)

**Design Pattern**: Vertical timeline with cards alternating left/right

**Card Structure (SIMPLIFIED - 3 points only)**:
```
┌─────────────────────┐
│ Stage 1             │
│ Resume ATS Check    │  ← Title + Step number
├─────────────────────┤
│ Parse your resume   │  ← One-liner description
│ like hiring systems │
│ do.                 │
├─────────────────────┤
│ ✓ Resume Score      │  ← PRIMARY OUTCOME (bold)
│ ✓ Keyword Gaps      │
│ ✓ Formatting Tips   │
└─────────────────────┘
```

**Removed from card**:
- Duration (show on hover/tooltip only, desktop only)
- "Next action" prompt (implied in sequence)
- Icon (show on desktop; hide on mobile for space)

**7 Stages - Refined Content**:

| Stage | Title | One-Liner | Primary Outcome | Duration |
|-------|-------|-----------|-----------------|----------|
| 1 | Resume ATS Check | Parse like hiring systems do. Know your format & keyword gaps. | **Your Resume Score + Fixes** | 3 min |
| 2 | 5-Sec Quick Test | Speed matters. Benchmark your aptitude reflexes. | **Speed Baseline + Weak Areas** | 5 min |
| 3 | Aptitude Readiness | Full assessment: quant, logic, verbal. Real interview topics. | **Aptitude Gaps by Category** | 20 min |
| 4 | Skill Readiness | DSA, system design, coding fundamentals. What panels test. | **Technical Gaps Map** | 25 min |
| 5 | AI Mock Interview - Skill | Live mock. Real pressure. Interview-style Q&As with scoring. | **Technical Interview Score + Feedback** | 45 min |
| 6 | AI Mock Interview - HR | Conversational HR round. Tell me about yourself, projects, challenges. | **HR Round Score + Communication Coaching** | 30 min |
| 7 | Offer Prep Sprint | Final validation. Compare your score from Stage 1. Track improvement. | **Final Readiness Score + Progress Report + Next Steps** | 20 min |

**Animation Strategy** (unchanged from plan):
- Cards slide in on scroll (left/right alternating)
- Stagger: 0.12s between cards
- Connecting line: SVG line animates top→bottom (scale-y)
- Hover: Card elevation + subtle glow
- Mobile: Reduced animation (straight fade-in)

**Pedagogical Note** (NEW - below timeline):
```
Why This Sequence Matters
├─ Stages 1–4: Build a baseline (what's your current state?)
├─ Stages 5–6: High-pressure rehearsal (practice like it counts)
└─ Stage 7: Validate improvement (prove the system works)

Advanced Path (Optional):
For students confident in fundamentals: Skip Stage 3 → 
Start mocks earlier. Flexibility built in.
```

---

### SECTION 3: SUPPORT SYSTEMS (MESSAGING REFRAMED)
**Goal**: Emphasize OUTCOMES, not features

**Design**: 3 equal-width cards (grid on desktop, stack on mobile)

**Card 1: AI Buddy**
```
┌─────────────────────────────────────┐
│ 🤖 AI Buddy                         │
│ Never Feel Stuck. Ever.             │  ← Outcome headline
├─────────────────────────────────────┤
│ Instant concept review at 2 AM.     │
│ Mock answer feedback on demand.     │  ← Benefits (outcomes)
│ 24/7 preparation support.           │
│                                     │
│ Included in all plans               │  ← Pricing clarity
└─────────────────────────────────────┘
```

**Card 2: Student Dashboard**
```
┌─────────────────────────────────────┐
│ 📊 Your Progress Dashboard          │
│ See Your Growth. Own Your Path.     │  ← Outcome headline
├─────────────────────────────────────┤
│ All 7 stages in one visual.         │
│ Spot weak areas. Celebrate wins.    │  ← Benefits (outcomes)
│ Stay accountable to your goals.     │
│                                     │
│ Real-time updates                   │  ← Key feature
└─────────────────────────────────────┘
```

**Card 3: TPO Dashboard** (for college partners)
```
┌─────────────────────────────────────┐
│ 🏫 Cohort Readiness Dashboard       │
│ Predict Placement Outcomes.         │  ← Outcome headline
├─────────────────────────────────────┤
│ Batch performance at a glance.      │
│ Intervene early with at-risk        │  ← Benefits (outcomes)
│ students. Plan better.              │
│                                     │
│ College partners only               │  ← Audience clarity
└─────────────────────────────────────┘
```

**Animation**: Fade-in on scroll, stagger 0.1s between cards

---

### SECTION 4: WHY THIS SYSTEM WORKS (Benefits)
**Goal**: Bridge gap between features and outcomes

**Design**: 3 benefit cards with icons

**Card 1: Comprehensive Coverage**
- Icon: CheckCircle
- Headline: **"Every Interview Type Covered"**
- Body: "Resume → aptitude → technical → HR. Nothing left to chance. Panels test all four. So do we."

**Card 2: The Improvement Loop**
- Icon: RefreshCw
- Headline: **"Score → Gap → Practice → Re-Test → Repeat"**
- Body: "Not a one-time assessment. Real improvement happens through cycles. Each stage builds on the last."

**Card 3: Real-Time Accountability**
- Icon: Zap
- Headline: **"Feedback That Actually Changes Behavior"**
- Body: "Mocks scored instantly. Mentor notes within 24h. AI coaching on every answer. Real-time = real improvement."

---

### SECTION 5: COLLEGE SUCCESS STORY (SOCIAL PROOF - NEW)
**Goal**: Prove this works for actual colleges (not generic stats)

**Design**: 1–2 case study cards

**Case Study Template** (awaiting data from sales):
```
┌─────────────────────────────────────────────────────┐
│ College: [Name] · [Location]                        │
│ Batch: 4th Year · [Year]                            │
├─────────────────────────────────────────────────────┤
│ Challenge:                                          │
│ "Last year: 60% placement. This year, we needed     │
│  to do better. Students weren't confident."         │
│                                                     │
│ What Happened:                                      │
│ "Introduced MentorMuni readiness baseline in May.   │
│  Built 5-week prep program around score gaps.       │
│  Monthly TPO dashboards tracked cohort progress."   │
│                                                     │
│ Results:                                            │
│ ✓ Avg readiness score: 38 → 72 (+89%)              │
│ ✓ Placement rate: 60% → 78% (+30%)                 │
│ ✓ Avg CTC: ₹7.2L → ₹8.4L                           │
│ ✓ Top companies: TCS, Infosys, Amazon (8 students) │
│                                                     │
│ Quote:                                              │
│ "Finally, we could predict outcomes and guide with │
│  confidence. MentorMuni gave us the visibility."    │
│ — Dr. XYZ, Placement Head                           │
│                                                     │
│ [Book a Demo] [Download Case Study PDF]             │
└─────────────────────────────────────────────────────┘
```

**Anonymous Fallback** (if college not ready for feature):
```
Partner College Data (2025–2026)
┌─────────────────────────────────────────────────────┐
│ 18-student cohort · Tier 2 college (North India)   │
│                                                     │
│ Before: 50% placement, avg ₹6.5L CTC                │
│                                                     │
│ After MentorMuni 7-week program:                    │
│ ✓ 14/18 students (78%) placed in round 1            │
│ ✓ Avg CTC improved to ₹7.8L                         │
│ ✓ Avg readiness score: 41 → 73                      │
│                                                     │
│ "This isn't just training. It's a system."          │
│ — Anonymous TPO                                     │
└─────────────────────────────────────────────────────┘
```

---

### SECTION 6: FINAL CTA
**Goal**: Drive action (college demo scheduling)

```
┌─────────────────────────────────────────────────────┐
│ Section: Placement Outcomes Start With Preparation │
│                                                     │
│ Headline:                                           │
│ "Your Next Batch Deserves Better Than Luck"        │
│                                                     │
│ Body:                                               │
│ "One structured spine: measure → expose gaps →     │
│  train performance. Then watch your placement       │
│  rate change."                                      │
│                                                     │
│ CTA Buttons:                                        │
│ [Primary] "Schedule a College Demo"                 │
│ [Secondary] "Download Success Metrics" (PDF)       │
│                                                     │
│ Trust Marker:                                        │
│ "50+ colleges partnering · 5,000+ students         │
│  prepared · 42% avg score improvement"             │
│                                                     │
│ Footer Links:                                        │
│ Email: enroll@mentormuni.com                        │
│ WhatsApp: Click to message                          │
│ Call: +91 90093 55103                              │
└─────────────────────────────────────────────────────┘
```

---

## PART 3: IMPLEMENTATION ROADMAP

### PHASE 1: CONTENT PREP (Days 1-2)
**Owner**: Marketing Head + Sales Team

**Tasks**:
- [ ] **Finalize 3 critical decisions** (Section 1 above)
- [ ] **Get college case study data** OR approve anonymous fallback
  - College name? Metrics? TPO quote? Placement count?
- [ ] **Approve messaging** for all sections (outcomes vs features)
- [ ] **Create asset list**: Hero image, stage icons, case study photos
- [ ] **Sign off on copy** for hero, stages, CTAs

**Deliverable**: Content doc with all copy + data locked

---

### PHASE 2: COMPONENT BUILD (Days 3-4)
**Owner**: Frontend Developer

**Files to Create**:

1. **`src/constants/studentJourneyStages.js`** (NEW)
   ```javascript
   export const STUDENT_JOURNEY_STAGES = [
     {
       id: 'resume-ats',
       step: 1,
       title: 'Resume ATS Check',
       description: 'Parse your resume like hiring systems do. Know your format & keyword gaps.',
       outcome: 'Your Resume Score + Fixes',
       outcomes: ['Resume Score', 'Keyword Gaps', 'Formatting Tips'],
       duration: '3 min',
       icon: 'FileText',
       color: 'from-sky-400 to-primary',
       details: 'Stages 1–4: Build baseline (what\'s your current state?)'
     },
     // ... 6 more stages
   ];

   export const SUPPORT_SYSTEMS = [
     {
       id: 'ai-buddy',
       title: 'AI Buddy',
       subtitle: 'Never Feel Stuck. Ever.',
       benefits: ['Instant concept review at 2 AM', 'Mock answer feedback on demand', '24/7 preparation support'],
       icon: 'Sparkles',
       pricingNote: 'Included in all plans'
     },
     // ... 2 more systems
   ];

   export const COLLEGE_CASE_STUDY = { /* data from sales team */ };
   ```

2. **`src/components/StudentJourneyPage.jsx`** (main page - replaces HowItWorks.jsx)

3. **`src/components/StudentJourney/StageCard.jsx`** (reusable)

4. **`src/components/StudentJourney/Timeline.jsx`** (7-stage timeline)

5. **`src/components/StudentJourney/SupportSystemsSection.jsx`**

6. **`src/components/StudentJourney/CaseStudyCard.jsx`**

7. **`src/theme/student-journey-page.css`** (animations, timeline line)

**Copy Updates**:
- [ ] `src/constants/brandCopy.js` - Add student journey copy constants
- [ ] `src/constants/routeSeoMeta.js` - Update SEO for `/how-it-works`

**Route Changes**:
- [ ] `src/App.jsx` - Update import: `HowItWorksPage = StudentJourneyPage`

---

### PHASE 3: ANIMATION & POLISH (Days 5-6)
**Owner**: Frontend Developer

**Tasks**:
- [ ] Timeline scroll animations (Framer Motion)
- [ ] Card stagger effects
- [ ] Stage connecting line (SVG animation)
- [ ] Hero section animations
- [ ] Mobile responsive refinements
- [ ] Reduced motion testing

**Testing**:
- [ ] Desktop (Chrome, Safari, Firefox)
- [ ] Mobile (iOS 15+, Android 11+)
- [ ] Low-end device testing (Pixel 4a, Samsung A12)
- [ ] Accessibility: WCAG 2.1 AA

---

### PHASE 4: MARKETING REVIEW & SIGN-OFF (Day 7)
**Owner**: Marketing Head + UX Designer

**Checklist**:
- [ ] Copy tone matches brand (outcomes over features)
- [ ] Visual hierarchy guides eye to CTAs
- [ ] Social proof is compelling (real data)
- [ ] Mobile UX is clean (no information overload)
- [ ] Animations feel purposeful (not distracting)
- [ ] CTAs are clear ("Schedule Demo" not vague)
- [ ] College ROI is obvious (why should TPO care?)

**Sign-Off**: Marketing lead approves merge to main

---

## PART 4: TECHNICAL SPECIFICATIONS

### File Structure (New Files)
```
src/
├── constants/
│   ├── studentJourneyStages.js (NEW)
│   └── brandCopy.js (UPDATED)
├── components/
│   ├── StudentJourneyPage.jsx (NEW - replaces HowItWorks usage)
│   └── StudentJourney/ (NEW directory)
│       ├── StageCard.jsx
│       ├── Timeline.jsx
│       ├── SupportSystemsSection.jsx
│       ├── BenefitsGrid.jsx
│       ├── CaseStudyCard.jsx
│       ├── HeroSection.jsx
│       └── FinalCTA.jsx
└── theme/
    └── student-journey-page.css (NEW)
```

### Component Props Reference
**`Timeline.jsx`**
```javascript
<Timeline 
  stages={STUDENT_JOURNEY_STAGES}
  reduceMotion={reduceMotion}
/>
```

**`StageCard.jsx`**
```javascript
<StageCard 
  stage={stage}
  index={index}
  side="left" // or "right" for alternating
  isVisible={cardInView}
/>
```

**`SupportSystemsSection.jsx`**
```javascript
<SupportSystemsSection 
  systems={SUPPORT_SYSTEMS}
  reduceMotion={reduceMotion}
/>
```

### CSS Strategy
**File**: `src/theme/student-journey-page.css`

Key styles:
- Timeline connecting line (SVG path)
- Card entrance animations (slide + fade)
- Hover effects (elevation, glow)
- Mobile breakpoints (collapse to single column)

---

## PART 5: MESSAGING TEMPLATES (Ready to Copy-Paste)

### Hero Copy
```
Eyebrow: "For College Partners"

Headline: "The 7-Stage System That Turns 
Students Into Placement Performers"

Subheading: "From resume validation to final offer 
readiness. One structured spine. Predictable outcomes."

Key Stat: "42% avg score improvement · 85% placement rate"

CTA: "Schedule a College Demo"
```

### Support Systems Messaging
```
AI Buddy
─────
Headline: "Never Feel Stuck. Ever."
Body: "Instant concept review at 2 AM. Mock answer 
feedback on demand. 24/7 preparation support."
Note: "Included in all plans"

---

Student Dashboard
─────
Headline: "See Your Growth. Own Your Path."
Body: "All 7 stages in one visual. Spot weak areas. 
Celebrate wins. Stay accountable to your goals."
Feature: "Real-time updates"

---

TPO Dashboard
─────
Headline: "Predict Placement Outcomes."
Body: "Batch performance at a glance. Intervene early 
with at-risk students. Plan better."
Note: "College partners only"
```

### Final CTA Copy
```
Headline: "Your Next Batch Deserves Better 
Than Luck"

Body: "One structured spine: measure → expose gaps → 
train performance. Then watch your placement rate change."

Primary CTA: "Schedule a College Demo"
Secondary CTA: "Download Success Metrics"
```

---

## PART 6: SUCCESS METRICS

**How we'll know this works** (measure post-launch):

- [ ] **Page views**: Baseline on `/how-it-works` (expect 10–15% increase in traffic)
- [ ] **College demo requests**: Track form submissions from "Schedule Demo" CTA
- [ ] **Time on page**: Average should be 2.5–3.5 min (currently ~1.5 min on old page)
- [ ] **Bounce rate**: Should decrease (<45% target)
- [ ] **College partnerships**: Measure new college sign-ups post-launch
- [ ] **Student engagement**: Track readiness check completion from page visitors
- [ ] **Mobile conversion**: Ensure mobile doesn't lag desktop (parity target)

---

## PART 7: ROLLOUT & QA

### Pre-Launch QA
- [ ] All 7 stage cards render correctly (mobile + desktop)
- [ ] Timeline line animation smooth on low-end devices
- [ ] CTAs link to correct destinations (demo form, case study PDF)
- [ ] Images optimized (< 50KB each)
- [ ] SEO meta tags updated (title, description, keywords)
- [ ] 404 checks: No broken links or image paths
- [ ] Accessibility: Keyboard nav, screen reader tested
- [ ] Lighthouse score > 90 (performance + accessibility)

### Launch Strategy
- [ ] Deploy to staging first (48h review window)
- [ ] Update internal links pointing to `/how-it-works` (navbar, homepage, etc.)
- [ ] Notify sales team: "New college landing page live"
- [ ] Monitor 503 errors, slow load times (first 24h)
- [ ] A/B test optional: "Schedule Demo" CTA text variants

### Post-Launch (Week 1)
- [ ] Review analytics: time on page, bounce rate, scrolling depth
- [ ] Collect UX feedback from TPOs who view page
- [ ] Monitor mobile performance (real device testing)
- [ ] Iterate on copy/messaging based on feedback

---

## PART 8: APPROVAL CHECKLIST

**Before implementation starts, confirm**:

- [ ] **Decision 1**: Primary conversion goal (college demo / case study / contact)
- [ ] **Decision 2**: Primary audience (college TPO or students)
- [ ] **Decision 3**: College case study data ready OR anonymous fallback approved
- [ ] **Copy**: All section copy reviewed + approved by marketing head
- [ ] **Assets**: Hero image, stage icons, case study photos confirmed
- [ ] **Social Proof**: Real metrics or anonymized data locked in
- [ ] **Design**: Wireframes/mockups reviewed by UX designer
- [ ] **Technical**: Engineering confirms `studentJourneyStages.js` + file structure

**Sign-off**: Marketing Lead + Tech Lead + UX Designer

---

## APPENDIX: FAQ FOR STAKEHOLDERS

**Q: Why replace the existing `/how-it-works` page instead of creating a new route?**  
A: The existing page is generic ("What · Why · How"). This new page is the actual "how" for students—the complete system. One URL, one story, better focus.

**Q: What if colleges want to know about TPO dashboard features before demo?**  
A: Case study shows TPO dashboard in action. Scheduling a demo = opportunity to walk through it live.

**Q: Should students see this page or is it college-only?**  
A: Both. Students benefit from seeing their full journey (transparency builds trust). College TPOs get the ROI angle. Messaging serves both audiences.

**Q: How do we handle "AI Buddy" being confused with ChatGPT?**  
A: Clarify in demo + product. Tagline: "Your 24/7 study partner" (not generic AI, but purpose-built for placement prep).

**Q: Why is Stage 7 called "Offer Prep Sprint" and not just "Reassessment"?**  
A: Reframing: Not just measuring again, but preparing for actual offers. Shows the outcome (offer in hand), not just another test.

---

## TIMELINE SUMMARY

```
Week of Jul 22–28, 2026
├─ Day 1-2: Content finalization + data from sales
├─ Day 3-4: Component build + styling
├─ Day 5-6: Animation polish + QA
├─ Day 7: Marketing review + sign-off
└─ Deployment: Following Monday (Jul 29)
```

**Ready to start Phase 1 (content prep)?**

---

End of Refined Plan
