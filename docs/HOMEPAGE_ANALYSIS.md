# Homepage analysis and fixes

## Summary

The homepage is a dark-themed landing page. Two sections were still using **light (white/gray) backgrounds**, which made them look out of place and unprofessional for a 4th-year student (or any user) viewing the site.

---

## 1. Career Diagnostic — “Step-by-step diagnostic” section

**Issue:** The entire block was light-themed (`bg-white`, `text-gray-600`, `bg-gray-50`, `bg-gray-100`). It appeared as a bright white strip between dark sections and felt disconnected from the rest of the page.

**Changes made:**
- Section: `bg-white` → `section-dark` with `border-y border-slate-800/60` so it matches the dark layout.
- All text: gray → `text-on-dark` / `text-on-dark-sub` / `text-slate-400` so copy is readable on dark.
- Step circles: `bg-gray-100` / `bg-indigo-100` → dark variants (`bg-slate-700/80`, `bg-indigo-500/30`, `bg-indigo-500` for done).
- “Live activity” panel: `bg-gray-50` → `card-dark` (dark card with border).
- Buttons: Reset/demo use dark borders and light text; primary CTA is a **Link** to `/start-assessment`.
- Layout: Clear heading + subheading, two-column grid (steps + live activity), “Start diagnostic” and “Run demo” / “Reset” actions.

This section now fits the dark homepage and still explains the step-by-step diagnostic (Resume → Skills → Interview → Roadmap).

---

## 2. Pricing section

**Issue:** Section used `bg-gray-50` and plan cards used `bg-white` and `text-gray-600`, so it looked like a separate light page dropped into the middle of the homepage.

**Changes made:**
- Section: `bg-gray-50` → `section-dark` with a top border for separation.
- Plan cards: `bg-white` → `card-dark` (same dark card style as the rest of the site).
- Text: headings and body use `text-on-dark` / `text-on-dark-sub`; bullets use `text-slate-400` with a check icon.
- CTAs: “Get started free” links to `/start-assessment`, “View plans” links to `/upgrade`; both use `Link` and consistent button styling (primary vs outline).

Pricing now reads as part of the same dark, professional homepage.

---

## 3. “4th year / placement” audience

The **“Built for every stage of your tech journey”** block (Final Year Students, Freshers in IT, Career Switchers) was already dark (`from-slate-800/50`, `border-slate-700`, etc.). No change needed there.

The **white** feeling you noticed was coming from the **Career Diagnostic** and **Pricing** sections above and below the fold. With those switched to the dark theme, the whole page—including the 4th-year / placement messaging—now feels consistent and professional.

---

## 4. Other sections checked

- **HeroSection, TrustIndicators, HowItWorks, CareerTransformationSection:** Dark or gradient, consistent.
- **CareerSwitchPaths, SuccessStories, MentorSection, JobRolesSection, CommunitySection, FAQSection:** Use `section-dark`, `card-dark`, or equivalent dark styles.
- **Footer:** Dark (`bg-slate-900/50`).

No other sections were using white or light gray as the main background.

---

## Files updated

- `src/components/CareerDiagnostic.jsx` — Full dark-theme redesign; primary CTA links to `/start-assessment`; “Run demo” / “Reset” for in-page demo.
- `src/components/PricingSection.jsx` — Dark section and cards; CTAs link to `/start-assessment` and `/upgrade`.

Result: The homepage is fully dark-themed, with no white blocks, and the “step-by-step diagnostic” and pricing areas look consistent and professional for placement-focused users.
