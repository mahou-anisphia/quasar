"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartDataPoint = {
  time: string;
  value: number;
  displayValue: string;
};

type MetricsChartProps = {
  data: ChartDataPoint[];
  color: string;
  label: string;
  gradientId: string;
};

type TooltipEntry = { payload?: ChartDataPoint };
type CustomTooltipProps = { active?: boolean; payload?: TooltipEntry[]; label?: string };

function CustomTooltip({ active, payload, label }: Readonly<CustomTooltipProps>) {
  if (!active || !Array.isArray(payload) || payload.length === 0) return null;
  const point = payload[0]?.payload;
  return (
    <div
      style={{
        background: "rgba(255,251,240,0.96)",
        border: "1px solid rgba(192,38,211,0.18)",
        borderRadius: 8,
        padding: "0.5rem 0.65rem",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-unbounded), 'Arial Black', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          color: "#1a0a14",
          marginBottom: 2,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-caveat), cursive",
          fontSize: 13,
          color: "rgba(74,26,46,0.7)",
        }}
      >
        {point?.displayValue ?? ""}
      </p>
    </div>
  );
}

export function MetricsChart({ data, color, label, gradientId }: Readonly<MetricsChartProps>) {
  const fillColor = color
    .replace("#ff8c1a", "rgba(255,140,26,")
    .replace("#ff4d6d", "rgba(255,77,109,")
    .replace("#c026d3", "rgba(192,38,211,")
    .replace("#60a5fa", "rgba(96,165,250,");

  const fillStart = fillColor.startsWith("rgba") ? `${fillColor}0.15)` : `${color}26`;
  const fillEnd = fillColor.startsWith("rgba") ? `${fillColor}0)` : `${color}00`;

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillStart} />
            <stop offset="100%" stopColor={fillEnd} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="0"
          stroke="rgba(74,26,46,0.06)"
          vertical={false}
        />
        <XAxis
          dataKey="time"
          tick={{
            fill: "rgba(74,26,46,0.42)",
            fontSize: 9,
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontWeight: 300,
          }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{
            fill: "rgba(74,26,46,0.42)",
            fontSize: 9,
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontWeight: 300,
          }}
          tickLine={false}
          axisLine={false}
          tickCount={5}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          name={label}
          stroke={color}
          strokeWidth={1.8}
          dot={false}
          activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
