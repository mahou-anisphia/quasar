import { Activity, Server, Zap } from "lucide-react";
import { api, HydrateClient } from "~/trpc/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

function formatBytes(bytes: bigint | number): string {
  const b = typeof bytes === "bigint" ? Number(bytes) : bytes;
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = b;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

function formatLastSeen(timestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return "just now";

  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function Home() {
  const servers = await api.server.getAll();

  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8" />
              <h1 className="text-2xl font-bold">
                Quasar Lens
              </h1>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4 animate-pulse" />
              <span>Auto-registers on first pulse</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto flex-1 px-6 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Monitored Servers</h2>
            <p className="mt-2 text-muted-foreground">
              Servers automatically appear when Quasar Orbit sends the first
              telemetry pulse
            </p>
          </div>

          {servers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Server className="mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold">
                  No servers registered yet
                </h3>
                <p className="text-center text-muted-foreground">
                  Start Quasar Orbit on your server to see it appear here
                  automatically
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {servers.map((server) => (
                <Card
                  key={server.serverId}
                  className="transition-all hover:border-primary"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          {server.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {server.totalCPU} cores •{" "}
                          {formatBytes(server.totalRam)} RAM
                        </CardDescription>
                      </div>
                      <Server className="h-5 w-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Storage */}
                      <div>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-muted-foreground">Storage</span>
                          <span className="text-foreground">
                            {server.latestTelemetry
                              ? `${server.latestTelemetry.diskUsagePercentage.toFixed(1)}%`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: server.latestTelemetry
                                ? `${server.latestTelemetry.diskUsagePercentage}%`
                                : "0%",
                            }}
                          />
                        </div>
                      </div>

                      {/* CPU */}
                      <div>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-muted-foreground">CPU</span>
                          <span className="text-foreground">
                            {server.latestTelemetry
                              ? `${server.latestTelemetry.cpuUsagePercentage.toFixed(1)}%`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: server.latestTelemetry
                                ? `${server.latestTelemetry.cpuUsagePercentage}%`
                                : "0%",
                            }}
                          />
                        </div>
                      </div>

                      {/* RAM */}
                      <div>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-muted-foreground">RAM</span>
                          <span className="text-foreground">
                            {server.latestTelemetry
                              ? `${server.latestTelemetry.ramUsagePercentage.toFixed(1)}%`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: server.latestTelemetry
                                ? `${server.latestTelemetry.ramUsagePercentage}%`
                                : "0%",
                            }}
                          />
                        </div>
                      </div>

                      {/* Last Seen */}
                      {server.latestTelemetry && (
                        <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm">
                          <span className="text-muted-foreground">Last Seen</span>
                          <span className="font-mono text-foreground">
                            {formatLastSeen(
                              new Date(server.latestTelemetry.createdAt),
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t">
          <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
            <p>
              Quasar - Push-based server monitoring at zero cost •{" "}
              {servers.length} server{servers.length !== 1 ? "s" : ""}{" "}
              monitored
            </p>
          </div>
        </footer>
      </div>
    </HydrateClient>
  );
}
