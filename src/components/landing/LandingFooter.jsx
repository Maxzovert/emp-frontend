import { Link } from "react-router-dom";

export function LandingFooter() {
  return (
    <footer id="about" className="border-t border-border bg-background/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-14 md:flex-row md:items-start md:justify-between md:px-6 md:py-16">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-xs font-bold text-on-primary">
              EA
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-foreground">
              EmployeeAI
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            An AI-powered internal employee workspace — directory, analytics,
            and a grounded assistant in one product.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 sm:gap-12">
          <div>
            <p className="font-display text-xs font-semibold tracking-wide text-foreground uppercase">
              Product
            </p>
            <ul className="mt-3 space-y-2.5 text-muted">
              <li>
                <a href="#features" className="transition hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#preview" className="transition hover:text-foreground">
                  Preview
                </a>
              </li>
              <li>
                <Link
                  to="/dashboard?assistant=1"
                  className="transition hover:text-foreground"
                >
                  Assistant
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-display text-xs font-semibold tracking-wide text-foreground uppercase">
              Workspace
            </p>
            <ul className="mt-3 space-y-2.5 text-muted">
              <li>
                <Link to="/employees" className="transition hover:text-foreground">
                  Employees
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="transition hover:text-foreground">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/settings" className="transition hover:text-foreground">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="font-display text-xs font-semibold tracking-wide text-foreground uppercase">
              About
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              Built as a modern workplace portal — clear, fast, and ready for
              real team questions.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between md:px-6">
          <span>© {new Date().getFullYear()} EmployeeAI</span>
          <span className="font-mono">React · Neon · LangChain</span>
        </div>
      </div>
    </footer>
  );
}
