"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { EMAIL_NOTIFICATIONS_CONFIGURED } from "@/constants/notifications";
import { DEMO_PROFILE } from "@/data/employees";

const PreferencesContext = createContext(null);

const PROFILE_KEY = "employeeai-profile";
const NOTIFICATIONS_KEY = "employeeai-notifications";

export const DEFAULT_NOTIFICATIONS = {
  email: false,
  aiUpdates: true,
  announcements: false,
};

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

export function PreferencesProvider({ children }) {
  const [profile, setProfileState] = useState(DEMO_PROFILE);
  const [notifications, setNotificationsState] = useState(DEFAULT_NOTIFICATIONS);
  const [ready, setReady] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setProfileState(readJson(PROFILE_KEY, DEMO_PROFILE));
    const stored = readJson(NOTIFICATIONS_KEY, DEFAULT_NOTIFICATIONS);
    setNotificationsState({
      ...stored,
      // Force off when email delivery is not configured.
      email: EMAIL_NOTIFICATIONS_CONFIGURED ? Boolean(stored.email) : false,
    });
    setReady(true);
  }, []);

  const setProfile = useCallback((next) => {
    setProfileState((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      if (value === prev) return prev;
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(value));
      return value;
    });
  }, []);

  const setNotifications = useCallback((next) => {
    setNotificationsState((prev) => {
      const raw = typeof next === "function" ? next(prev) : next;
      const value = {
        ...raw,
        email: EMAIL_NOTIFICATIONS_CONFIGURED ? Boolean(raw.email) : false,
      };
      window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(value));
      return value;
    });
  }, []);

  const flashSaved = useCallback((label = "Preferences saved") => {
    setSaveMessage(label);
    window.setTimeout(() => setSaveMessage(""), 2200);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      notifications,
      setNotifications,
      ready,
      saveMessage,
      flashSaved,
    }),
    [
      profile,
      setProfile,
      notifications,
      setNotifications,
      ready,
      saveMessage,
      flashSaved,
    ],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return ctx;
}
