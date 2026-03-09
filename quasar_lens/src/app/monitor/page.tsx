import { Server } from "lucide-react";
import { api, HydrateClient } from "~/trpc/server";
import { ServerCard } from "./_components/server-card";

export default async function MonitorPage() {
  const servers = await api.server.getAll();

  return (
    <HydrateClient>
      <div style={{ maxWidth: 1400, width: "100%", margin: "0 auto", padding: "2rem 2rem 1.5rem" }}>
        <div style={{ marginBottom: "1.6rem" }}>
          <div
            className="font-caveat"
            style={{
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "var(--q-orange)",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              marginBottom: "0.35rem",
            }}
          >
            <span style={{ fontSize: "0.7rem", animation: "spin-slow 8s linear infinite", display: "inline-block" }}>✦</span>
            {"active nodes"}
          </div>
          <h1
            className="font-unbounded"
            style={{ fontWeight: 900, fontSize: "1.6rem", letterSpacing: "-0.02em", color: "var(--q-dark)", lineHeight: 1 }}
          >
            Monitored Servers
          </h1>
          <p
            className="font-jost"
            style={{ fontWeight: 300, fontStyle: "italic", fontSize: "0.78rem", color: "rgba(74,26,46,0.45)", marginTop: "0.4rem" }}
          >
            auto-registers on first pulse · no config needed
          </p>
        </div>

        {servers.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "4rem 2rem",
              background: "#fff8ee",
              border: "1.5px solid rgba(192,38,211,0.15)",
              borderRadius: 16,
            }}
          >
            <Server style={{ color: "var(--q-purple)", opacity: 0.25, width: 64, height: 64, marginBottom: "1rem" }} />
            <h3
              className="font-unbounded"
              style={{ fontSize: "1.1rem", letterSpacing: "-0.01em", marginBottom: "0.5rem" }}
            >
              no nodes yet!!
            </h3>
            <p
              className="font-caveat"
              style={{ color: "rgba(74,26,46,0.4)", fontSize: "1rem", textAlign: "center" }}
            >
              run Orbit on a server → it appears here automatically
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "1.2rem",
            }}
          >
            {servers.map((server) => (
              <ServerCard key={server.serverId} server={server} />
            ))}
          </div>
        )}
      </div>
    </HydrateClient>
  );
}
