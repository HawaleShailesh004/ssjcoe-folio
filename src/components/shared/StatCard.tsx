interface Props {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  accent?: boolean;
}

export function StatCard({ label, value, unit, sub, accent }: Props) {
  return (
    <div
      className={`card p-6 ${accent ? "border-l-2 border-l-saffron" : ""}`}
    >
      <p className="label mb-3">{label}</p>
      <p className="num text-4xl">
        {value}
        {unit && (
          <span className="text-base font-sans font-normal text-stone-500 ml-1.5">
            {unit}
          </span>
        )}
      </p>
      {sub && <p className="text-sm text-stone-500 mt-1.5">{sub}</p>}
    </div>
  );
}
