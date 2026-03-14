import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  action?: React.ReactNode;
  count?: number;
  eyebrow?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
  count,
  eyebrow,
}: Props) {
  return (
    <div className="mb-12 pb-10 border-b border-stone-200">
      {breadcrumbs && (
        <nav className="flex items-center gap-1.5 mb-6">
          {breadcrumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="w-3 h-3 text-stone-400" />
              )}
              {c.href ? (
                <Link
                  href={c.href}
                  className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-xs text-stone-700">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex items-end justify-between gap-6">
        <div>
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <span className="accent-rule" />
          <h1 className="font-display text-5xl">
            {title}
            {count !== undefined && (
              <span className="font-mono text-2xl text-stone-400 ml-4 font-normal align-baseline">
                {count}
              </span>
            )}
          </h1>
          {description && (
            <p className="text-base text-stone-600 mt-3 max-w-prose leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0 pb-1">{action}</div>}
      </div>
    </div>
  );
}
