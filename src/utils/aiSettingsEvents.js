export const AI_SETTINGS_CHANGED = "employeeai:ai-settings-changed";

/** Notify chat + other listeners that provider/keys changed. */
export function notifyAiSettingsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AI_SETTINGS_CHANGED));
}

/** Subscribe to AI settings updates. Returns unsubscribe. */
export function onAiSettingsChanged(handler) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(AI_SETTINGS_CHANGED, handler);
  return () => window.removeEventListener(AI_SETTINGS_CHANGED, handler);
}
