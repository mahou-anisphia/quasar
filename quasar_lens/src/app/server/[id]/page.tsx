import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { api, HydrateClient } from "~/trpc/server";
import {
  formatBytes,
  formatLastSeen,
  isServerOffline,
  formatUptime,
} from "~/utils/format";
import { MetricsChart } from "./_components/metrics-chart";
import { StatCard } from "./_components/stat-card";
import { CrashesTable } from "./_components/crashes-table";

type PageProps = {
  params: Promise<{ id: string }>;
};

function SectionLabel({ children, color = "var(--q-orange)" }: Readonly<{ children: React.ReactNode; color?: string }>) {
  return (
    <div
      className="font-caveat"
      style={{
        fontWeight: 700,
        fontSize: "0.82rem",
        color,
        letterSpacing: "0.04em",
        display: "flex",
        alignItems: "center",
        gap: "0.38rem",
        marginBottom: "0.85rem",
      }}
    >
      <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>✦</span>
      {children}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  accentColor,
  children,
}: Readonly<{
  title: string;
  subtitle: string;
  accentColor: string;
  children: React.ReactNode;
}>) {
  return (
    <div
      style={{
        background: "#fff8ee",
        border: "1.5px solid rgba(192,38,211,0.13)",
        borderRadius: 16,
        padding: "1.3rem 1.5rem 1.2rem",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.2s",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "1.5rem",
          right: "1.5rem",
          height: 2,
          borderRadius: "0 0 2px 2px",
          background: accentColor,
          opacity: 0.35,
        }}
      />
      <div style={{ marginBottom: "0.5rem" }}>
        <span
          className="font-unbounded"
          style={{ fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.04em", color: "var(--q-dark)" }}
        >
          {title}
        </span>
        <span
          className="font-caveat"
          style={{
            fontWeight: 600,
            fontSize: "0.8rem",
            color: "rgba(74,26,46,0.38)",
            display: "block",
            transform: "rotate(-0.5deg)",
            marginTop: "0.05rem",
          }}
        >
          {subtitle}
        </span>
      </div>
      {children}
    </div>
  );
}

export default async function ServerDetailPage({ params }: PageProps) {
  const { id } = await params;

  let server;
  try {
    server = await api.server.getById({ serverId: id });
  } catch {
    notFound();
  }

  const latestTelemetry = server.telemetry[0];
  const isOffline =
    latestTelemetry && isServerOffline(new Date(latestTelemetry.createdAt));

  const recentTelemetry = server.telemetry.slice(0, 20);
  const avgCpu =
    recentTelemetry.length > 0
      ? recentTelemetry.reduce((sum, t) => sum + t.cpuUsagePercentage, 0) /
        recentTelemetry.length
      : 0;
  const avgRam =
    recentTelemetry.length > 0
      ? recentTelemetry.reduce((sum, t) => sum + t.ramUsagePercentage, 0) /
        recentTelemetry.length
      : 0;
  const avgDisk =
    recentTelemetry.length > 0
      ? recentTelemetry.reduce((sum, t) => sum + t.diskUsagePercentage, 0) /
        recentTelemetry.length
      : 0;

  const cpuChartData = server.telemetry
    .slice()
    .reverse()
    .map((t) => ({
      time: format(new Date(t.createdAt), "HH:mm:ss"),
      value: t.cpuUsagePercentage,
      displayValue: `${t.cpuUsagePercentage.toFixed(2)}%`,
    }));

  const ramChartData = server.telemetry
    .slice()
    .reverse()
    .map((t) => ({
      time: format(new Date(t.createdAt), "HH:mm:ss"),
      value: t.ramUsagePercentage,
      displayValue: `${t.ramUsagePercentage.toFixed(2)}%`,
    }));

  const diskChartData = server.telemetry
    .slice()
    .reverse()
    .map((t) => ({
      time: format(new Date(t.createdAt), "HH:mm:ss"),
      value: t.diskUsagePercentage,
      displayValue: `${t.diskUsagePercentage.toFixed(2)}%`,
    }));

  const swapChartData = server.telemetry
    .slice()
    .reverse()
    .map((t) => ({
      time: format(new Date(t.createdAt), "HH:mm:ss"),
      value: Number(t.swapUsedBytes),
      displayValue: formatBytes(t.swapUsedBytes),
    }));

  return (
    <HydrateClient>
      <div style={{ maxWidth: 1100, width: "100%", margin: "0 auto", padding: "2rem 2rem 2.5rem" }}>

        {/* Back link */}
        <Link
          href="/monitor"
          className="font-caveat"
          style={{
            display: "inline-block",
            fontWeight: 600,
            fontSize: "0.88rem",
            color: "rgba(74,26,46,0.58)",
            textDecoration: "none",
            marginBottom: "1.5rem",
            transform: "rotate(-0.5deg)",
            transition: "color 0.2s",
          }}
        >
          {"← back to monitor"}
        </Link>

        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "0.35rem",
            animation: "fade-up 0.5s 0.05s ease both",
          }}
        >
          <div>
            <div
              className="font-caveat"
              style={{
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "var(--q-orange)",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                marginBottom: "0.3rem",
              }}
            >
              <span style={{ fontSize: "0.65rem", animation: "spin-slow 8s linear infinite", display: "inline-block" }}>✦</span>
              {"server detail"}
            </div>
            <h1
              className="font-unbounded"
              style={{
                fontWeight: 900,
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                background: "linear-gradient(125deg, #c026d3 0%, #ff4d6d 35%, #ff8c1a 65%, #9333ea 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "200% 200%",
                animation: "burn 6s ease-in-out infinite",
              }}
            >
              {server.name}
            </h1>
            <p
              className="font-jost"
              style={{
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "0.7rem",
                color: "rgba(74,26,46,0.38)",
                marginTop: "0.4rem",
                letterSpacing: "0.04em",
              }}
            >
              {"id: "}
              {server.serverId}
            </p>
          </div>

          {/* Status badge */}
          <div
            className="font-caveat"
            style={{
              fontWeight: 700,
              fontSize: "0.9rem",
              padding: "0.3rem 0.85rem",
              borderRadius: 100,
              display: "flex",
              alignItems: "center",
              gap: "0.38rem",
              background: isOffline ? "rgba(255,77,109,0.08)" : "rgba(34,197,94,0.1)",
              border: `1.5px solid ${isOffline ? "rgba(255,77,109,0.3)" : "rgba(34,197,94,0.3)"}`,
              color: isOffline ? "var(--q-hot)" : "#16a34a",
              whiteSpace: "nowrap",
              flexShrink: 0,
              marginTop: "0.4rem",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: isOffline ? "var(--q-hot)" : "#22c55e",
                animation: isOffline
                  ? "dead-flicker 0.9s ease-in-out infinite"
                  : "green-pulse 2s ease-in-out infinite",
              }}
            />
            {isOffline ? "no signal 💀" : "pulsing ✓"}
          </div>
        </div>

        <div style={{ height: "1.8rem" }} />

        {/* Hardware specs */}
        <div style={{ animation: "fade-up 0.5s 0.15s ease both" }}>
          <SectionLabel>hardware specs</SectionLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0.9rem",
              marginBottom: "2rem",
            }}
          >
            <StatCard icon="🔲" label="cpu cores" value={server.totalCPU.toString()} description="total processor cores" accentColor="var(--q-orange)" />
            <StatCard icon="🟥" label="total ram" value={formatBytes(server.totalRam)} description={`${server.totalPhysicalRamBar} RAM stick${server.totalPhysicalRamBar !== 1 ? "s" : ""}`} accentColor="var(--q-hot)" />
            <StatCard icon="💾" label="total storage" value={formatBytes(server.totalDiskSpace)} description={`${server.totalDiskDrive} drive${server.totalDiskDrive !== 1 ? "s" : ""}`} accentColor="var(--q-violet)" />
            <StatCard
              icon="⚡"
              label="uptime"
              value={latestTelemetry ? formatUptime(latestTelemetry.uptime) : "N/A"}
              description={latestTelemetry ? `since ${formatLastSeen(new Date(latestTelemetry.createdAt))}` : "no data"}
              accentColor="var(--q-yellow)"
            />
          </div>
        </div>

        {/* Live metrics */}
        {latestTelemetry && (
          <div style={{ animation: "fade-up 0.5s 0.25s ease both" }}>
            <SectionLabel>right now</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.9rem",
                marginBottom: "2rem",
              }}
            >
              {[
                { label: "cpu usage", val: latestTelemetry.cpuUsagePercentage, avg: avgCpu, color: "var(--q-orange)", gradient: "linear-gradient(to right, var(--q-orange), var(--q-yellow))" },
                { label: "ram usage", val: latestTelemetry.ramUsagePercentage, avg: avgRam, color: "var(--q-hot)", gradient: "linear-gradient(to right, var(--q-hot), var(--q-magenta))" },
                { label: "disk usage", val: latestTelemetry.diskUsagePercentage, avg: avgDisk, color: "var(--q-violet)", gradient: "linear-gradient(to right, var(--q-violet), var(--q-purple))" },
              ].map(({ label, val, avg, color, gradient }) => (
                <div
                  key={label}
                  style={{
                    background: "#fff8ee",
                    border: "1.5px solid rgba(192,38,211,0.13)",
                    borderRadius: 14,
                    padding: "1.1rem 1.3rem 1rem",
                  }}
                >
                  <span className="font-caveat" style={{ fontWeight: 600, fontSize: "0.78rem", color: "rgba(74,26,46,0.38)", display: "block", marginBottom: "0.15rem" }}>{label}</span>
                  <span className="font-unbounded" style={{ fontWeight: 900, fontSize: "2.1rem", letterSpacing: "-0.03em", lineHeight: 1, color, display: "block" }}>
                    {val.toFixed(1)}%
                  </span>
                  <span className="font-jost" style={{ fontWeight: 300, fontStyle: "italic", fontSize: "0.7rem", color: "rgba(74,26,46,0.38)", display: "block", marginTop: "0.2rem" }}>
                    avg ({recentTelemetry.length} pulses): {avg.toFixed(1)}%
                  </span>
                  <div style={{ height: 4, borderRadius: 100, background: "rgba(74,26,46,0.07)", marginTop: "0.75rem", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 100, width: `${val}%`, background: gradient, transition: "width 0.8s cubic-bezier(0.34,1.2,0.64,1)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History charts */}
        <div style={{ animation: "fade-up 0.5s 0.35s ease both" }}>
          <SectionLabel>history ({server.telemetry.length} pulses)</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", marginBottom: "2rem" }}>
            <ChartCard title="CPU" subtitle="how hard it's working?" accentColor="var(--q-orange)">
              <MetricsChart data={cpuChartData} color="#ff8c1a" label="CPU %" gradientId="grad-cpu" />
            </ChartCard>
            <ChartCard title="RAM" subtitle="memory nom nom" accentColor="var(--q-hot)">
              <MetricsChart data={ramChartData} color="#ff4d6d" label="RAM %" gradientId="grad-ram" />
            </ChartCard>
            <ChartCard title="Disk" subtitle="bytes living rent free" accentColor="var(--q-violet)">
              <MetricsChart data={diskChartData} color="#c026d3" label="Disk %" gradientId="grad-disk" />
            </ChartCard>
            <ChartCard title="Swap" subtitle="spilled over onto disk..." accentColor="#60a5fa">
              <MetricsChart data={swapChartData} color="#60a5fa" label="Swap" gradientId="grad-swap" />
            </ChartCard>
          </div>
        </div>

        {/* Crashes */}
        {server.crashes.length > 0 && (
          <div>
            <SectionLabel color="var(--q-hot)">
              casualties ({server.crashes.length} events)
            </SectionLabel>
            <div
              style={{
                background: "#fff8ee",
                border: "1.5px solid rgba(255,77,109,0.2)",
                borderRadius: 16,
                padding: "1.3rem 1.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: "1.5rem",
                  right: "1.5rem",
                  height: 2,
                  borderRadius: "0 0 2px 2px",
                  background: "var(--q-hot)",
                  opacity: 0.35,
                }}
              />
              <div style={{ marginBottom: "0.85rem" }}>
                <span className="font-unbounded" style={{ fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.04em", color: "var(--q-dark)" }}>Crash Log</span>
                <span className="font-caveat" style={{ fontWeight: 600, fontSize: "0.8rem", color: "rgba(74,26,46,0.38)", display: "block", transform: "rotate(-0.5deg)", marginTop: "0.05rem" }}>
                  rip. detected via pulse gap 💀
                </span>
              </div>
              <CrashesTable crashes={server.crashes} />
            </div>
          </div>
        )}
      </div>
    </HydrateClient>
  );
}
