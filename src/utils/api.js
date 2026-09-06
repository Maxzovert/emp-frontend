/**
 * API base URL.
 * - Local: leave unset → Vite proxies `/api` to localhost:3001
 * - Vercel: leave unset → `vercel.json` rewrites `/api` to Render (same-origin cookies)
 * - Optional override: `VITE_API_URL` for local-against-remote testing only
 *
 * Important: on `*.vercel.app`, we ignore `VITE_API_URL` unless
 * `VITE_API_ALLOW_CROSS_ORIGIN=true`. Calling Render directly from Vercel
 * makes the session cookie third-party → login appears to work, then
 * `/api/auth/me` and `/api/auth/ai-settings` return 401.
 */
function resolveApiBase() {
  const configured = (import.meta.env.VITE_API_URL || "")
    .trim()
    .replace(/\/$/, "");
  const allowCrossOrigin =
    String(import.meta.env.VITE_API_ALLOW_CROSS_ORIGIN || "").toLowerCase() ===
    "true";

  if (typeof window !== "undefined" && !allowCrossOrigin) {
    const host = window.location.hostname;
    if (host === "vercel.app" || host.endsWith(".vercel.app")) {
      return "";
    }
  }

  return configured;
}

export const API_BASE = resolveApiBase();

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
