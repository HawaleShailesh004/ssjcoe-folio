interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
}

export function StatCard({ label, value, unit, sub }: StatCardProps) {
  return (
    <div className="card p-6">
      <p className="label mb-3">{label}</p>
      <p className="num-display text-4xl">
        {value}
        {unit && (
          <span className="text-lg font-sans font-normal text-ink-4 ml-1">
            {unit}
          </span>
        )}
      </p>
      {sub && <p className="text-sm text-ink-4 mt-1">{sub}</p>}
    </div>
  );
}
