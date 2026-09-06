import { Link } from "react-router-dom";

export function LandingFooter() {
  return (
    <footer id="about" className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
              EA
            </span>
            <span className="font-semibold text-foreground">EmployeeAI</span>
          </div>
          <p className="mt-3 text-sm text-muted">
            An AI-powered internal employee workspace - directory, analytics,
            and assistant in one high-contrast product.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="font-semibold text-foreground">Product</p>
            <ul className="mt-3 space-y-2 text-muted">
              <li>
                <a href="#features" className="hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard?assistant=1"
                  className="hover:text-foreground"
                >
                  Assistant
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground">Workspace</p>
            <ul className="mt-3 space-y-2 text-muted">
              <li>
                <Link to="/employees" className="hover:text-foreground">
                  Employees
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-foreground">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-foreground">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="font-semibold text-foreground">About</p>
            <p className="mt-3 text-muted">
              Built as a modern SaaS-style workplace portal - not a dense HR
              admin panel.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-xs text-muted md:px-6">
          <span>© {new Date().getFullYear()} EmployeeAI</span>
          <span>React · Neon · LangChain</span>
        </div>
      </div>
    </footer>
  );
}
