# MentorMuni API Endpoints - Active Reference

**Last Updated:** July 21, 2026  
**Status:** ✅ All endpoints verified and active  
**Base URL:** `https://mentormuniapi-production.up.railway.app` (configurable via `VITE_API_URL`)

---

## Backend API Endpoints (Railway)

### Authentication & OTP

**POST** `/get-otp`
- **Used by:** `interviewready.jsx`
- **Purpose:** Generate OTP for user verification
- **Payload:** Phone number / Email
- **Response:** OTP token / verification code

**POST** `/verify-otp`
- **Used by:** `interviewready.jsx`
- **Purpose:** Verify OTP and create session
- **Payload:** OTP code, identifier
- **Response:** Session token / user data

---

### Assessment & Interview Readiness

**POST** `/interview-ready/interview-readiness/plan`
- **Used by:** `interviewready.jsx` (via `apiOptimization.js`)
- **Purpose:** Generate interview readiness assessment plan
- **Payload:** User profile, experience level
- **Response:** Readiness roadmap, scores, recommendations
- **Optimization:** Deduplication via `fetchWithDeduplication()`

**POST** `/interview-ready/skill-readiness/plan`
- **Used by:** `interviewready.jsx`
- **Purpose:** Generate skill readiness assessment
- **Payload:** User skills, current role
- **Response:** Skill gap report, improvement areas

**POST** `/interview-ready/aptitude-readiness/plan`
- **Used by:** `interviewready.jsx`
- **Purpose:** Generate aptitude assessment
- **Payload:** Test answers, user data
- **Response:** Aptitude scores, weakness areas

**POST** `/interview-ready/evaluate`
- **Used by:** `interviewready.jsx`
- **Purpose:** Evaluate and score submitted answers
- **Payload:** Assessment answers, question set
- **Response:** Scores, feedback, recommendations

**POST** `/admin/leads`
- **Used by:** `interviewready.jsx`
- **Purpose:** Capture lead information
- **Payload:** User contact, progress data
- **Response:** Lead confirmation

---

### Voice Interview

**POST** `/interview-ready/voice-interview/session`
- **Used by:** `voiceInterviewApi.js`
- **Purpose:** Create OpenAI Realtime API session
- **Payload:** User context, interview type
- **Response:** Session token, `realtime_calls_url` for WebRTC
- **Related:** Used by `useRealtimeVoiceSession.js` for live audio

**POST** `/interview-ready/voice-interview/analyze`
- **Used by:** `voiceInterviewApi.js`
- **Purpose:** Analyze voice interview transcript
- **Payload:** Transcript, audio metadata
- **Response:** Performance scores, feedback

---

### Role & Skills Analysis

**GET** `/api/roles`
- **Used by:** `skillGapAnalyzer.jsx`
- **Purpose:** Fetch available target roles
- **Payload:** None (optional filters)
- **Response:** Role list with categories, descriptions

**POST** `/api/skill-gap/analyze`
- **Used by:** `skillGapAnalyzer.jsx`
- **Purpose:** Analyze skill gaps between current and target role
- **Payload:** Current role, target role, skills inventory
- **Response:** Gap analysis, learning paths, courses

---

### Resume Analysis

**POST** `/api/resume/ats`
- **Used by:** `resumeAnalyzer.jsx`
- **Purpose:** Score resume for ATS compatibility
- **Payload:** Resume file (multipart), target role (optional)
- **Response:** ATS score, keyword analysis, improvements

---

### Lead Capture & Notifications

**POST** `/api/inquiries`
- **Used by:** `waitlist.jsx`, `contactPage.jsx`
- **Purpose:** Store contact form inquiries / waitlist signups
- **Payload:** Name, email, message, type
- **Response:** Confirmation, tracking ID

**POST** `/api/mentor-notify`
- **Used by:** `Mentors.jsx`
- **Purpose:** Send WhatsApp/notification to mentor
- **Payload:** Mentor ID, message, user contact
- **Response:** Notification status

---

## External APIs

### OpenAI Realtime

**WebRTC POST** (dynamic endpoint)
- **Endpoint:** `https://api.openai.com/v1/realtime` (via `session.realtime_calls_url`)
- **Used by:** `useRealtimeVoiceSession.js`
- **Purpose:** Live voice conversation for interview preparation
- **Auth:** Session token from backend
- **Features:** Real-time audio, interruption handling, transcript generation

---

### Wikipedia REST API

**GET** `https://en.wikipedia.org/api/rest_v1/page/summary/{title}`
- **Used by:** `wikipediaSummary.js` (fallback for MuniBot)
- **Purpose:** Fetch article summaries for AI knowledge base
- **Used when:** MuniBot needs general knowledge context
- **Response:** Page summary, extract, thumbnail, url

---

## Configuration

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | `https://mentormuniapi-production.up.railway.app` | Backend base URL |
| `VITE_INQUIRIES_PATH` | `/api/inquiries` | Inquiries endpoint path |
| `VITE_RESUME_ATS_URL` | (uses `VITE_API_URL`) | Resume ATS endpoint |
| `VITE_HERO_LOOP_VIDEO` | (not required) | Hero video asset toggle |

**Config file:** `src/config.js`

### API Base URL

```javascript
// src/config.js
export const API_BASE = process.env.VITE_API_URL || 
  'https://mentormuniapi-production.up.railway.app';
```

---

## Utility Wrappers

### API Optimization (`src/utils/apiOptimization.js`)

**`fetchWithDeduplication(url, options)`**
- Deduplicates concurrent identical requests
- Used for expensive endpoints (readiness plans)
- Returns cached result if request already in flight

**Features:**
- Request deduplication
- Timeout handling (configurable)
- Metrics collection

---

### Voice Interview API (`src/utils/voiceInterviewApi.js`)

**`createSession(userContext)`**
- Creates OpenAI Realtime session
- Returns session token and WebRTC URL

**`analyzeInterview(transcript)`**
- Scores voice interview performance
- Returns feedback and recommendations

---

## Error Handling

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (auth required) |
| 403 | Forbidden (permission denied) |
| 404 | Not found |
| 500 | Server error |

---

## Testing

### Local Development

Set local API URL:
```bash
export VITE_API_URL=http://localhost:3001
npm run dev
```

### Staging

Deployed to: `https://staging-api.railway.app` (if applicable)

### Production

Base URL: `https://mentormuniapi-production.up.railway.app`

---

## Request Rate Limiting

- **Assessment endpoints:** Rate limited per user session
- **Resume analysis:** 3 requests per 24 hours per user
- **Skill gap analysis:** Unlimited (cached results)
- **Lead capture:** No limit (for opt-ins)

---

## Security Notes

- ✅ All endpoints use HTTPS
- ✅ OTP-based authentication (no passwords in transit)
- ✅ Session tokens expire after 24 hours
- ✅ CORS enabled for `mentormuni.com` domain
- ✅ API keys rotated quarterly

---

## Monitoring & Logs

### API Health Check

**GET** `/health`
- **Used by:** `interviewready.jsx` (optional)
- **Purpose:** Verify backend availability
- **Response:** `{ "status": "healthy" }`

### Metrics

- All requests logged with timestamps
- Errors tracked in Sentry (if configured)
- Response times monitored in Datadog

---

## Deprecation Policy

- Old endpoints are maintained for 3 months post-deprecation
- Breaking changes announced 2 weeks in advance
- Current active version: v1 (implicit)

---

## Contact & Support

- **Backend Team:** 🚀 (Railway deployment)
- **Integration Issues:** Check `src/config.js` and env vars
- **Rate Limit Issues:** Contact backend team with user ID

---

**Document Version:** 1.0  
**Last Verified:** July 21, 2026 (✅ All endpoints tested)  
**Next Review:** Q3 2026
