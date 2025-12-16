#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Quasar Orbit Uninstallation Script${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Error: Please run as root (use sudo)${NC}"
    exit 1
fi

# Check if service exists
if [ ! -f "/etc/systemd/system/quasar-orbit.service" ]; then
    echo -e "${YELLOW}Warning: quasar-orbit.service not found${NC}"
    echo "Service may not be installed"
else
    # Stop the service
    echo "Stopping quasar-orbit service..."
    if systemctl is-active --quiet quasar-orbit.service; then
        systemctl stop quasar-orbit.service
        echo -e "${GREEN}✓ Service stopped${NC}"
    else
        echo -e "${YELLOW}Service was not running${NC}"
    fi

    # Disable the service
    echo "Disabling quasar-orbit service..."
    if systemctl is-enabled --quiet quasar-orbit.service; then
        systemctl disable quasar-orbit.service
        echo -e "${GREEN}✓ Service disabled${NC}"
    else
        echo -e "${YELLOW}Service was not enabled${NC}"
    fi

    # Remove service file
    echo "Removing service file..."
    rm -f /etc/systemd/system/quasar-orbit.service
    echo -e "${GREEN}✓ Service file removed${NC}"

    # Reload systemd
    echo "Reloading systemd daemon..."
    systemctl daemon-reload
    systemctl reset-failed
    echo -e "${GREEN}✓ Systemd reloaded${NC}"
fi

# Remove binary
if [ -f "/usr/local/bin/quasar_orbit" ]; then
    echo "Removing binary..."
    rm -f /usr/local/bin/quasar_orbit
    echo -e "${GREEN}✓ Binary removed${NC}"
else
    echo -e "${YELLOW}Binary not found at /usr/local/bin/quasar_orbit${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Uninstallation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Quasar Orbit has been completely removed from your system."
echo ""
