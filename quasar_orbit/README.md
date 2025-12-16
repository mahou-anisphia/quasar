# Quasar Orbit 🛰️

**Quasar Orbit** is a lightweight Go monitoring agent that collects system telemetry and sends it to Quasar Lens (or any HTTP endpoint). It's designed to run on Linux servers with minimal resource footprint.

---

## 🎯 Features

- **Cross-Platform Metrics Collection**: Uses [gopsutil](https://github.com/shirou/gopsutil) for OS-agnostic system monitoring
- **Flexible Output**: Print to console or POST to HTTP endpoint
- **Hardware Auto-Detection**: Automatically detects CPU, RAM, and disk specs
- **Fallback Support**: Manual hardware specs as CLI flags if auto-detection fails
- **Multi-Disk Aware**: Aggregates metrics across all mounted disk partitions
- **Minimal Dependencies**: Single binary with no external runtime dependencies

---

## 📊 Collected Metrics

### Tier 1 (Critical Liveness)
- **Disk Usage**: Percentage of total disk space used (across all drives)
- **Uptime**: Seconds since system boot (detect unexpected reboots)

### Tier 2 (Core System Health)
- **CPU Usage**: Real-time CPU utilization percentage (1-second average)
- **RAM Usage**: Memory utilization percentage
- **Swap Usage**: Swap space used in bytes

### Static Hardware Info
- Total CPU cores
- Total RAM (bytes)
- Total disk space (bytes)
- Number of physical RAM sticks
- Number of disk drives

---

## 🚀 Quick Start

### Automated Installation (Linux)

The easiest way to install Quasar Orbit is using the automated installer:

```bash
# Download the installer
curl -O https://raw.githubusercontent.com/mahou-anisphia/quasar/main/quasar_orbit/install.sh

# Make it executable
chmod +x install.sh

# Run the installer (will auto-download binary from GitHub)
sudo ./install.sh
```

The installer will:
- Auto-detect your system architecture (x86_64 or i386)
- Download the appropriate binary from GitHub releases
- Prompt for configuration (server name, endpoint, interval, etc.)
- Create and start a systemd service
- Configure automatic startup on boot

### Manual Installation

#### Option 1: Download Pre-built Binary

Download the appropriate binary for your system from [GitHub Releases](https://github.com/mahou-anisphia/quasar/releases):

- **Linux x86_64**: `quasar_orbit_linux_amd64.zip`
- **Linux x86 (32-bit)**: `quasar_orbit_linux_386.zip`
- **Windows x86_64**: `quasar_orbit_windows_amd64.zip`
- **Windows x86 (32-bit)**: `quasar_orbit_windows_386.zip`

```bash
# Extract and make executable
unzip quasar_orbit_linux_amd64.zip
chmod +x quasar_orbit_linux_amd64

# Test it
./quasar_orbit_linux_amd64 --name "MyServer"
```

#### Option 2: Build from Source

```bash
cd quasar_orbit

# Build for current platform
go build -o quasar_orbit

# Or use the build script (Windows)
./build.ps1

# Binaries will be in the build/ directory
```

### Uninstallation

To remove Quasar Orbit:

```bash
# Download the uninstaller
curl -O https://raw.githubusercontent.com/mahou-anisphia/quasar/main/quasar_orbit/uninstall.sh

# Make it executable
chmod +x uninstall.sh

# Run the uninstaller
sudo ./uninstall.sh
```

---

## 📖 Usage

### Basic Usage (Print Mode)

```bash
# Auto-detect hardware and print metrics
./quasar-orbit --name "MyServer"
```

**Output:**
```
=== Quasar Orbit - Server Monitoring Agent ===

--- COLLECTING TELEMETRY ---

--- STATIC HARDWARE CONFIGURATION ---
Server Name: MyServer
Total CPU Cores: 8
Total RAM: 16 GB (17179869184 bytes)
Physical RAM Sticks: 1
Total Disk Space: 500 GB (536870912000 bytes)
Total Disk Drives: 1

--- TIER 1 METRICS ---
Disk Usage: 45.50%
Uptime: 86400 seconds (24.0 hours)

--- TIER 2 METRICS ---
CPU Usage: 12.30%
RAM Usage: 65.20%
Swap Used: 128 MB (134217728 bytes)

✅ Telemetry collected successfully!
```

### HTTP Mode (Send to Server)

```bash
# Send telemetry to Quasar Lens
./quasar-orbit \
  --name "ProductionServer" \
  --output http \
  --url "https://your-app.vercel.app/api/telemetry"
```

**With Authentication:**
```bash
./quasar-orbit \
  --name "ProductionServer" \
  --output http \
  --url "https://your-app.vercel.app/api/telemetry" \
  --header "Authorization:Bearer YOUR_SECRET_TOKEN"
```

**Multiple Headers:**
```bash
./quasar-orbit \
  --name "ProductionServer" \
  --output http \
  --url "https://your-app.vercel.app/api/telemetry" \
  --header "Authorization:Bearer TOKEN,X-Server-Region:US-East"
```

### Manual Hardware Specs (Fallback Mode)

Use when auto-detection fails or you want to override values:

```bash
./quasar-orbit \
  --name "MyServer" \
  --cpu 8 \
  --ram 17179869184 \
  --ramsticks 2 \
  --disk 536870912000 \
  --drives 2 \
  --output http \
  --url "https://your-app.vercel.app/api/telemetry"
```

**Note:** Hardware flags act as **fallbacks**. If auto-detection succeeds, it will use detected values instead.

---

## 🔧 CLI Flags

| Flag | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `--name` | string | ✅ Yes | - | Server name (identifier) |
| `--output` | string | ❌ No | `print` | Output type: `print` or `http` |
| `--url` | string | ⚠️ Required if `--output=http` | - | HTTP endpoint URL |
| `--header` | string | ❌ No | - | HTTP headers (`Key1:Value1,Key2:Value2`) |
| `--cpu` | int | ❌ No | `1` | Total CPU cores (fallback) |
| `--ram` | int64 | ❌ No | Auto-detect | Total RAM in bytes (fallback) |
| `--ramsticks` | int | ❌ No | `1` | Number of physical RAM sticks |
| `--disk` | int64 | ❌ No | Auto-detect | Total disk space in bytes (fallback) |
| `--drives` | int | ❌ No | `1` | Number of disk drives |

---

## 📤 JSON Payload Format

When using `--output http`, the agent sends this JSON structure:

```json
{
  "server": {
    "serverName": "MyServer",
    "totalCpu": 8,
    "totalRam": 17179869184,
    "totalPhysicalRamBar": 2,
    "totalDiskSpace": 536870912000,
    "totalDiskDrive": 2
  },
  "telemetry": {
    "diskUsagePercentage": 45.5,
    "uptime": 86400,
    "cpuUsagePercentage": 12.3,
    "ramUsagePercentage": 65.2,
    "swapUsedBytes": 134217728
  }
}
```

---

## 🔄 Running as a Service (Linux)

### Automated Setup

The easiest way is to use the [installation script](#automated-installation-linux) which automatically:
- Creates a systemd service
- Configures the reporting interval
- Enables auto-start on boot

### Manual Systemd Service Setup

If you installed manually, create `/etc/systemd/system/quasar-orbit.service`:

```ini
[Unit]
Description=Quasar Orbit - Server Monitoring Agent
After=network.target

[Service]
Type=simple
ExecStart=/bin/bash -c 'while true; do /usr/local/bin/quasar_orbit --name "MyServer" --output http --url1 "https://your-app.vercel.app/api/telemetry" --header1 "Authorization:Bearer TOKEN"; sleep 60; done'
Restart=always
RestartSec=10
User=root

[Install]
WantedBy=multi-user.target
```

**Enable and start:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable quasar-orbit.service
sudo systemctl start quasar-orbit.service

# Check status
sudo systemctl status quasar-orbit.service

# View logs
sudo journalctl -u quasar-orbit.service -f
```

### Service Management

```bash
# Stop service
sudo systemctl stop quasar-orbit.service

# Restart service
sudo systemctl restart quasar-orbit.service

# Disable auto-start
sudo systemctl disable quasar-orbit.service

# View live logs
sudo journalctl -u quasar-orbit.service -f
```

---

## 🏗️ Project Structure

```
quasar_orbit/
├── main.go          # CLI parsing, output handling, HTTP requests
├── collector.go     # Metrics collection using gopsutil
├── go.mod           # Go module dependencies
└── go.sum           # Dependency checksums
```

---

## 🛠️ Development

### Run Locally

```bash
# Install dependencies
go mod download

# Run with print output
go run . --name "DevServer"

# Run with HTTP output (test endpoint)
go run . --name "DevServer" --output http --url "https://webhook.site/YOUR-ID"
```

### Build

```bash
# Build for current OS
go build -o quasar-orbit

# Build for Linux (production)
GOOS=linux GOARCH=amd64 go build -o quasar-orbit-linux

# Build with optimizations (smaller binary)
go build -ldflags="-s -w" -o quasar-orbit
```

---

## 🐛 Troubleshooting

### "Failed to detect RAM and no --ram flag provided"
**Cause:** gopsutil failed to read memory info.
**Fix:** Provide `--ram` flag with total RAM in bytes:
```bash
./quasar-orbit --name "Server" --ram 17179869184
```

### "Failed to detect disk space and no --disk flag provided"
**Cause:** No accessible disk partitions found.
**Fix:** Provide `--disk` flag with total disk space in bytes:
```bash
./quasar-orbit --name "Server" --disk 536870912000
```

### CPU shows 0.00% on Windows
**Note:** This is expected in development. The agent uses CPU percentage (not load average) which works correctly on both Windows and Linux. If you see 0% consistently on Linux, there may be an issue with CPU measurement timing.

### HTTP request fails with "connection refused"
**Cause:** Server not reachable or URL incorrect.
**Fix:**
1. Verify URL is correct
2. Test with `curl -X POST <url>`
3. Check network/firewall settings

---

## 📋 System Requirements

- **OS:** Linux (Ubuntu 20.04+, Debian 10+, RHEL 8+, etc.)
- **Architecture:** amd64/arm64
- **Permissions:** Root/sudo recommended for full system metrics access
- **Network:** Outbound HTTPS access (if using HTTP mode)

---

## 🔗 Related

- [Quasar Lens](../quasar_lens/) - Dashboard and API receiver
- [Main README](../README.md) - Project overview
- [gopsutil Documentation](https://pkg.go.dev/github.com/shirou/gopsutil/v4)

---

## 📄 License

Part of the Quasar project. See main repository for license details.
