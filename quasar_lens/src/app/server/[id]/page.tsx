import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Server,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { api, HydrateClient } from "~/trpc/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  formatBytes,
  formatLastSeen,
  isServerOffline,
  formatUptime,
} from "~/utils/format";
import { cn } from "~/lib/utils";
import { MetricsChart } from "./_components/metrics-chart";
import { StatCard } from "./_components/stat-card";
import { CrashesTable } from "./_components/crashes-table";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ServerDetailPage({ params }: PageProps) {
  const { id } = await params;

  let server;
  try {
    server = await api.server.getById({ serverId: id });
  } catch (error) {
    notFound();
  }

  const latestTelemetry = server.telemetry[0];
  const isOffline =
    latestTelemetry && isServerOffline(new Date(latestTelemetry.createdAt));

  // Calculate averages from recent telemetry
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

  // Format chart data on the server
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
      <div className="container mx-auto px-6 py-8">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Servers
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold">{server.name}</h1>
              <p className="text-muted-foreground mt-2">
                Server ID: <code className="text-xs">{server.serverId}</code>
              </p>
            </div>

            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
                isOffline
                  ? "bg-destructive/10 text-destructive"
                  : "bg-green-500/10 text-green-600 dark:text-green-500",
              )}
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  isOffline
                    ? "bg-destructive"
                    : "bg-green-600 dark:bg-green-500",
                )}
              />
              <span>{isOffline ? "Offline" : "Online"}</span>
            </div>
          </div>
        </div>

        {/* Hardware Specifications */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Cpu}
            label="CPU Cores"
            value={server.totalCPU.toString()}
            description="Total processor cores"
          />
          <StatCard
            icon={MemoryStick}
            label="Total RAM"
            value={formatBytes(server.totalRam)}
            description={`${server.totalPhysicalRamBar} RAM stick${server.totalPhysicalRamBar !== 1 ? "s" : ""}`}
          />
          <StatCard
            icon={HardDrive}
            label="Total Storage"
            value={formatBytes(server.totalDiskSpace)}
            description={`${server.totalDiskDrive} drive${server.totalDiskDrive !== 1 ? "s" : ""}`}
          />
          <StatCard
            icon={Activity}
            label="Uptime"
            value={
              latestTelemetry ? formatUptime(latestTelemetry.uptime) : "N/A"
            }
            description={
              latestTelemetry
                ? `Since ${formatLastSeen(new Date(latestTelemetry.createdAt))}`
                : "No data"
            }
          />
        </div>

        {/* Current Metrics Overview */}
        {latestTelemetry && (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestTelemetry.cpuUsagePercentage.toFixed(1)}%
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Avg: {avgCpu.toFixed(1)}%
                </p>
                <div className="bg-muted mt-3 h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${latestTelemetry.cpuUsagePercentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">RAM Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestTelemetry.ramUsagePercentage.toFixed(1)}%
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Avg: {avgRam.toFixed(1)}%
                </p>
                <div className="bg-muted mt-3 h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${latestTelemetry.ramUsagePercentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Disk Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestTelemetry.diskUsagePercentage.toFixed(1)}%
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Avg: {avgDisk.toFixed(1)}%
                </p>
                <div className="bg-muted mt-3 h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${latestTelemetry.diskUsagePercentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Historical Metrics Charts */}
        <div className="mb-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CPU Usage History</CardTitle>
              <CardDescription>
                Last {server.telemetry.length} data points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetricsChart data={cpuChartData} color="#8b5cf6" label="CPU %" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>RAM Usage History</CardTitle>
              <CardDescription>
                Last {server.telemetry.length} data points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetricsChart data={ramChartData} color="#3b82f6" label="RAM %" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disk Usage History</CardTitle>
              <CardDescription>
                Last {server.telemetry.length} data points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetricsChart
                data={diskChartData}
                color="#10b981"
                label="Disk %"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Swap Usage History</CardTitle>
              <CardDescription>
                Last {server.telemetry.length} data points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetricsChart data={swapChartData} color="#f59e0b" label="Swap" />
            </CardContent>
          </Card>
        </div>

        {/* Crashes Table */}
        {server.crashes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Crashes</CardTitle>
              <CardDescription>
                Last {server.crashes.length} detected crashes or downtime events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CrashesTable crashes={server.crashes} />
            </CardContent>
          </Card>
        )}
      </div>
    </HydrateClient>
  );
}
