"use client";

import Link from "next/link";
import { formatBytes, formatLastSeen, formatUptime, isServerOffline } from "~/utils/format";

type Telemetry = {
  createdAt: Date;
  diskUsagePercentage: number;
  cpuUsagePercentage: number;
  ramUsagePercentage: number;
  uptime: bigint;
};

type ServerCardProps = {
  server: {
    serverId: string;
    name: string;
    totalCPU: number;
    totalRam: bigint;
    latestTelemetry: Telemetry | null;
  };
};

function MetricRow({
  label,
  value,
  gradient,
}: Readonly<{
  label: string;
  value: number | null;
  gradient: string;
}>) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr 44px",
        alignItems: "center",
        gap: "0.6rem",
      }}
    >
      <span
        className="font-caveat"
        style={{
          fontWeight: 600,
          fontSize: "0.82rem",
          color: "rgba(74,26,46,0.45)",
          textAlign: "right",
        }}
      >
        {label}
      </span>
      <div
        style={{
          height: 5,
          borderRadius: 100,
          background: "rgba(74,26,46,0.07)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 100,
            width: `${value ?? 0}%`,
            background: gradient,
            transition: "width 1s cubic-bezier(0.34,1.2,0.64,1)",
          }}
        />
      </div>
      <span
        className="font-jost"
        style={{
          fontWeight: 400,
          fontSize: "0.75rem",
          color: "var(--q-mid)",
          textAlign: "right",
        }}
      >
        {value === null ? "—" : `${value.toFixed(1)}%`}
      </span>
    </div>
  );
}

function OnlineContent({ telemetry }: Readonly<{ telemetry: Telemetry }>) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.1rem" }}>
        <MetricRow
          label="disk"
          value={telemetry.diskUsagePercentage}
          gradient="linear-gradient(to right, var(--q-violet), var(--q-purple))"
        />
        <MetricRow
          label="cpu"
          value={telemetry.cpuUsagePercentage}
          gradient="linear-gradient(to right, var(--q-orange), var(--q-yellow))"
        />
        <MetricRow
          label="ram"
          value={telemetry.ramUsagePercentage}
          gradient="linear-gradient(to right, var(--q-hot), var(--q-magenta))"
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "0.85rem",
          borderTop: "1px dashed rgba(192,38,211,0.1)",
        }}
      >
        <div>
          <span
            className="font-caveat"
            style={{ fontWeight: 600, fontSize: "0.8rem", color: "rgba(74,26,46,0.22)" }}
          >
            {"last seen "}
          </span>
          <span
            className="font-caveat"
            style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--q-purple)" }}
          >
            {formatLastSeen(new Date(telemetry.createdAt))}
          </span>
        </div>
        <span
          className="font-jost"
          style={{
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "0.68rem",
            color: "rgba(74,26,46,0.22)",
          }}
        >
          {"up "}
          {formatUptime(telemetry.uptime)}
        </span>
      </div>
    </>
  );
}

function OfflineContent({ telemetry }: Readonly<{ telemetry: Telemetry | null }>) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1.4rem 0 1rem",
        gap: "0.55rem",
      }}
    >
      <span
        style={{
          fontSize: "1.8rem",
          opacity: 0.3,
          animation: "nosig-float 3s ease-in-out infinite",
          display: "block",
        }}
        aria-hidden
      >
        📡
      </span>
      <span
        className="font-caveat"
        style={{
          fontWeight: 700,
          fontSize: "1.1rem",
          color: "var(--q-hot)",
          opacity: 0.75,
          transform: "rotate(-1deg)",
          display: "inline-block",
        }}
      >
        {"no signal 👀"}
      </span>
      <p
        className="font-jost"
        style={{
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: "0.72rem",
          color: "rgba(74,26,46,0.22)",
          textAlign: "center",
          lineHeight: 1.55,
        }}
      >
        No telemetry for 5+ minutes.
        <br />
        Orbit might be down, or the server is.
      </p>
      {telemetry && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.4rem 0.75rem",
            background: "rgba(255,77,109,0.05)",
            border: "1px dashed rgba(255,77,109,0.2)",
            borderRadius: 8,
            marginTop: "0.2rem",
          }}
        >
          <span
            className="font-caveat"
            style={{ fontWeight: 600, fontSize: "0.78rem", color: "rgba(255,77,109,0.45)" }}
          >
            last seen
          </span>
          <span
            className="font-caveat"
            style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--q-hot)" }}
          >
            {formatLastSeen(new Date(telemetry.createdAt))}
          </span>
        </div>
      )}
    </div>
  );
}

export function ServerCard({ server }: Readonly<ServerCardProps>) {
  const isOffline =
    !server.latestTelemetry ||
    isServerOffline(new Date(server.latestTelemetry.createdAt));

  function handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = e.currentTarget;
    if (isOffline) {
      el.style.borderColor = "rgba(255,77,109,0.3)";
      el.style.boxShadow = "0 8px 32px rgba(255,77,109,0.06)";
    } else {
      el.style.borderColor = "rgba(34,197,94,0.38)";
      el.style.boxShadow = "0 8px 32px rgba(34,197,94,0.07)";
    }
    el.style.transform = "translateY(-2px) rotate(0.2deg)";
  }

  function handleMouseLeave(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = e.currentTarget;
    el.style.borderColor = isOffline ? "rgba(255,77,109,0.15)" : "rgba(34,197,94,0.2)";
    el.style.boxShadow = "";
    el.style.transform = "";
  }

  return (
    <Link
      href={`/server/${server.serverId}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        background: isOffline ? "#fff5f7" : "#fff8ee",
        border: `1.5px solid ${isOffline ? "rgba(255,77,109,0.15)" : "rgba(34,197,94,0.2)"}`,
        borderRadius: 16,
        padding: "1.4rem 1.5rem 1.3rem",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        animation: "card-in 0.5s ease both",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Corner accent */}
      <span
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          borderRadius: "0 16px 0 100px",
          opacity: 0.045,
          pointerEvents: "none",
          background: isOffline ? "#ff4d6d" : "#22c55e",
        }}
        aria-hidden
      />

      {/* Card header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
          <span style={{ fontSize: "1rem", marginBottom: "0.25rem", display: "block" }}>🖥</span>
          <span
            className="font-unbounded"
            style={{
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "-0.01em",
              color: "var(--q-dark)",
              lineHeight: 1,
            }}
          >
            {server.name}
          </span>
          <span
            className="font-jost"
            style={{
              fontWeight: 300,
              fontSize: "0.7rem",
              color: "rgba(74,26,46,0.45)",
              letterSpacing: "0.03em",
              marginTop: "0.15rem",
            }}
          >
            {server.totalCPU}
            {" cores · "}
            {formatBytes(server.totalRam)}
            {" RAM"}
          </span>
        </div>

        {/* Status badge */}
        <div
          className="font-caveat"
          style={{
            fontWeight: 700,
            fontSize: "0.85rem",
            padding: "0.22rem 0.7rem",
            borderRadius: 100,
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            whiteSpace: "nowrap",
            flexShrink: 0,
            background: isOffline ? "rgba(255,77,109,0.08)" : "rgba(34,197,94,0.1)",
            border: `1.5px solid ${isOffline ? "rgba(255,77,109,0.22)" : "rgba(34,197,94,0.3)"}`,
            color: isOffline ? "var(--q-hot)" : "#16a34a",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              flexShrink: 0,
              background: isOffline ? "var(--q-hot)" : "#22c55e",
              animation: isOffline
                ? "dead-flicker 0.9s ease-in-out infinite"
                : "green-pulse 2s ease-in-out infinite",
            }}
          />
          {isOffline ? "offline!!" : "pulsing ✓"}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "linear-gradient(to right, rgba(192,38,211,0.1), transparent)",
          marginBottom: "1rem",
        }}
      />

      {/* Content */}
      {isOffline ? (
        <OfflineContent telemetry={server.latestTelemetry} />
      ) : (
        <OnlineContent telemetry={server.latestTelemetry!} />
      )}
    </Link>
  );
}
