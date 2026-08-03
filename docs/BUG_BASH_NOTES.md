# Bug Bash Notes — Frontend fixes + Backend asks

## Bug-1 — Platform Admin Dashboard light-mode text (FIXED — FE only)

**URL:** `/platform/admin/dashboard`  
**Symptom:** In light mode, recent organization names and metric tile headers were nearly unreadable (near-white / low-contrast grey on white cards).

**Root cause (FE):** Dark-theme hardcoded colors:
- `.mm-pa-table__title` → `#f1f5f9` (used in Recent Orgs list *outside* `<table>`, so light overrides scoped to `.mm-pa-table` never applied)
- `.mm-pa-stat__label` → `#94a3b8` with no light-mode override on pale stat cards

**Fix:** Theme tokens (`var(--pa-text)` / `var(--pa-muted)`) + light-mode overrides for stat labels, table titles outside tables, panel headings, and `text-slate-500`.

**Backend:** None required for this bug.

---

## Bug-2 — Platform Admin dark mode too harsh + Create Org CTA clash (FIXED — FE only)

**URL:** `/platform/admin/dashboard` (dark theme)  
**Symptom:** Dark mode felt near-black / eye-straining for all-day portal admin use. “Create Organization” CTA used a neon cyan→lime→amber shifting gradient that clashed with the rest of the UI.

**Root cause (FE):** Dark tokens started at `#050814` with strong neon orbs; primary button animated `sky → teal → amber`.

**Fix:**
- Soft slate-blue canvas (`#152033` / `#1a2740`) with muted ambient glows
- Elevated sidebar/topbar/panels (less pure black)
- Primary CTA: static calm `sky → teal` (MentorMuni brand), no amber, no shift animation
- Progress bars aligned to same sky→teal (both themes)

**Backend:** None required for this bug.

---

## Bug-3 — Platform Admin local login: Invalid or missing API key (FIXED — FE env)

**URL:** local `/platform/admin/login`  
**Credentials:** `admin@mentormuni.com` / `ChangeMe123!` (valid)  
**Symptom:** Login failed with `INVALID_API_KEY` even with correct credentials.

**Root cause:** `.env.local` had a **stale** `VITE_API_KEY` that production Railway rejects. Credentials were fine; `X-API-Key` was wrong.

**Fix:** Updated `.env.local` `VITE_API_KEY` to match the key deployed on www.mentormuni.com (Vite must be restarted after env change).

**Backend ask:**
1. Document the current production `API_KEY` / `X-API-Key` value (or rotate + share securely) in the team secrets store.
2. Confirm Railway env var name (`API_KEY` / `X_API_KEY` / etc.) so FE `VITE_API_KEY` stays in sync.
3. Prefer: when API key is wrong, return a distinct message vs credential failures (already coded as `INVALID_API_KEY`) — keep that contract.
4. Optional hardening: do not rely on a single long-lived key embedded in the public Vite bundle; consider a BFF or short-lived bootstrap if threat model requires it.

---

## Bug-4 — Organizations tab slow N+1 (user Bug 3) (FIXED — FE only)

**URL:** `/platform/admin/organizations`  
**Symptom:** Skeleton stayed up a long time with only 5 orgs; would scale poorly to 100+.

**Root cause (FE, confirmed by BE):** Page waited on plans/features, then fetched orgs+TPOs, then called `getSubscriptionForOrg(id)` **once per org** (`GET /platform/subscriptions?organization_id=…&status=ACTIVE`). Loading cleared only after all of that (~9 round trips at 5 orgs, ~100+ at 100 orgs). Org list query itself is fine.

**Fix:**
- `getActiveSubscriptionsByOrgId()` — one `GET /platform/subscriptions?status=ACTIVE`, map by `organization_id` in memory
- Table paints as soon as orgs return; TPO + subscription enrich in parallel afterward
- Plans / feature catalog load in parallel and no longer block the table

**Backend (optional nice-to-have):** Enrich `GET /platform/organizations` with active plan/sub summary so the page can be a single call. Not required for this fix.

---

## Bug-5 — Light-mode text invisible sitewide + dark CTAs too bright (FIXED — FE only)

**Pages:** Organizations, Subscriptions, Platform Users, Features, Settings (all Platform Admin)

**Symptom:** Light theme text unreadable; dark theme primary buttons / toggle felt neon / eye-straining.

**Root cause (FE):** Site New UI (`html.mm-new-ui`) sets light `--text-body` on every `p`/`label` globally. Platform Admin light mode uses white panels, so marketing dark-ink bleed made copy near-invisible. Dark CTAs used saturated gradients + glow.

**Fix:**
- Isolate `.mm-pa-root` + modal layer from `html.mm-new-ui` typography (`color: inherit` + light-mode ink lock with `!important`)
- Re-assert muted/badge/button colors after the lock
- Dark primary CTA → solid muted `#1a7fad` (no neon gradient/glow); softer theme toggle + badges

**Backend:** None.

---

## Bug-5 follow-up — Theme shield regression (FIXED)

**What went wrong:** PA CSS used `color: inherit` under `html.mm-new-ui`, which made `.mm-pa-root` inherit pale body ink (`#dce4ef`) and crushed dark-mode badge/nav/button colors. A huge `!important` hard-lock then fought that — fragile and made things worse.

**Correct fix:**
1. Scope site New UI typography away from PA: `new-ui-theme.css` no longer colors `p/li/label` inside `.mm-pa-root` / `.mm-pa-modal-layer`
2. Removed isolate + hard-lock walls from `platform-admin.css`
3. Modal layer mirrors `--pa-*` tokens (portaled to `body`)
4. Kept calm solid primary CTA + soft dark canvas

**Note:** Fixes are local until deployed. Production www.mentormuni.com will not show them yet. Verify on localhost only.

---

## Bug — Add TPO create feels stuck / UI freeze (BACKEND primary)

**API called:** `POST /platform/organizations/{organization_id}/tpo`  
Headers: `X-API-Key`, `Authorization: Bearer <platform token>`  
Body: `{ first_name, last_name, email, mobile, username }`

**Why it freezes:** Frontend awaits that single POST until the response returns. Backend currently creates the TPO **and sends the activation email in the same request**, so slow SMTP/provider latency blocks the modal (button shows busy state).

**Related APIs (not used on first create):**
- `PUT /platform/organizations/{id}/tpo` — edit / reset password
- `POST /platform/organizations/{id}/tpo/reinvite` — resend activation

**Backend ask (high):**
1. Return quickly after TPO + activation token are persisted (`email_sent: null|pending`).
2. Send email asynchronously (queue/worker); update status later or include `email_sent` when already done.
3. Or provide a timeout/fallback: create succeeds even if mail provider is slow/fails (`email_sent: false` + `activation_url` for manual share).
4. Target: API responds in <2–3s regardless of mail provider latency.
