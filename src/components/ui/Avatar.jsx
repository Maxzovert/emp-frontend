import { cn } from "@/utils/cn";

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

function initialsFromName(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Avatar({ name = "", src, size = "md", className, alt }) {
  const initials = initialsFromName(name) || "?";

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || "Avatar"}
        className={cn(
          "rounded-full object-cover ring-2 ring-border",
          sizes[size] || sizes.md,
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary font-semibold text-white ring-2 ring-border",
        sizes[size] || sizes.md,
        className,
      )}
      aria-label={alt || name || "Avatar"}
    >
      {initials}
    </span>
  );
}
