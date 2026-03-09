import Link from "next/link";

export function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        borderBottom: "1px dashed rgba(192,38,211,0.14)",
        background: "rgba(255,251,240,0.92)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Link
          href="/"
          className="font-caveat"
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "var(--q-purple)",
            textDecoration: "none",
            transform: "rotate(-1deg)",
            display: "inline-block",
            opacity: 0.7,
            transition: "opacity 0.2s",
          }}
        >
          ★ Stellar Guide
        </Link>
        <span style={{ fontWeight: 300, color: "rgba(74,26,46,0.22)", fontSize: "0.85rem" }}>/</span>
        <span
          className="font-unbounded"
          style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.04em", color: "var(--q-dark)" }}
        >
          QUASAR LENS
        </span>
      </div>

      <div
        className="font-caveat"
        style={{
          fontWeight: 700,
          fontSize: "0.88rem",
          color: "var(--q-purple)",
          background: "rgba(192,38,211,0.07)",
          border: "1.5px dashed rgba(192,38,211,0.25)",
          borderRadius: 100,
          padding: "0.3rem 0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          transform: "rotate(0.5deg)",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--q-purple)",
            flexShrink: 0,
            animation: "pulse-dot 2s ease-in-out infinite",
          }}
        />{"Auto-registers on first pulse"}
      </div>
    </header>
  );
}
