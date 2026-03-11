"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
  Legend,
} from "recharts";

interface TrendData {
  year: number;
  count: number;
  avg: number;
  highest: number;
}

export function PlacementTrendChart({ data }: { data: TrendData[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <p className="text-xs font-medium text-brand-muted mb-3 uppercase tracking-wider">
          Students placed per year
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} barSize={28}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                fontSize: 12,
              }}
              cursor={{ fill: "#F9FAFB" }}
            />
            <Bar
              dataKey="count"
              fill="#FF9500"
              radius={[4, 4, 0, 0]}
              name="Students"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <p className="text-xs font-medium text-brand-muted mb-3 uppercase tracking-wider">
          Package trend (LPA)
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                fontSize: 12,
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#FF9500"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Avg LPA"
            />
            <Line
              type="monotone"
              dataKey="highest"
              stroke="#1C1C1E"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Highest LPA"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
