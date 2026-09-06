import { apiFetch } from "@/utils/api";

/** True on the live Vercel app (not local Vite). */
export function isProductionHost() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "vercel.app" || host.endsWith(".vercel.app");
}

/**
 * Ping the API so a sleeping Render free-tier instance can start warming up.
 * No-op on localhost — local backend does not sleep.
 */
export async function wakeApi({ timeoutMs = 90000 } = {}) {
  if (!isProductionHost()) return true;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await apiFetch("/api/health", {
      cache: "no-store",
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export function isLikelyNetworkError(err) {
  if (!err) return false;
  if (err instanceof TypeError) return true;
  const msg = String(err.message || err);
  return /failed to fetch|networkerror|network request failed|load failed|fetch failed|aborted|timeout|unable to reach the ai service/i.test(
    msg,
  );
}
