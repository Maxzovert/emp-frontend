/**
 * Email delivery is optional and not wired in this workspace by default.
 * Set VITE_EMAIL_NOTIFICATIONS=true only after an email provider is configured.
 */
export const EMAIL_NOTIFICATIONS_CONFIGURED =
  import.meta.env.VITE_EMAIL_NOTIFICATIONS === "true";
