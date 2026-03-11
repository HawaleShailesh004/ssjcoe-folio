import { Users, Hash, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Patent, Department } from "@/types";

const STATUS_CONFIG = {
  filed: {
    label: "Filed",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  published: {
    label: "Published",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  granted: {
    label: "Granted",
    className: "bg-green-50 text-green-700 border-green-200",
  },
};

interface Props {
  patent: Patent;
  department?: Department;
}

export function PatentCard({ patent: p, department }: Props) {
  const statusCfg = STATUS_CONFIG[p.patent_status];
  const inventors = Array.isArray(p.inventors) ? p.inventors : [];

  return (
    <div className="card-base p-6 hover:shadow-panel transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <span
            className={`text-xs font-medium border px-2.5 py-0.5 rounded-full ${statusCfg.className}`}
          >
            {statusCfg.label}
          </span>
          {department && (
            <span className="text-xs text-brand-muted bg-brand-bg border border-brand-border px-2 py-0.5 rounded">
              {department.code}
            </span>
          )}
          {p.year && (
            <span className="text-xs text-brand-muted font-mono">{p.year}</span>
          )}
        </div>
        {p.certificate_url && (
          <a
            href={p.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 shrink-0"
            >
              <ExternalLink className="w-3 h-3" /> Certificate
            </Button>
          </a>
        )}
      </div>

      <h3 className="font-semibold text-brand-black mb-3 leading-snug">
        {p.title}
      </h3>

      {p.description && (
        <p className="text-sm text-brand-muted mb-4 line-clamp-2">
          {p.description}
        </p>
      )}

      <div className="flex flex-col gap-2 pt-3 border-t border-brand-border">
        <div className="flex items-center gap-2 text-sm text-brand-muted">
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span>{inventors.map(String).join(", ")}</span>
        </div>
        {p.patent_number && (
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <Hash className="w-3.5 h-3.5 shrink-0" />
            <span className="font-mono">{p.patent_number}</span>
          </div>
        )}
        {p.date && (
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>
              {new Date(p.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
