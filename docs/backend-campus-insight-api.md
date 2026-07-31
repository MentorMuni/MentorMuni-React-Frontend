# Backend brief: TPO Campus Insight (OpenAI)

**Audience:** Backend / API team  
**Product:** MentorMuni Organization Portal — TPO Dashboard  
**Frontend owner:** Organization portal (`/Organization/dashboard`)  
**Status:** UI live with **local heuristic fallback**. Needs real API + OpenAI proxy.

---

## 1. What is this? (one paragraph)

College **TPOs** (Training & Placement Officers) need a short, actionable brief on campus placement readiness — not raw tables. On the TPO dashboard we show **Deep analysis** (readiness bands, skill gaps, department averages, leaderboard) plus an **AI campus brief**: a summary + 3–5 recommended actions (e.g. “assign AI mock to at-risk CSE students”).

Today the brief is computed **in the browser from mock/local metrics**. We want the backend to:

1. Pull **real** org score/enrollment data from DB  
2. Call **OpenAI on the server** (API key never in frontend)  
3. Return a stable JSON brief the dashboard can render  

Same auth as other org APIs: **X-API-KEY + tenant Bearer JWT** (TPO / ORG_ADMIN). Viewers may be allowed **read-only** later; start with TPO only.

---

## 2. Why it matters

| Without AI brief | With AI brief |
|------------------|---------------|
| TPO stares at charts and guesses what to do | TPO gets “do these 3 things this week” |
| Weak students buried in tables | Explicit intervene list (program type + audience) |
| Hard to scale across departments | Consistent language for principal/reports |

This is **decision support**, not chat. One request → one structured brief. Optional later: per-student remediation, drive-prep briefs.

---

## 3. What the frontend already shows (so API can match UX)

Dashboard **Deep analysis** section expects:

| Block | Meaning |
|-------|---------|
| Drive-ready | Students with readiness ≥ 75% |
| Developing | 50–74% |
| At risk | &lt; 50% |
| Top skill gaps | Aggregated weakness themes + counts |
| Campus strengths | Aggregated strength themes + counts |
| Department bars | Per-dept avg readiness + headcount |
| Leaderboard | Top students by readiness (names OK if already visible to TPO) |
| AI campus brief | `summary` + `actions[]` + source label |

**Refresh insight** button should call the new API. On failure/timeout → keep local heuristic (frontend already has `buildLocalCampusInsight`).

---

## 4. Proposed API

### `POST /organizations/ai/campus-insight`

**Auth:** Required — org JWT (TPO / ORG_ADMIN). Reject HOD/Student for v1 unless product expands.

**Optional query/body flags:**

```json
{
  "include_leaderboard": true,
  "max_actions": 5,
  "locale": "en-IN"
}
```

Prefer **server-side aggregation from DB** (recommended). Client may also send a lightweight snapshot for debugging; do not trust client for production decisions.

### Success response `200`

```json
{
  "ok": true,
  "source": "openai",
  "model": "gpt-4.1-mini",
  "generated_at": "2026-07-31T08:00:00.000Z",
  "cache_ttl_seconds": 900,
  "organization_id": "…",
  "metrics": {
    "students": 240,
    "avg_readiness": 68,
    "bands": { "strong": 72, "mid": 110, "weak": 58 },
    "top_gaps": [
      { "label": "DSA", "count": 41 },
      { "label": "HR round", "count": 33 }
    ],
    "top_strengths": [
      { "label": "Communication", "count": 55 }
    ],
    "departments": [
      {
        "id": "…",
        "code": "CSE",
        "name": "Computer Science",
        "students": 90,
        "avg_readiness": 71,
        "hod_status": "active"
      }
    ],
    "pending_invites": 12,
    "active_programs": 3,
    "upcoming_drives": 1,
    "hod_gaps": 1
  },
  "insight": {
    "summary": "Campus avg readiness is 68%. 58 students are below 50%; top gap is DSA (41). CSE is strongest; ECE needs HOD follow-up.",
    "actions": [
      "Assign AI mock interview to 58 at-risk students within 7 days",
      "Run a DSA readiness test for CSE + ECE developing band",
      "Invite HOD for the 1 department still unassigned",
      "Notify campus about the upcoming drive after readiness sprint"
    ]
  }
}
```

### Error responses

| Status | When |
|--------|------|
| `401` | Missing/invalid JWT |
| `403` | Wrong role / org suspended |
| `429` | Rate limit (per org) |
| `502` / `503` | OpenAI upstream failure — frontend falls back to heuristic |
| `501` | Feature not enabled for org |

Return a clear `detail` / `message` string. Frontend will show heuristic brief if non-200.

---

## 5. OpenAI usage (server only)

1. **Env:** `OPENAI_API_KEY` on server — never expose to Vite/`VITE_*`.  
2. **Model:** Start with a cheap/fast model (e.g. `gpt-4.1-mini`); pin version in config.  
3. **Rate limit:** e.g. **1 request / org / 5–15 minutes** (align with `cache_ttl_seconds`). Cache response in Redis/DB.  
4. **Prompt role:** “You are an assistant for a college Training & Placement Officer…”  
5. **Input:** Only aggregates (bands, gap labels/counts, dept averages, program/drive counts).  
6. **Output:** Strict JSON: `{ "summary": string, "actions": string[3..5] }` — validate before return.  
7. **Timeout:** ~8–12s; on timeout return `503` so UI falls back.

### Privacy / safety

- Prefer **no student emails/phones** in the OpenAI prompt.  
- Leaderboard names: either omit from OpenAI input, or only include if already authorized for TPO UI and policy allows.  
- Log prompts/responses with org_id + request_id; redact if storing long-term.  
- Do not let the model invent scores — only reason over numbers you provide.

---

## 6. Data the backend should compute (from DB)

When real score APIs exist, replace mock fields with:

| Field | Source (suggested) |
|-------|---------------------|
| Student readiness % | Latest readiness / assessment composite |
| Mock score | Latest AI/HR mock |
| Strength / weakness tags | Latest assessment or profile dimensions |
| Department membership | Student ↔ department |
| Pending invites | Enrollment invites `status=pending` |
| Active programs | Assignments not expired |
| Upcoming drives | Drives with future date / scheduled |
| HOD status | Department mentor invite state |

Until those tables are ready, backend can still ship the endpoint returning `source: "heuristic"` with the same JSON shape (no OpenAI), so frontend can integrate early.

---

## 7. Frontend integration plan (after API exists)

1. `Refresh insight` → `POST /organizations/ai/campus-insight` via existing `orgApi`.  
2. On `200`: render `insight.summary` + `insight.actions`; show `source: openai`.  
3. On error: keep `buildLocalCampusInsight()` and show “Using offline brief”.  
4. Optionally refresh `metrics` block from response so charts match the brief.

No OpenAI key or SDK in the frontend repo.

---

## 8. Related APIs (same TPO epic — context for backend)

These are separate but often discussed together:

| Area | Intended endpoints (draft) | Notes |
|------|----------------------------|--------|
| Departments | `CRUD /organizations/departments` | |
| HOD invite | `…/departments/:id/hod`, reinvite, revoke, replace | Email + activate token |
| HOD activate | `POST /auth/activate-hod` `{ token, new_password }` | Same pattern as activate-tpo |
| Enrollment | Invite / approve students | |
| Programs assign | Create assignment with type + audience + due days | Types: readiness, mock_ai, mock_hr, competition, feature, custom |
| Drives notify | Create + fan-out notification | |
| Performance | List scorecards from DB | Powers dashboard metrics |

Campus insight can ship **after** (or in parallel with) real score reads; it gets much better once performance data is live.

---

## 9. Acceptance criteria (backend)

- [ ] Authenticated TPO can call `POST /organizations/ai/campus-insight`  
- [ ] Response matches schema above (`metrics` + `insight`)  
- [ ] OpenAI key only on server; rate-limited + cached per org  
- [ ] Prompt uses aggregates only (no unnecessary PII)  
- [ ] OpenAI failure returns 5xx with message; does not leak upstream errors to client  
- [ ] Documented in API docs / Postman for frontend  

---

## 10. Message you can paste to backend (Slack / ticket)

> **Feature:** TPO Dashboard “AI Campus Brief”  
> **Ask:** Implement `POST /organizations/ai/campus-insight` (org JWT). Server aggregates readiness bands, skill gaps, dept averages from DB, calls OpenAI with that aggregate (key server-side only), returns `{ metrics, insight: { summary, actions[3-5] } }`. Cache ~15 min / org. On OpenAI failure return 503 so frontend keeps local fallback. Spec: `docs/backend-campus-insight-api.md`. Goal: give TPOs a short “what to do this week” brief, not a chatbot.

---

## 11. Contact / questions for kickoff

1. Which tables hold readiness / mock / skill tags today?  
2. Can we enable OpenAI only for orgs with a feature flag?  
3. Preferred cache store (Redis vs DB)?  
4. Any compliance constraint on sending dept-level aggregates to OpenAI?
