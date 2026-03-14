/**
 * Backend API base URL for all API calls.
 * Set VITE_API_URL in .env to override (e.g. http://localhost:5000 for local dev).
 */
const PRODUCTION_API_URL = 'https://mentormuni-python-backend-production.up.railway.app';
export const API_BASE = import.meta.env.VITE_API_URL ?? PRODUCTION_API_URL;
