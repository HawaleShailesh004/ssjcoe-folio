import type { ContentStatus } from "@/types";

const MAP: Record<ContentStatus, { label: string; cls: string }> = {
  approved: { label: "Approved", cls: "badge badge-ok" },
  pending: { label: "Pending", cls: "badge badge-warn" },
  rejected: { label: "Rejected", cls: "badge badge-fail" },
  draft: { label: "Draft", cls: "badge badge-idle" },
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  const { label, cls } = MAP[status];
  return <span className={cls}>{label}</span>;
}
