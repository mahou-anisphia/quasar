import { Server } from "lucide-react";
import { api, HydrateClient } from "~/trpc/server";
import {
  Card,
  CardContent,
} from "~/components/ui/card";
import { ServerCard } from "./_components/server-card";

export default async function Home() {
  const servers = await api.server.getAll();

  return (
    <HydrateClient>
      <div className="container mx-auto px-6 py-8">
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
              <ServerCard key={server.serverId} server={server} />
            ))}
          </div>
        )}
      </div>
    </HydrateClient>
  );
}
