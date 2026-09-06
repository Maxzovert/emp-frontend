/**
 * API base URL.
 * - Local: leave unset → Vite proxies `/api` to localhost:3001
 * - Vercel: leave unset → `vercel.json` rewrites `/api` to Render (same-origin cookies)
 * - Optional override: set VITE_API_URL to call the API host directly
 */
const raw = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");

export const API_BASE = raw;

export function apiUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

export function apiFetch(path, options = {}) {
  return fetch(apiUrl(path), {
    credentials: "include",
    ...options,
  });
}
