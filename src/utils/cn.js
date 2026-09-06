import { twMerge } from "tailwind-merge";

export function cn(...parts) {
  const flat = parts
    .flatMap((part) => {
      if (!part) return [];
      if (typeof part === "string") return part.split(/\s+/);
      if (Array.isArray(part)) return part;
      if (typeof part === "object") {
        return Object.entries(part)
          .filter(([, on]) => Boolean(on))
          .map(([key]) => key);
      }
      return [];
    })
    .filter(Boolean);

  return twMerge(flat.join(" "));
}
