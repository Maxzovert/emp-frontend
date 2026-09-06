export function cn(...parts) {
  return parts
    .flatMap((part) => {
      if (!part) return [];
      if (typeof part === "string") return part.split(" ");
      if (Array.isArray(part)) return part;
      if (typeof part === "object") {
        return Object.entries(part)
          .filter(([, on]) => Boolean(on))
          .map(([key]) => key);
      }
      return [];
    })
    .filter(Boolean)
    .join(" ");
}
