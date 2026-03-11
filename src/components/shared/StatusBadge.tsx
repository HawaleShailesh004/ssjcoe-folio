import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle, FileEdit } from "lucide-react";
import type { ContentStatus } from "@/types";

const config = {
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700 border border-green-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border border-red-200",
  },
  draft: {
    label: "Draft",
    icon: FileEdit,
    className: "bg-gray-50 text-gray-600 border border-gray-200",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: ContentStatus;
  className?: string;
}) {
  const { label, icon: Icon, className: base } = config[status];
  return (
    <span className={cn("status-badge", base, className)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
