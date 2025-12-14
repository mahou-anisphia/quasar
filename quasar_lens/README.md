# Quasar Lens 🔭

**Quasar Lens** is the dashboard component of Quasar - a Next.js application deployed on Vercel that receives, stores, and visualizes telemetry data from Quasar Orbit agents.

---

## 🏗️ Architecture

```
quasar_lens/
├── app/                    # Next.js App Router
│   ├── api/
│   │   └── telemetry/      # POST endpoint for receiving metrics
│   ├── page.tsx            # Dashboard UI
│   └── layout.tsx
│
├── prisma/
│   └── schema.prisma       # Database schema (Server + Telemetry models)
│
├── generated/
│   └── prisma/             # Generated Prisma Client
│
└── package.json
```

---

## 📊 Database Schema

### Server Model
Stores static hardware configuration for each monitored server:

```prisma
model Server {
  serverId            String      @id @default(uuid())
  name                String
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  // Static hardware specs
  totalCPU            Int
  totalRam            BigInt
  totalPhysicalRamBar Int
  totalDiskSpace      BigInt
  totalDiskDrive      Int

  telemetry           Telemetry[]
}
```

### Telemetry Model
Stores time-series metrics data:

```prisma
model Telemetry {
  telemetryId         Int      @id @default(autoincrement())
  serverId            String
  server              Server   @relation(...)
  createdAt           DateTime @default(now())

  // Tier 1 Metrics
  diskUsagePercentage Float
  attemptNo           Int
  uptime              BigInt

  // Tier 2 Metrics
  cpuUsagePercentage  Float
  ramUsagePercentage  Float
  swapUsedBytes       BigInt
}
```

---

## 🚀 Setup

### Prerequisites
- Node.js 18+ & pnpm
- PostgreSQL database (Vercel Postgres recommended)

### Installation

```bash
cd quasar_lens

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your DATABASE_URL

# Initialize database
pnpm prisma migrate dev

# Generate Prisma Client
pnpm prisma generate

# Run development server
pnpm dev
```

Visit `http://localhost:3000`

---

## 🔌 API Endpoint

### POST /api/telemetry

Receives telemetry data from Quasar Orbit agents.

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN (optional)
```

**Request Body:**
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

**Response (Success):**
```json
{
  "success": true,
  "serverId": "uuid-here",
  "telemetryId": 123
}
```

---

## 🎨 Features

### Current (MVP)
- ✅ REST API endpoint for telemetry ingestion
- ✅ PostgreSQL storage via Prisma
- ✅ Server registration and hardware tracking
- ✅ Time-series telemetry storage

### Planned (Phase 2)
- 📊 Real-time dashboard UI
- 📈 Historical metrics visualization
- 🚨 Alert system (server down detection)
- 📱 Mobile-responsive design
- 🔐 Authentication & multi-user support

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

## 🛠️ Development

### Database Migrations

```bash
# Create new migration
pnpm prisma migrate dev --name migration_name

# Apply migrations in production
pnpm prisma migrate deploy

# Reset database (dev only)
pnpm prisma migrate reset
```

### Prisma Studio (Database GUI)

```bash
pnpm prisma studio
```

---

## 📝 Environment Variables

```env
# Required
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Optional
AUTH_TOKEN="your-secret-token"  # For API authentication
NODE_ENV="development"           # or "production"
```

---

## 🔗 Related

- [Quasar Orbit](../quasar_orbit/) - Go monitoring agent
- [Main README](../README.md) - Project overview

---

## 📄 License

Part of the Quasar project. See main repository for license details.
