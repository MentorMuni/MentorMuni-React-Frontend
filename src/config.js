/**
 * Backend API base URL for all API calls.
 * Set VITE_API_URL in .env to override (e.g. http://localhost:5000 for local dev).
 *
 * CORS: The browser blocks cross-origin requests unless the backend sends
 * Access-Control-Allow-Origin. Enable CORS on the Flask backend (e.g. flask-cors)
 * for your frontend origin (e.g. Vite dev server or production domain).
 */
const PRODUCTION_API_URL = 'https://mentormuniapi-production.up.railway.app';
export const API_BASE = import.meta.env.VITE_API_URL ?? PRODUCTION_API_URL;
