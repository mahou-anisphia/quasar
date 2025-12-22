import { api } from "~/trpc/server";

export async function Footer() {
  const servers = await api.server.getAll();

  return (
    <footer className="border-t">
      <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
        <p>
          Quasar - Push-based server monitoring at zero cost •{" "}
          {servers.length} server{servers.length !== 1 ? "s" : ""}{" "}
          monitored
        </p>
      </div>
    </footer>
  );
}
