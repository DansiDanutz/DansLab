#!/usr/bin/env bash
# ============================================================================
# OpenClaw Logger — Install Script (Linux & macOS)
# ============================================================================
# Usage:
#   curl -sSL <url>/install.sh | bash -s -- \
#     --source dexter \
#     --url https://your.supabase.co \
#     --key eyJhbGc...
#
# Or locally:
#   chmod +x install.sh
#   ./install.sh --source dexter --url <url> --key <key>
# ============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

INSTALL_DIR="/opt/openclaw-logger"
SERVICE_NAME="openclaw-collector"
SOURCE_NAME=""
SUPABASE_URL=""
SUPABASE_KEY=""
SOURCE_TYPE=""
WATCH_PROCESSES=""
WATCH_PATHS=""
METRICS_INTERVAL="30000"
HEARTBEAT_INTERVAL="60000"

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --source) SOURCE_NAME="$2"; shift 2 ;;
    --url) SUPABASE_URL="$2"; shift 2 ;;
    --key) SUPABASE_KEY="$2"; shift 2 ;;
    --type) SOURCE_TYPE="$2"; shift 2 ;;
    --watch-processes) WATCH_PROCESSES="$2"; shift 2 ;;
    --watch-paths) WATCH_PATHS="$2"; shift 2 ;;
    --metrics-interval) METRICS_INTERVAL="$2"; shift 2 ;;
    *) echo -e "${RED}Unknown argument: $1${NC}"; exit 1 ;;
  esac
done

if [ -z "$SOURCE_NAME" ] || [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
  echo -e "${RED}❌ Required: --source, --url, --key${NC}"
  echo "Usage: ./install.sh --source <name> --url <supabase-url> --key <supabase-key>"
  exit 1
fi

echo -e "${GREEN}🐾 Installing OpenClaw Collector for: $SOURCE_NAME${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
  echo -e "${YELLOW}⚠️  Node.js not found. Installing...${NC}"
  if [ "$(uname)" = "Darwin" ]; then
    if command -v brew &> /dev/null; then
      brew install node
    else
      echo -e "${RED}Please install Node.js: https://nodejs.org${NC}"
      exit 1
    fi
  else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
  fi
fi

NODE_VERSION=$(node -v)
echo -e "  Node.js: ${NODE_VERSION}"

# Create install directory
sudo mkdir -p "$INSTALL_DIR"
sudo chown "$(whoami)" "$INSTALL_DIR"

# Copy package files
echo -e "  Copying files to $INSTALL_DIR..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ -d "$SCRIPT_DIR/dist" ]; then
  cp -r "$SCRIPT_DIR/dist" "$INSTALL_DIR/"
  cp "$SCRIPT_DIR/package.json" "$INSTALL_DIR/"
else
  # If running from source, copy src and build
  cp -r "$SCRIPT_DIR/src" "$INSTALL_DIR/"
  cp "$SCRIPT_DIR/package.json" "$INSTALL_DIR/"
  cp "$SCRIPT_DIR/tsconfig.json" "$INSTALL_DIR/"
fi

cd "$INSTALL_DIR"
npm install --production 2>/dev/null || npm install

# Build if needed
if [ -d "$INSTALL_DIR/src" ] && [ ! -d "$INSTALL_DIR/dist" ]; then
  npm run build
fi

# Create environment file
cat > "$INSTALL_DIR/.env" <<EOF
OPENCLAW_SOURCE=$SOURCE_NAME
OPENCLAW_SOURCE_TYPE=${SOURCE_TYPE:-auto}
OPENCLAW_SUPABASE_URL=$SUPABASE_URL
OPENCLAW_SUPABASE_KEY=$SUPABASE_KEY
OPENCLAW_METRICS_INTERVAL=$METRICS_INTERVAL
OPENCLAW_HEARTBEAT_INTERVAL=$HEARTBEAT_INTERVAL
OPENCLAW_WATCH_PROCESSES=$WATCH_PROCESSES
OPENCLAW_WATCH_PATHS=$WATCH_PATHS
OPENCLAW_SYSTEM_LOGS=true
EOF

chmod 600 "$INSTALL_DIR/.env"

# ============================================================================
# Create service
# ============================================================================
OS_TYPE="$(uname)"

if [ "$OS_TYPE" = "Darwin" ]; then
  # macOS — launchd
  PLIST_PATH="$HOME/Library/LaunchAgents/com.openclaw.collector.plist"

  cat > "$PLIST_PATH" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.openclaw.collector</string>
    <key>ProgramArguments</key>
    <array>
        <string>$(which node)</string>
        <string>${INSTALL_DIR}/dist/collector-daemon.js</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>OPENCLAW_SOURCE</key>
        <string>${SOURCE_NAME}</string>
        <key>OPENCLAW_SUPABASE_URL</key>
        <string>${SUPABASE_URL}</string>
        <key>OPENCLAW_SUPABASE_KEY</key>
        <string>${SUPABASE_KEY}</string>
        <key>OPENCLAW_METRICS_INTERVAL</key>
        <string>${METRICS_INTERVAL}</string>
        <key>OPENCLAW_HEARTBEAT_INTERVAL</key>
        <string>${HEARTBEAT_INTERVAL}</string>
        <key>OPENCLAW_WATCH_PROCESSES</key>
        <string>${WATCH_PROCESSES}</string>
        <key>OPENCLAW_WATCH_PATHS</key>
        <string>${WATCH_PATHS}</string>
        <key>OPENCLAW_SYSTEM_LOGS</key>
        <string>true</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/openclaw-collector.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/openclaw-collector.err</string>
    <key>WorkingDirectory</key>
    <string>${INSTALL_DIR}</string>
</dict>
</plist>
PLIST

  # Load/reload service
  launchctl unload "$PLIST_PATH" 2>/dev/null || true
  launchctl load "$PLIST_PATH"

  echo -e "${GREEN}✅ launchd service installed and started${NC}"
  echo -e "  Plist: $PLIST_PATH"
  echo -e "  Logs:  /tmp/openclaw-collector.log"
  echo -e ""
  echo -e "  Commands:"
  echo -e "    launchctl stop com.openclaw.collector     # stop"
  echo -e "    launchctl start com.openclaw.collector    # start"
  echo -e "    launchctl unload $PLIST_PATH              # disable"

else
  # Linux — systemd
  SYSTEMD_PATH="/etc/systemd/system/${SERVICE_NAME}.service"

  sudo tee "$SYSTEMD_PATH" > /dev/null <<UNIT
[Unit]
Description=OpenClaw Log Collector (${SOURCE_NAME})
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=${INSTALL_DIR}
EnvironmentFile=${INSTALL_DIR}/.env
ExecStart=$(which node) ${INSTALL_DIR}/dist/collector-daemon.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=openclaw-collector

[Install]
WantedBy=multi-user.target
UNIT

  sudo systemctl daemon-reload
  sudo systemctl enable "$SERVICE_NAME"
  sudo systemctl restart "$SERVICE_NAME"

  echo -e "${GREEN}✅ systemd service installed and started${NC}"
  echo -e "  Unit: $SYSTEMD_PATH"
  echo -e "  Logs: journalctl -u $SERVICE_NAME -f"
  echo -e ""
  echo -e "  Commands:"
  echo -e "    sudo systemctl stop $SERVICE_NAME"
  echo -e "    sudo systemctl start $SERVICE_NAME"
  echo -e "    sudo systemctl status $SERVICE_NAME"
  echo -e "    journalctl -u $SERVICE_NAME -f"
fi

# ============================================================================
# Install CLI globally
# ============================================================================
echo ""
echo -e "  Installing CLI tools globally..."
cd "$INSTALL_DIR"
sudo npm link 2>/dev/null || npm link

echo -e ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  🐾 OpenClaw Collector installed successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e ""
echo -e "  Source:  $SOURCE_NAME"
echo -e "  Install: $INSTALL_DIR"
echo -e ""
echo -e "  CLI commands available:"
echo -e "    openclaw-log tail              # Live tail logs"
echo -e "    openclaw-log sources           # List sources"
echo -e "    openclaw-log stats             # Statistics"
echo -e "    openclaw-log search <query>    # Search logs"
echo -e "    openclaw-log metrics           # System metrics"
echo -e ""
