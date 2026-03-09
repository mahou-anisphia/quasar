"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SparkCanvas } from "./spark-canvas";

type Status = "alive" | "probably" | "dead" | "forgotten";

// Hardcoded showcase roster — intentional, shows visitors how it works
const MOCK_ROSTER: { name: string; status: Status; note: string }[] = [
  { name: "Quasar",    status: "alive",     note: "very much alive!!" },
  { name: "Polaris",   status: "probably",  note: "probably fine" },
  { name: "VanadisHQ", status: "dead",      note: "rip. ram issues 💀" },
  { name: "Mac Mini",  status: "forgotten", note: "...still shipping" },
];

const STATUS_PHRASES = [
  "consuming everything!!",
  "orbit: pulsing ✓",
  "lens: watching!!",
  "no pulse in 4min... 👀",
  "all services up!!",
  "push model ftw!!",
  "accidentally invented MQTT lol",
  "it's fine. probably.",
];

export function LandingPage() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    // OS detection for font rendering
    const ua = navigator.userAgent;
    const pl = (navigator as { platform?: string }).platform ?? "";
    const isWindows = /Win/.test(pl) || /Windows/.test(ua);
    const isMac = /Mac/.test(pl) && !/iPhone|iPad/.test(ua);
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const os = isWindows
      ? "windows"
      : isMac
        ? "mac"
        : isIOS
          ? "ios"
          : isAndroid
            ? "android"
            : "other";
    document.documentElement.setAttribute("data-os", os);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.35) {
        setPhraseIdx((i) => (i + 1) % STATUS_PHRASES.length);
      }
    }, 2400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        `Pi 5 · ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")} UTC+7`,
      );
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        background: "var(--q-bg)",
        fontFamily: "var(--font-unbounded), 'Arial Black', sans-serif",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <SparkCanvas />

      {/* ── Background blobs ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {[
          {
            w: 520,
            h: 520,
            bg: "rgba(192,38,211,0.10)",
            top: "-120px",
            right: "-100px",
            dur: "9s",
            delay: "0s",
          },
          {
            w: 420,
            h: 420,
            bg: "rgba(255,210,46,0.13)",
            bottom: "-90px",
            left: "-80px",
            dur: "12s",
            delay: "-4s",
          },
          {
            w: 320,
            h: 320,
            bg: "rgba(255,77,109,0.08)",
            top: "35%",
            left: "28%",
            dur: "10s",
            delay: "-6s",
          },
          {
            w: 260,
            h: 260,
            bg: "rgba(147,51,234,0.07)",
            top: "15%",
            left: "12%",
            dur: "14s",
            delay: "-2s",
          },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: b.w,
              height: b.h,
              borderRadius: "50%",
              background: b.bg,
              filter: "blur(80px)",
              top: b.top,
              bottom: b.bottom,
              left: b.left,
              right: b.right,
              animation: `blob-drift ${b.dur} ${b.delay} ease-in-out infinite alternate`,
            }}
          />
        ))}

        {/* tape decorations */}
        <div
          style={{
            position: "absolute",
            width: 65,
            height: 18,
            borderRadius: 2,
            background: "rgba(192,38,211,0.18)",
            top: "20%",
            left: "9%",
            transform: "rotate(-13deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 52,
            height: 18,
            borderRadius: 2,
            background: "rgba(255,77,109,0.16)",
            bottom: "22%",
            right: "8%",
            transform: "rotate(7deg)",
          }}
        />

        {/* margin notes */}
        <div
          style={{
            position: "absolute",
            fontFamily: "var(--font-caveat), cursive",
            fontWeight: 600,
            fontSize: "0.78rem",
            lineHeight: 1.6,
            top: "22%",
            left: "3%",
            color: "rgba(147,51,234,0.26)",
            transform: "rotate(-3.5deg)",
            textAlign: "right",
          }}
        >
          Orbit → pushes
          <br />
          every 3 min
          <br />← serverless-safe!!
        </div>
        <div
          style={{
            position: "absolute",
            fontFamily: "var(--font-caveat), cursive",
            fontWeight: 600,
            fontSize: "0.78rem",
            lineHeight: 1.6,
            bottom: "20%",
            right: "3%",
            color: "rgba(232,25,110,0.26)",
            transform: "rotate(2.5deg)",
            textAlign: "left",
          }}
        >
          Lens watches
          <br />
          no pulse = 💀
          <br />
          very smart actually →
        </div>
      </div>

      {/* ── Main layout ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          overflow: "hidden",
        }}
      >
        {/* ── Topbar ── */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.4rem 2.5rem",
            opacity: 0,
            animation: "from-top 0.6s 0.1s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontWeight: 700,
              fontSize: "1.1rem",
              letterSpacing: "0.02em",
              color: "var(--q-purple)",
              transform: "rotate(-1deg)",
              display: "inline-block",
            }}
          >
            ★ Stellar Guide
          </span>

          <nav>
            <ul
              style={{
                display: "flex",
                gap: "0.6rem",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              {["Overview", "Architecture", "Nodes", "Docs"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    style={{
                      fontFamily: "var(--font-jost), system-ui, sans-serif",
                      fontWeight: 400,
                      fontSize: "0.6rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--q-mid)",
                      textDecoration: "none",
                      padding: "0.35rem 0.9rem",
                      border: "1.5px solid transparent",
                      borderRadius: "100px",
                      opacity: 0.45,
                      transition: "all 0.2s",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      const t = e.currentTarget;
                      t.style.borderColor = "var(--q-purple)";
                      t.style.color = "var(--q-purple)";
                      t.style.opacity = "1";
                      t.style.transform = "rotate(-1deg)";
                    }}
                    onMouseLeave={(e) => {
                      const t = e.currentTarget;
                      t.style.borderColor = "transparent";
                      t.style.color = "var(--q-mid)";
                      t.style.opacity = "0.45";
                      t.style.transform = "none";
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <span
            suppressHydrationWarning
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "var(--q-purple)",
              opacity: 0.8,
              transform: "rotate(2deg)",
              display: "inline-block",
            }}
          >
            {STATUS_PHRASES[phraseIdx]}
          </span>
        </header>

        {/* ── Center ── */}
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* background exclamation */}
          <span
            aria-hidden
            style={{
              fontFamily: "var(--font-unbounded), 'Arial Black', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(4rem,13vw,9rem)",
              color: "var(--q-yellow)",
              position: "absolute",
              top: "50%",
              left: "5%",
              transform: "translateY(-60%) rotate(-8deg)",
              opacity: 0.14,
              pointerEvents: "none",
              userSelect: "none",
              animation: "wobble 3s ease-in-out infinite",
              lineHeight: 1,
            }}
          >
            !!
          </span>

          {/* project tag */}
          <div
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "var(--q-orange)",
              letterSpacing: "0.03em",
              transform: "rotate(-2deg)",
              display: "inline-block",
              marginBottom: "1rem",
              position: "relative",
              opacity: 0,
              animation:
                "from-bottom 0.7s 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
          >
            Project 001 — Push-Based Monitoring ✦
          </div>

          {/* title */}
          <div
            style={{
              opacity: 0,
              animation:
                "from-left 0.7s 0.45s cubic-bezier(0.34,1.4,0.64,1) forwards",
              marginBottom: "0.4rem",
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-unbounded), 'Arial Black', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(4rem,13vw,10.5rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                display: "block",
                transform: "rotate(-1deg)",
                background:
                  "linear-gradient(125deg, #c026d3 0%, #ff4d6d 22%, #ff8c1a 42%, #ffd22e 58%, #ff4d6d 76%, #9333ea 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "220% 220%",
                animation: "burn 5s ease-in-out infinite",
              }}
            >
              QUASAR
            </h1>
            <div
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontWeight: 700,
                fontSize: "clamp(0.95rem,2vw,1.3rem)",
                color: "var(--q-purple)",
                opacity: 0.58,
                transform: "rotate(1.5deg)",
                display: "inline-block",
                marginTop: "0.45rem",
                letterSpacing: "0.01em",
              }}
            >
              most violent thing in the constellation (lovingly)
            </div>
          </div>

          {/* description */}
          <p
            style={{
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(0.76rem,1.1vw,0.88rem)",
              lineHeight: 1.95,
              color: "rgba(74,26,46,0.48)",
              maxWidth: 420,
              margin: "1.5rem auto 1.9rem",
              opacity: 0,
              animation: "from-bottom 0.7s 0.8s ease forwards",
            }}
          >
            <strong
              style={{
                fontStyle: "normal",
                fontWeight: 400,
                color: "var(--q-purple)",
              }}
            >
              Orbit
            </strong>{" "}
            runs on your server. Pushes vitals every 3 min.
            <br />
            <strong
              style={{
                fontStyle: "normal",
                fontWeight: 400,
                color: "var(--q-purple)",
              }}
            >
              Lens
            </strong>{" "}
            watches from Vercel. No pulse in 5 min? Dead.
            <br />
            Zero cost. No static IP needed.
          </p>

          {/* arch pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.9rem",
              marginBottom: "1.5rem",
              opacity: 0,
              animation: "from-bottom 0.7s 0.95s ease forwards",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontWeight: 700,
                fontSize: "0.95rem",
                padding: "0.3rem 0.85rem",
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                gap: "0.38rem",
                background: "rgba(255,140,26,0.10)",
                border: "1.5px solid rgba(255,140,26,0.3)",
                color: "var(--q-orange)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--q-orange)",
                  boxShadow: "0 0 7px rgba(255,140,26,0.6)",
                  animation: "prob-blink 2.5s ease-in-out infinite",
                  flexShrink: 0,
                }}
              />
              Orbit — Go agent
            </div>
            <span
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "rgba(74,26,46,0.2)",
              }}
            >
              pulses →
            </span>
            <div
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontWeight: 700,
                fontSize: "0.95rem",
                padding: "0.3rem 0.85rem",
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                gap: "0.38rem",
                background: "rgba(192,38,211,0.08)",
                border: "1.5px solid rgba(192,38,211,0.28)",
                color: "var(--q-purple)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--q-purple)",
                  boxShadow: "0 0 7px rgba(192,38,211,0.55)",
                  animation: "alive-blink 2s ease-in-out infinite",
                  flexShrink: 0,
                }}
              />
              Lens — Next.js dashboard
            </div>
          </div>

          {/* server roster — hardcoded showcase, always visible */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginBottom: "2.4rem",
              alignItems: "center",
              opacity: 0,
              animation: "from-bottom 0.7s 1s ease forwards",
            }}
          >
            {MOCK_ROSTER.map((srv) => {
              const styles = statusStyles[srv.status];
              return (
                <div
                  key={srv.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontFamily: "var(--font-caveat), cursive",
                    fontWeight: 600,
                    fontSize: "1.05rem",
                    letterSpacing: "0.01em",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: styles.dotColor,
                      boxShadow: styles.dotShadow,
                      animation: styles.dotAnimation,
                    }}
                  />
                  <span
                    style={{
                      minWidth: 90,
                      textAlign: "right",
                      color: styles.nameColor,
                      textDecoration: styles.nameDecoration,
                    }}
                  >
                    {srv.name}
                  </span>
                  <span style={{ color: "rgba(74,26,46,0.2)", fontSize: "0.9rem" }}>
                    —
                  </span>
                  <span style={{ fontStyle: "italic", color: styles.noteColor }}>
                    {srv.note}
                  </span>
                </div>
              );
            })}
          </div>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.2rem",
              opacity: 0,
              animation:
                "from-bottom 0.8s 1.2s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
          >
            <Link
              href="/monitor"
              style={{
                fontFamily: "var(--font-unbounded), 'Arial Black', sans-serif",
                fontWeight: 700,
                fontSize: "0.6rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "var(--q-dark)",
                background: "var(--q-yellow)",
                padding: "0.85rem 2rem",
                textDecoration: "none",
                borderRadius: "100px",
                transform: "rotate(-1deg)",
                display: "inline-block",
                boxShadow: "3px 3px 0 var(--q-purple)",
                transition: "transform 0.2s, box-shadow 0.2s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                const t = e.currentTarget;
                t.style.transform = "rotate(0deg) translateY(-2px)";
                t.style.boxShadow = "4px 5px 0 var(--q-magenta)";
                t.style.background = "#ffe055";
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget;
                t.style.transform = "rotate(-1deg)";
                t.style.boxShadow = "3px 3px 0 var(--q-purple)";
                t.style.background = "var(--q-yellow)";
              }}
            >
              Open Lens →
            </Link>
            <a
              href="https://github.com/mahou-anisphia/quasar"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontWeight: 600,
                fontSize: "1rem",
                color: "rgba(74,26,46,0.45)",
                textDecoration: "none",
                transform: "rotate(1.5deg)",
                display: "inline-block",
                transition: "color 0.2s",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--q-purple)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(74,26,46,0.45)")
              }
            >
              or read how Orbit works
            </a>
          </div>
        </main>

        {/* ── Bottombar ── */}
        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.1rem 2.5rem",
            borderTop: "1px dashed rgba(192,38,211,0.14)",
            opacity: 0,
            animation: "from-bottom 0.6s 1.4s ease forwards",
          }}
        >
          <div style={{ display: "flex", gap: "0.9rem", alignItems: "center" }}>
            {["Polaris", "Quasar", "Pulsar", "Aphelion", "Nordlicht"].map(
              (name, i, arr) => (
                <div
                  key={name}
                  style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jost), system-ui, sans-serif",
                      fontWeight: name === "Quasar" ? 400 : 300,
                      fontSize: "0.58rem",
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color:
                        name === "Quasar"
                          ? "var(--q-purple)"
                          : "rgba(74,26,46,0.18)",
                    }}
                  >
                    {name}
                    {name === "Quasar" && (
                      <span style={{ fontSize: "0.44rem" }}> ★</span>
                    )}
                  </span>
                  {i < arr.length - 1 && (
                    <span
                      style={{
                        width: 14,
                        height: 1,
                        background: "rgba(192,38,211,0.14)",
                        display: "inline-block",
                      }}
                    />
                  )}
                </div>
              ),
            )}
          </div>
          <span
            suppressHydrationWarning
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "rgba(74,26,46,0.17)",
              transform: "rotate(-1deg)",
              display: "inline-block",
            }}
          >
            {timeStr}
          </span>
        </footer>
      </div>
    </div>
  );
}

const statusStyles: Record<
  Status,
  {
    dotColor: string;
    dotShadow: string;
    dotAnimation: string;
    nameColor: string;
    nameDecoration: string;
    noteColor: string;
  }
> = {
  alive: {
    dotColor: "#5cb87a",
    dotShadow: "0 0 7px rgba(92,184,122,0.7)",
    dotAnimation: "alive-blink 2s ease-in-out infinite",
    nameColor: "var(--q-purple)",
    nameDecoration: "none",
    noteColor: "rgba(92,184,122,0.75)",
  },
  probably: {
    dotColor: "var(--q-orange)",
    dotShadow: "0 0 6px rgba(255,140,26,0.5)",
    dotAnimation: "prob-blink 3.5s ease-in-out infinite",
    nameColor: "var(--q-orange)",
    nameDecoration: "none",
    noteColor: "rgba(255,140,26,0.65)",
  },
  dead: {
    dotColor: "var(--q-hot)",
    dotShadow: "none",
    dotAnimation: "dead-flicker 0.8s ease-in-out infinite",
    nameColor: "var(--q-hot)",
    nameDecoration: "line-through",
    noteColor: "rgba(255,77,109,0.55)",
  },
  forgotten: {
    dotColor: "rgba(150,130,120,0.35)",
    dotShadow: "none",
    dotAnimation: "none",
    nameColor: "rgba(100,80,70,0.4)",
    nameDecoration: "none",
    noteColor: "rgba(100,80,70,0.3)",
  },
};
