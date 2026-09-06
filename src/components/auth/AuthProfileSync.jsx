"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePreferences } from "@/context/PreferencesContext";

/** Keep local profile prefs in sync with the signed-in account. */
export function AuthProfileSync() {
  const { user, ready: authReady } = useAuth();
  const { setProfile } = usePreferences();

  useEffect(() => {
    if (!authReady || !user) return;
    setProfile((prev) => {
      const next = {
        name: user.name || "",
        email: user.email || "",
        department: user.department || "",
        position: user.position || "",
      };
      if (
        prev.name === next.name &&
        prev.email === next.email &&
        prev.department === next.department &&
        prev.position === next.position
      ) {
        return prev;
      }
      return next;
    });
  }, [authReady, user, setProfile]);

  return null;
}
