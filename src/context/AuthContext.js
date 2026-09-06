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

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data?.user || null);
      return data?.user || null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async ({ email, password }) => {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) {
      return data;
    }
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await apiFetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) {
      return data;
    }
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
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
