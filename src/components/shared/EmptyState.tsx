interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "Nothing here yet",
  description = "No records match your filters.",
  action,
}: EmptyStateProps) {
  return (
    <div className="py-24 text-center">
      <p className="text-sm font-semibold text-ink mb-1">{title}</p>
      <p className="text-sm text-ink-4 mb-5">{description}</p>
      {action}
    </div>
  );
}
