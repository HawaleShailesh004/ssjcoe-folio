import { ExternalLink, Hash, Calendar } from "lucide-react";
import type { Patent, Department } from "@/types";

const STATUS: Record<string, string> = {
  filed: "badge badge-idle",
  published: "badge badge-warn",
  granted: "badge badge-ok",
};

export function PatentCard({
  patent: p,
  department,
}: {
  patent: Patent;
  department?: Department;
}) {
  const inventors = Array.isArray(p.inventors) ? p.inventors : [];

  return (
    <div className="card card-hover p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <span className={STATUS[p.patent_status] ?? "badge badge-idle"}>
            {p.patent_status}
          </span>
          {department && (
            <span className="font-mono text-xs text-stone-500">
              {department.code}
            </span>
          )}
          {p.year && (
            <span className="font-mono text-xs text-stone-500">{p.year}</span>
          )}
        </div>
        {p.certificate_url && (
          <a
            href={p.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-saffron hover:text-saffron-dark transition-colors shrink-0"
          >
            <ExternalLink className="w-3 h-3" /> Certificate
          </a>
        )}
      </div>

      <h3 className="text-base font-medium text-stone-950 leading-snug mb-2">
        {p.title}
      </h3>
      {p.description && (
        <p className="text-sm text-stone-600 clamp-2 mb-4">{p.description}</p>
      )}

      <div className="space-y-1.5 pt-4 border-t border-stone-200 text-sm text-stone-600">
        <p>{inventors.map(String).join(", ")}</p>
        {p.patent_number && (
          <div className="flex items-center gap-1.5">
            <Hash className="w-3 h-3" />
            <span className="font-mono text-xs">{p.patent_number}</span>
          </div>
        )}
        {p.date && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            <span className="text-xs">
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
