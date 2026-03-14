export function EmptyState({
  title = "Nothing here yet",
  description = "No records match your filters.",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="py-24 text-center border border-dashed border-stone-300 rounded-lg">
      <p className="font-display text-2xl text-stone-400 mb-2">{title}</p>
      <p className="text-sm text-stone-500 mb-5">{description}</p>
      {action}
    </div>
  );
}
