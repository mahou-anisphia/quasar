#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
GITHUB_REPO="mahou-anisphia/quasar"
RELEASE_TAG="beta"  # Change this to specific version tag if needed

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Quasar Orbit Installation Script${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Error: Please run as root (use sudo)${NC}"
    exit 1
fi

# Detect architecture
ARCH=$(uname -m)
case $ARCH in
    x86_64)
        BINARY_NAME="quasar_orbit_linux_amd64"
        ASSET_NAME="quasar_orbit_linux_amd64.zip"
        ;;
    i386|i686)
        BINARY_NAME="quasar_orbit_linux_386"
        ASSET_NAME="quasar_orbit_linux_386.zip"
        ;;
    *)
        echo -e "${RED}Error: Unsupported architecture: $ARCH${NC}"
        echo "Supported: x86_64, i386, i686"
        exit 1
        ;;
esac

echo -e "${GREEN}Detected architecture: $ARCH${NC}"
echo -e "${GREEN}Binary: $BINARY_NAME${NC}"
echo ""

# Check if binary exists locally first
BINARY_PATH=""
if [ -f "./$BINARY_NAME" ]; then
    BINARY_PATH="./$BINARY_NAME"
    echo -e "${GREEN}Found local binary: $BINARY_PATH${NC}"
elif [ -f "./build/$BINARY_NAME" ]; then
    BINARY_PATH="./build/$BINARY_NAME"
    echo -e "${GREEN}Found local binary: $BINARY_PATH${NC}"
else
    echo -e "${YELLOW}Binary not found locally. Downloading from GitHub...${NC}"

    # Check for required tools
    if ! command -v curl &> /dev/null && ! command -v wget &> /dev/null; then
        echo -e "${RED}Error: Neither curl nor wget is installed${NC}"
        echo "Please install curl or wget first"
        exit 1
    fi

    if ! command -v unzip &> /dev/null; then
        echo -e "${RED}Error: unzip is not installed${NC}"
        echo "Please install unzip first (e.g., sudo apt install unzip)"
        exit 1
    fi

    # Download from GitHub releases
    DOWNLOAD_URL="https://github.com/$GITHUB_REPO/releases/download/$RELEASE_TAG/$ASSET_NAME"
    echo "Downloading from: $DOWNLOAD_URL"

    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"

    if command -v curl &> /dev/null; then
        curl -L -o "$ASSET_NAME" "$DOWNLOAD_URL" || {
            echo -e "${RED}Error: Failed to download binary${NC}"
            rm -rf "$TEMP_DIR"
            exit 1
        }
    else
        wget -O "$ASSET_NAME" "$DOWNLOAD_URL" || {
            echo -e "${RED}Error: Failed to download binary${NC}"
            rm -rf "$TEMP_DIR"
            exit 1
        }
    fi

    echo "Extracting..."
    unzip -q "$ASSET_NAME" || {
        echo -e "${RED}Error: Failed to extract binary${NC}"
        rm -rf "$TEMP_DIR"
        exit 1
    }

    BINARY_PATH="$TEMP_DIR/$BINARY_NAME"

    if [ ! -f "$BINARY_PATH" ]; then
        echo -e "${RED}Error: Binary not found in archive${NC}"
        rm -rf "$TEMP_DIR"
        exit 1
    fi

    echo -e "${GREEN}✓ Downloaded and extracted successfully${NC}"
fi

echo ""

# Function to read input with validation
read_required() {
    local prompt="$1"
    local var_name="$2"
    local value=""

    while [ -z "$value" ]; do
        read -p "$(echo -e ${YELLOW}$prompt${NC})" value
        if [ -z "$value" ]; then
            echo -e "${RED}This field is required!${NC}"
        fi
    done

    eval "$var_name='$value'"
}

read_optional() {
    local prompt="$1"
    local var_name="$2"
    local value=""

    read -p "$(echo -e ${YELLOW}$prompt${NC})" value
    eval "$var_name='$value'"
}

# Collect required parameters
echo -e "${CYAN}=== Required Parameters ===${NC}"
read_required "Server name: " SERVER_NAME
read_required "Endpoint URL (e.g., http://example.com/api/metrics): " ENDPOINT_URL
read_required "Request interval in seconds: " REQUEST_INTERVAL

# Validate interval is a number
if ! [[ "$REQUEST_INTERVAL" =~ ^[0-9]+$ ]]; then
    echo -e "${RED}Error: Request interval must be a positive number${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}=== Optional Parameters ===${NC}"
echo -e "${YELLOW}Press Enter to skip optional fields${NC}"
read_optional "HTTP Headers (format: 'Key1:Value1,Key2:Value2'): " HTTP_HEADERS
read_optional "Total CPU cores (auto-detected if not provided): " TOTAL_CPU
read_optional "Total RAM in bytes (auto-detected if not provided): " TOTAL_RAM
read_optional "Number of RAM sticks (default: 1): " RAM_STICKS
read_optional "Total disk space in bytes (auto-detected if not provided): " TOTAL_DISK
read_optional "Number of disk drives (default: 1): " DISK_DRIVES

echo ""
echo -e "${CYAN}=== Installation Configuration ===${NC}"
echo "Server Name: $SERVER_NAME"
echo "Endpoint URL: $ENDPOINT_URL"
echo "Request Interval: ${REQUEST_INTERVAL}s"
[ -n "$HTTP_HEADERS" ] && echo "HTTP Headers: $HTTP_HEADERS"
[ -n "$TOTAL_CPU" ] && echo "Total CPU: $TOTAL_CPU"
[ -n "$TOTAL_RAM" ] && echo "Total RAM: $TOTAL_RAM bytes"
[ -n "$RAM_STICKS" ] && echo "RAM Sticks: $RAM_STICKS"
[ -n "$TOTAL_DISK" ] && echo "Total Disk: $TOTAL_DISK bytes"
[ -n "$DISK_DRIVES" ] && echo "Disk Drives: $DISK_DRIVES"
echo ""

read -p "$(echo -e ${YELLOW}Continue with installation? [y/N]: ${NC})" CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo -e "${RED}Installation cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${CYAN}=== Installing Quasar Orbit ===${NC}"

# Copy binary to /usr/local/bin
echo "Copying binary to /usr/local/bin..."
cp "$BINARY_PATH" /usr/local/bin/quasar_orbit
chmod +x /usr/local/bin/quasar_orbit
echo -e "${GREEN}✓ Binary installed${NC}"

# Build command arguments
CMD_ARGS="--name '$SERVER_NAME' --output http --url1 '$ENDPOINT_URL'"
[ -n "$HTTP_HEADERS" ] && CMD_ARGS="$CMD_ARGS --header1 '$HTTP_HEADERS'"
[ -n "$TOTAL_CPU" ] && CMD_ARGS="$CMD_ARGS --cpu $TOTAL_CPU"
[ -n "$TOTAL_RAM" ] && CMD_ARGS="$CMD_ARGS --ram $TOTAL_RAM"
[ -n "$RAM_STICKS" ] && CMD_ARGS="$CMD_ARGS --ramsticks $RAM_STICKS"
[ -n "$TOTAL_DISK" ] && CMD_ARGS="$CMD_ARGS --disk $TOTAL_DISK"
[ -n "$DISK_DRIVES" ] && CMD_ARGS="$CMD_ARGS --drives $DISK_DRIVES"

# Create systemd service file
echo "Creating systemd service..."
echo "Command: /usr/local/bin/quasar_orbit ${CMD_ARGS}"
echo ""

cat > /etc/systemd/system/quasar-orbit.service <<EOF
[Unit]
Description=Quasar Orbit - Server Monitoring Agent
After=network.target

[Service]
Type=simple
ExecStart=/bin/bash -c 'while true; do /usr/local/bin/quasar_orbit ${CMD_ARGS}; sleep ${REQUEST_INTERVAL}; done'
Restart=always
RestartSec=10
User=root

[Install]
WantedBy=multi-user.target
EOF

echo -e "${GREEN}✓ Service file created${NC}"

# Reload systemd and enable service
echo "Enabling service..."
systemctl daemon-reload
systemctl enable quasar-orbit.service
echo -e "${GREEN}✓ Service enabled${NC}"

# Start service
echo "Starting service..."
systemctl start quasar-orbit.service
echo -e "${GREEN}✓ Service started${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Installation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Service status:"
systemctl status quasar-orbit.service --no-pager
echo ""
echo "Useful commands:"
echo "  View logs:    sudo journalctl -u quasar-orbit.service -f"
echo "  Stop service: sudo systemctl stop quasar-orbit.service"
echo "  Restart:      sudo systemctl restart quasar-orbit.service"
echo "  Disable:      sudo systemctl disable quasar-orbit.service"
echo ""

# Cleanup temp directory if it was created
if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi
