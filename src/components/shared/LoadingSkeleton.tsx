function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-stone-100 rounded ${className ?? ""}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-3">
      <Bone className="h-2.5 w-20" />
      <Bone className="h-9 w-24" />
      <Bone className="h-3 w-full" />
      <Bone className="h-3 w-3/4" />
    </div>
  );
}

export function RowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-stone-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-4">
          <Bone className="h-4 w-1/3" />
          <Bone className="h-4 w-1/5" />
          <Bone className="h-4 w-1/6" />
          <Bone className="h-5 w-16 rounded-full ml-auto" />
        </div>
      ))}
    </div>
  );
}
