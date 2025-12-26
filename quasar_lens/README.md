# Quasar Lens 🔭

**Quasar Lens** is a reference implementation dashboard for receiving and visualizing telemetry from Quasar Orbit agents.

> **Note:** Quasar Orbit is designed to be **loosely coupled** - you can use any service, dashboard, or backend to receive the telemetry data. Quasar Lens is just one example implementation using Next.js and Vercel.

---

## 📡 Telemetry Format

Quasar Orbit agents send telemetry data as JSON via HTTP POST. You can integrate this with **any backend, service, or dashboard** of your choice.

### JSON Payload Structure

```json
{
  "server": {
    "serverName": "MyServer",
    "totalCpu": 8,
    "totalRam": 16000000000,
    "totalPhysicalRamBar": 2,
    "totalDiskSpace": 500000000000,
    "totalDiskDrive": 1
  },
  "telemetry": {
    "diskUsagePercentage": 45.5,
    "uptime": 7200,
    "cpuUsagePercentage": 12.3,
    "ramUsagePercentage": 65.2,
    "swapUsedBytes": 1000000
  }
}
```

### Field Descriptions

**Server (Static Hardware Info):**
- `serverName` (string): Server identifier
- `totalCpu` (int): Number of CPU cores
- `totalRam` (int64): Total RAM in bytes
- `totalPhysicalRamBar` (int): Number of physical RAM sticks
- `totalDiskSpace` (int64): Total disk space in bytes
- `totalDiskDrive` (int): Number of disk drives

**Telemetry (Time-Series Metrics):**

*Tier 1 Metrics (Critical):*
- `diskUsagePercentage` (float): Disk space usage percentage
- `uptime` (int64): System uptime in seconds

*Tier 2 Metrics (System Health):*
- `cpuUsagePercentage` (float): CPU utilization percentage
- `ramUsagePercentage` (float): Memory usage percentage
- `swapUsedBytes` (int64): Swap space used in bytes

---

## 🏗️ Reference Implementation (Quasar Lens)

This repository includes a Next.js dashboard as a reference implementation, but you're free to use any technology stack.

### Prerequisites
- Node.js 18+ & pnpm
- PostgreSQL database (or any data store you prefer)

### Installation

```bash
cd quasar_lens

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your DATABASE_URL

# Initialize database (if using Prisma)
pnpm prisma migrate dev
pnpm prisma generate

# Run development server
pnpm dev
```

Visit `http://localhost:3000`

---

## 🔌 Integration Options

Since Quasar Orbit sends standard JSON over HTTP POST, you can integrate with various services:

### Option 1: Custom Backend
Build your own API endpoint in any language/framework:
- Node.js/Express
- Python/Flask/FastAPI
- Go/Gin
- Ruby/Rails
- PHP/Laravel

### Option 2: Serverless Functions
- Vercel Functions (Next.js API Routes)
- AWS Lambda + API Gateway
- Cloudflare Workers
- Google Cloud Functions

### Option 3: Data Collection Services
- Webhook.site (testing)
- Zapier/Make.com (automation)
- InfluxDB (time-series database)
- Prometheus Pushgateway
- Elasticsearch

### Option 4: Use Quasar Lens (This Repo)
The included Next.js dashboard provides a ready-to-deploy solution with PostgreSQL storage.

---

## 🎨 Features (Reference Implementation)

### Current
- ✅ REST API endpoint for telemetry ingestion
- ✅ PostgreSQL storage via Prisma
- ✅ Server registration and hardware tracking
- ✅ Time-series telemetry storage
- ✅ Basic dashboard UI with server list

### Planned
- 📊 Enhanced real-time dashboard
- 📈 Historical metrics visualization with charts
- 🚨 Alert system (server down detection, threshold alerts)
- 📱 Mobile-responsive design improvements
- 🔐 Multi-user authentication & authorization

---

## 🚢 Deployment (Vercel)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - DATABASE_URL (PostgreSQL connection string)
# - (Optional) AUTH_TOKEN for API authentication
```

---

## 🛠️ Development (Quasar Lens Specific)

If you're using the Quasar Lens reference implementation:

### Environment Variables

```env
# Required
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Optional
AUTH_TOKEN="your-secret-token"  # For API authentication
NODE_ENV="development"           # or "production"
```

### Database Migrations (Prisma)

```bash
# Create new migration
pnpm prisma migrate dev --name migration_name

# Apply migrations in production
pnpm prisma migrate deploy

# Reset database (dev only)
pnpm prisma migrate reset

# Open Prisma Studio (Database GUI)
pnpm prisma studio
```

---

## 🔗 Related

- [Quasar Orbit](../quasar_orbit/) - Go monitoring agent
- [Main README](../README.md) - Project overview

---

## 📄 License

Part of the Quasar project. See main repository for license details.
