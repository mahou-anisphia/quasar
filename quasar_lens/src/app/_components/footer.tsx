import { api } from "~/trpc/server";

export async function Footer() {
  const servers = await api.server.getAll();
  const count = servers.length;

  return (
    <footer style={{ borderTop: "1px dashed rgba(192,38,211,0.14)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.85rem 2rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span className="font-jost" style={{ fontWeight: 300, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(74,26,46,0.38)" }}>Push-based</span>
          <span style={{ color: "rgba(74,26,46,0.38)", fontSize: "0.6rem", opacity: 0.4 }}>·</span>
          <span className="font-jost" style={{ fontWeight: 300, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(74,26,46,0.38)" }}>Zero cost</span>
          <span style={{ color: "rgba(74,26,46,0.38)", fontSize: "0.6rem", opacity: 0.4 }}>·</span>
          <span className="font-jost" style={{ fontWeight: 300, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(74,26,46,0.38)" }}>Accidentally invented IoT telemetry</span>
        </div>
        <span
          className="font-caveat"
          style={{
            fontWeight: 700,
            fontSize: "0.92rem",
            color: "var(--q-purple)",
            opacity: 0.65,
            transform: "rotate(-1deg)",
            display: "inline-block",
          }}
        >
          {count} node{count === 1 ? "" : "s"} in orbit ✦
        </span>
      </div>
    </footer>
  );
}
