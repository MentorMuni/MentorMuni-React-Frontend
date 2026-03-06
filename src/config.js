/**
 * App config - use env in production (Railway, etc.)
 * VITE_API_URL is set at build time for the frontend.
 */
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
