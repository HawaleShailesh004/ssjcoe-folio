import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  action?: React.ReactNode;
  count?: number;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
  count,
}: PageHeaderProps) {
  return (
    <div className="mb-12">
      {breadcrumbs && (
        <nav className="flex items-center gap-1.5 mb-6">
          {breadcrumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3 text-ink-6" />}
              {c.href ? (
                <Link
                  href={c.href}
                  className="text-xs text-ink-4 hover:text-ink transition-colors"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-xs text-ink-3">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex items-end justify-between gap-6">
        <div>
          <span className="accent-line" />
          <h1 className="text-4xl text-balance">
            {title}
            {count !== undefined && (
              <span className="font-mono text-2xl text-ink-4 ml-3 font-normal">
                {count}
              </span>
            )}
          </h1>
          {description && (
            <p className="text-base text-ink-4 mt-3 max-w-prose">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 pb-1">{action}</div>}
      </div>
    </div>
  );
}
