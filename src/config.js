/**
 * Backend API base URL for all API calls.
 * Set VITE_API_URL in .env to override (e.g. http://localhost:5000 for local dev).
 *
 * CORS: The browser blocks cross-origin requests unless the backend sends
 * Access-Control-Allow-Origin. Enable CORS on the Flask backend (e.g. flask-cors)
 * for your frontend origin (e.g. Vite dev server or production domain).
 */
const PRODUCTION_API_URL = 'https://mentormuniapi-production.up.railway.app';
/** Override with VITE_API_URL for local backend. If interview readiness plan POST returns 500, fix the server (LLM keys, quotas, timeouts). */
export const API_BASE = import.meta.env.VITE_API_URL ?? PRODUCTION_API_URL;

/**
 * Unified waitlist + contact — POST JSON (same endpoint, backend branches on `intent`).
 * Path override: `VITE_INQUIRIES_PATH` (default `/api/inquiries`).
 *
 * Required fields are enforced by intent on the server:
 * - `intent: "contact"` → require name, email, phone, message
 * - `intent: "waitlist"` → require name, phone, college, year, target_role (email optional)
 *
 * Full shape (omit or null unused fields):
 * @example
 * {
 *   "intent": "waitlist" | "contact",
 *   "source": "waitlist_page" | "contact_page",
 *   "submitted_at": "2026-04-06T12:00:00.000Z",
 *   "name": "string",
 *   "email": "string | null",
 *   "phone": "string | null",
 *   "college": "string | null",
 *   "year": "string | null",
 *   "target_role": "string | null",
 *   "whatsapp_opt_in": true | false | null,
 *   "message": "string | null",
 *   "topic": "colleges" | null,
 *   "audience": "students" | "colleges" | null,
 *   "score": null
 * }
 */
export const INQUIRIES_PATH = import.meta.env.VITE_INQUIRIES_PATH ?? '/api/inquiries';
export const INQUIRIES_URL = `${API_BASE}${INQUIRIES_PATH}`;

/** Full URL for POST resume ATS analysis (multipart: file + target_role). Override with VITE_RESUME_ATS_URL. */
export const RESUME_ATS_URL =
  import.meta.env.VITE_RESUME_ATS_URL ?? `${API_BASE}/api/resume/ats`;

/**
 * Hero muted loop (WebM + MP4) under public/MentorMuni-React-Frontend/videos/
 * — hero-loop.webm, hero-loop.mp4, optional hero-poster.jpg
 * Set VITE_HERO_LOOP_VIDEO=true in .env when files are present (avoids 404s before that).
 */
export const HERO_LOOP_VIDEO_ENABLED =
  import.meta.env.VITE_HERO_LOOP_VIDEO === 'true' || import.meta.env.VITE_HERO_LOOP_VIDEO === '1';
