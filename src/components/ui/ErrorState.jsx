import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  onRetry,
  retryLabel = "Try again",
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-error/30 bg-error/5 px-6 py-12 text-center",
        className,
      )}
      role="alert"
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-error/15 text-error">
        <AlertCircle className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      {onRetry ? (
        <Button className="mt-5" variant="secondary" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
