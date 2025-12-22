import { Server } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatBytes, formatLastSeen, isServerOffline } from "~/utils/format";
import { cn } from "~/lib/utils";

type ServerCardProps = {
  server: {
    serverId: string;
    name: string;
    totalCPU: number;
    totalRam: bigint;
    latestTelemetry: {
      createdAt: Date;
      diskUsagePercentage: number;
      cpuUsagePercentage: number;
      ramUsagePercentage: number;
    } | null;
  };
};

export function ServerCard({ server }: ServerCardProps) {
  const isOffline =
    server.latestTelemetry &&
    isServerOffline(new Date(server.latestTelemetry.createdAt));

  return (
    <Card
      className={cn(
        "transition-all",
        isOffline
          ? "border-destructive/50 bg-destructive/5 hover:border-destructive"
          : "hover:border-primary",
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">
              {server.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {server.totalCPU} cores • {formatBytes(server.totalRam)} RAM
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Server className={cn("h-5 w-5", isOffline && "text-destructive")} />
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                isOffline
                  ? "bg-destructive/10 text-destructive"
                  : "bg-green-500/10 text-green-600 dark:text-green-500"
              )}
            >
              <div
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isOffline ? "bg-destructive" : "bg-green-600 dark:bg-green-500"
                )}
              />
              <span>{isOffline ? "Offline" : "Online"}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isOffline ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-destructive/10 mb-3 rounded-full p-3">
              <Server className="text-destructive h-8 w-8" />
            </div>
            <p className="text-destructive mb-1 text-sm font-medium">
              Server Offline
            </p>
            <p className="text-muted-foreground text-xs">
              No telemetry data received for 5+ minutes
            </p>
            {server.latestTelemetry && (
              <div className="bg-muted/50 mt-4 rounded-md px-3 py-2">
                <p className="text-muted-foreground text-xs">
                  Last seen:{" "}
                  <span className="text-destructive font-mono">
                    {formatLastSeen(new Date(server.latestTelemetry.createdAt))}
                  </span>
                </p>
              </div>
            )}
          </div>
        ) : (
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
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full"
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
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full"
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
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full"
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
                <span className="text-foreground font-mono">
                  {formatLastSeen(new Date(server.latestTelemetry.createdAt))}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
