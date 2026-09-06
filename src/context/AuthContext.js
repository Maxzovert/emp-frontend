"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/utils/api";
import { isProductionHost, wakeApi } from "@/utils/wakeApi";

const AuthContext = createContext(null);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const attempts = isProductionHost() ? 4 : 1;

    if (isProductionHost()) {
      // Avoid treating a sleeping Render instance as "logged out".
      await wakeApi({ timeoutMs: 90000 });
    }

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      try {
        const res = await apiFetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));

        if (res.status === 401) {
          setUser(null);
          return null;
        }

        if (res.ok && data?.user) {
          setUser(data.user);
          return data.user;
        }

        // Transient upstream errors while Render is still waking.
        if (attempt < attempts - 1) {
          await sleep(1500 * (attempt + 1));
          await wakeApi({ timeoutMs: 60000 });
          continue;
        }

        setUser(null);
        return null;
      } catch {
        if (attempt < attempts - 1) {
          await sleep(1500 * (attempt + 1));
          await wakeApi({ timeoutMs: 60000 });
          continue;
        }
        // Network still down — do not invent a logout; leave user null only
        // after exhausting retries (cookie may still be valid for later).
        setUser(null);
        return null;
      }
    }

    return null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refresh();
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const login = useCallback(
    async ({ email, password }) => {
      try {
        if (isProductionHost()) {
          await wakeApi({ timeoutMs: 90000 });
        }
        const res = await apiFetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!data.success) {
          return data;
        }

        // Prefer the login payload immediately, then confirm cookie via /me.
        if (data.user) {
          setUser(data.user);
        }

        const verified = await refresh();
        if (!verified) {
          // Cookie may still be fine after a cold start; keep login user if present.
          if (data.user) {
            setUser(data.user);
            return data;
          }
          setUser(null);
          return {
            success: false,
            error:
              "Sign-in succeeded but the session could not be verified. Wait for the API to wake, then reload — on Vercel leave VITE_API_URL unset.",
          };
        }
        return data;
      } catch {
        return {
          success: false,
          error:
            "Unable to reach the API. On production the Render free tier may still be waking — wait and try again.",
        };
      } finally {
        setReady(true);
      }
    },
    [refresh],
  );

  const register = useCallback(
    async (payload) => {
      try {
        if (isProductionHost()) {
          await wakeApi({ timeoutMs: 90000 });
        }
        const res = await apiFetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!data.success) {
          return data;
        }
        if (data.user) {
          setUser(data.user);
        }
        const verified = await refresh();
        if (!verified) {
          if (data.user) {
            setUser(data.user);
            return data;
          }
          setUser(null);
          return {
            success: false,
            error:
              "Account created but the session could not be verified. Wait for the API to wake, then reload.",
          };
        }
        return data;
      } catch {
        return {
          success: false,
          error:
            "Unable to reach the API. On production the Render free tier may still be waking — wait and try again.",
        };
      } finally {
        setReady(true);
      }
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Still clear local session if the API is asleep.
    }
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const updateProfile = useCallback(async (payload) => {
    const res = await apiFetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success && data.user) {
      setUser(data.user);
    }
    return data;
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refresh,
      updateProfile,
    }),
    [user, ready, login, register, logout, refresh, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
