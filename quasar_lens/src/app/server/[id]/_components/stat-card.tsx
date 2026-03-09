type StatCardProps = {
  icon: string;
  label: string;
  value: string;
  description: string;
  accentColor?: string;
};

export function StatCard({
  icon,
  label,
  value,
  description,
  accentColor = "var(--q-purple)",
}: Readonly<StatCardProps>) {
  return (
    <div
      className="hw-tile"
      style={{
        background: "#fff8ee",
        border: "1.5px solid rgba(192,38,211,0.13)",
        borderRadius: 14,
        padding: "1.1rem 1.2rem",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Circular accent blob */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: -18,
          right: -14,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: accentColor,
          opacity: 0.05,
          pointerEvents: "none",
        }}
      />

      <span style={{ fontSize: "1.15rem", marginBottom: "0.55rem", display: "block", filter: "saturate(1.2)" }}>
        {icon}
      </span>
      <span
        className="font-caveat"
        style={{
          fontWeight: 600,
          fontSize: "0.76rem",
          color: "rgba(74,26,46,0.38)",
          letterSpacing: "0.05em",
          textTransform: "lowercase",
          marginBottom: "0.2rem",
          display: "block",
        }}
      >
        {label}
      </span>
      <span
        className="font-unbounded"
        style={{
          fontWeight: 900,
          fontSize: "1.45rem",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: "var(--q-dark)",
          display: "block",
        }}
      >
        {value}
      </span>
      <span
        className="font-jost"
        style={{
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: "0.68rem",
          color: "rgba(74,26,46,0.38)",
          marginTop: "0.2rem",
          display: "block",
        }}
      >
        {description}
      </span>
    </div>
  );
}
