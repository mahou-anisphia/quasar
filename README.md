_From the series "Stellar Guide"_

# Quasar 💫

**Quasar** is a lightweight, push-based server monitoring solution designed to run indefinitely at zero cost. It solves the problem of monitoring private servers (without static IPs) using serverless frontends (like Vercel) that cannot maintain persistent connections.

---

## 💡 The Concept: "Accidental" Telemetry

Most monitoring systems use a **Pull Model** (The dashboard asks: _"Are you alive?"_).
However, this requires the dashboard to be "always on" and the server to be publicly reachable.

**The Challenge:**
I wanted to monitor my home Linux server using a **Vercel** dashboard.

- **Constraint 1:** Vercel functions "sleep" and cannot run background cron jobs to ping my server.
- **Constraint 2:** My server didn't have a static IP or open ports.

**The Solution:**
I inverted the model. Quasar is a **Push-based** system.

1.  **The Agent:** A simple Linux service runs on the server.
2.  **The Pulse:** Every 3 minutes, it gathers vital stats (CPU, RAM, Docker container status) and `POST`s them to Vercel.
3.  **The Observer:** The Vercel dashboard saves this to PostgreSQL.
4.  **The Logic:** If the dashboard hasn't received a "pulse" in >5 minutes, it declares the server **Dead**.

_Essentially, I accidentally re-invented MQTT/IoT telemetry patterns to solve a budget constraint._

---

## ⚙️ Architecture

```mermaid
graph LR
    A[Linux Server] -- "POST /api/pulse (CPU/RAM)" --> B((Vercel API))
    B -- "Store Heartbeat" --> C[(PostgreSQL)]
    D[User Dashboard] -- "Query: Last Pulse Time?" --> C
    style A fill:#238636,stroke:#30363d,stroke-width:2px,color:#ffffff
    style B fill:#1f6feb,stroke:#30363d,stroke-width:2px,color:#ffffff
    style C fill:#8b949e,stroke:#30363d,stroke-width:2px,color:#ffffff
    style D fill:#a371f7,stroke:#30363d,stroke-width:2px,color:#ffffff
```

---

## Final Words: The Origin Story

I first built this in 2 hours back in 2024 when I got my first server but couldn't afford monitoring tools. It was crude—no dashboard, no concept, just a working hack.

1 year later, after time in management, I realized I'd lost touch with this kind of hands-on problem-solving. Quasar is my return to first-principles engineering: taking something I once hacked together and rebuilding it with proper architecture, clear concepts, and production quality.

The irony: the "ivory tower" made me rusty at the very skills that got me there.
