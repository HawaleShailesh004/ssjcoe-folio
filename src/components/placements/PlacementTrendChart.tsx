"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const style = {
  tick: { fontSize: 11, fill: "#6B6B6B" },
  grid: "#E8E8E8",
  bar: "#0A0A0A",
  line1: "#0A0A0A",
  line2: "#C8C8C8",
};

export function PlacementTrendChart({
  data,
}: {
  data: { year: number; count: number; avg: number; highest: number }[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <p className="label mb-4">Students placed · per year</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} barSize={20}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={style.grid}
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={style.tick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={style.tick}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 4,
                border: "1px solid #E8E8E8",
              }}
              cursor={{ fill: "#F4F4F4" }}
            />
            <Bar
              dataKey="count"
              fill={style.bar}
              radius={[2, 2, 0, 0]}
              name="Students"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <p className="label mb-4">Package trend · LPA</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={style.grid}
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={style.tick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={style.tick}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 4,
                border: "1px solid #E8E8E8",
              }}
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke={style.line1}
              strokeWidth={1.5}
              dot={{ r: 3, fill: style.line1 }}
              name="Avg"
            />
            <Line
              type="monotone"
              dataKey="highest"
              stroke={style.line2}
              strokeWidth={1.5}
              dot={{ r: 3, fill: style.line2 }}
              strokeDasharray="4 4"
              name="Highest"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
