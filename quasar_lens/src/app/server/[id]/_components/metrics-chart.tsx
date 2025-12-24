"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type ChartDataPoint = {
  time: string;
  value: number;
  displayValue: string;
};

type MetricsChartProps = {
  data: ChartDataPoint[];
  color: string;
  label: string;
};

export function MetricsChart({ data, color, label }: MetricsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="time"
          className="text-xs text-muted-foreground"
          tick={{ fill: "currentColor" }}
        />
        <YAxis
          className="text-xs text-muted-foreground"
          tick={{ fill: "currentColor" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
          formatter={(_value, _name, props) => [
            (props.payload as ChartDataPoint).displayValue,
            label,
          ]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
