import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
  mono?: boolean;
}

export function StatCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  icon,
  className,
  mono = true,
}: StatCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
        ? "text-red-500"
        : "text-gray-400";

  return (
    <div className={cn("card-base p-6", className)}>
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-brand-saffron/10 flex items-center justify-center text-brand-saffron mb-4">
          {icon}
        </div>
      )}
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-sm text-brand-muted mb-1">{label}</p>
          <p
            className={cn(
              "text-3xl font-bold text-brand-black",
              mono && "font-mono"
            )}
          >
            {value}
            {unit && (
              <span className="text-base font-normal text-brand-muted ml-1">
                {unit}
              </span>
            )}
          </p>
        </div>
        {trend && trendValue && (
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trendColor
            )}
          >
            <TrendIcon className="w-4 h-4" />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
