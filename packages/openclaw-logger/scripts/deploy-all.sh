#!/usr/bin/env bash
# ============================================================================
# OpenClaw Logger — Deploy to ALL machines
# ============================================================================
# Builds the package, then deploys to each droplet and local machine.
# Run from: /Users/dansidanutz/Desktop/OpenClaw/packages/openclaw-logger
#
# Prerequisites:
#   - SSH access configured in ~/.ssh/config
#   - Supabase credentials set below
# ============================================================================

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ============================================================================
# CONFIGURE THESE:
# ============================================================================
SUPABASE_URL="${OPENCLAW_SUPABASE_URL:-https://okgwzwdtuhhpoyxyprzg.supabase.co}"
SUPABASE_KEY="${OPENCLAW_SUPABASE_KEY:-}"

if [[ -z "$SUPABASE_KEY" || "$SUPABASE_KEY" == "YOUR_SERVICE_ROLE_KEY_HERE" ]]; then
  echo -e "${RED}❌ SUPABASE_KEY is not set. Export OPENCLAW_SUPABASE_KEY before running.${NC}"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PKG_DIR="$(dirname "$SCRIPT_DIR")"

# ============================================================================
# Build
# ============================================================================
echo -e "${GREEN}🔨 Building OpenClaw Logger...${NC}"
cd "$PKG_DIR"
npm install
npm run build

# Create a tarball for deployment
TARBALL="/tmp/openclaw-logger.tar.gz"
tar -czf "$TARBALL" -C "$PKG_DIR" dist package.json scripts

echo -e "${GREEN}📦 Package built: $TARBALL${NC}"

# ============================================================================
# Deploy to droplets
# ============================================================================
declare -A DROPLETS=(
  ["dexter"]="dexter-droplet"
  ["memo"]="memo-droplet"
  ["sienna"]="sienna-droplet"
  ["nano"]="nano-droplet"
)

WATCH_PROCESSES_MAP=(
  ["dexter"]="openclaw,node"
  ["memo"]="openclaw,node"
  ["sienna"]="openclaw,node"
  ["nano"]="openclaw,node"
)

for SOURCE_NAME in "${!DROPLETS[@]}"; do
  SSH_HOST="${DROPLETS[$SOURCE_NAME]}"
  WATCH="${WATCH_PROCESSES_MAP[$SOURCE_NAME]:-openclaw,node}"

  echo -e "\n${YELLOW}📡 Deploying to $SOURCE_NAME ($SSH_HOST)...${NC}"

  # Upload tarball
  scp -o ConnectTimeout=10 "$TARBALL" "$SSH_HOST:/tmp/openclaw-logger.tar.gz" 2>/dev/null || {
    echo -e "${RED}  ⚠️  Failed to connect to $SOURCE_NAME — skipping${NC}"
    continue
  }

  # Install remotely
  ssh -o ConnectTimeout=10 "$SSH_HOST" bash -s -- "$SOURCE_NAME" "$SUPABASE_URL" "$SUPABASE_KEY" "$WATCH" <<'REMOTE_SCRIPT'
    SOURCE_NAME="$1"
    SUPABASE_URL="$2"
    SUPABASE_KEY="$3"
    WATCH_PROCESSES="$4"
    INSTALL_DIR="/opt/openclaw-logger"

    sudo mkdir -p "$INSTALL_DIR"
    sudo tar -xzf /tmp/openclaw-logger.tar.gz -C "$INSTALL_DIR"
    sudo chown -R "$(whoami)" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    npm install --production 2>/dev/null

    # Run install script
    chmod +x scripts/install.sh
    scripts/install.sh \
      --source "$SOURCE_NAME" \
      --url "$SUPABASE_URL" \
      --key "$SUPABASE_KEY" \
      --type droplet \
      --watch-processes "$WATCH_PROCESSES"

    rm /tmp/openclaw-logger.tar.gz
REMOTE_SCRIPT

  echo -e "${GREEN}  ✅ $SOURCE_NAME deployed${NC}"
done

# ============================================================================
# Deploy locally (Mac Studio / Mac Mini / this machine)
# ============================================================================
LOCAL_SOURCE="${OPENCLAW_SOURCE:-$(hostname | tr '[:upper:]' '[:lower:]' | tr ' ' '-')}"

echo -e "\n${YELLOW}🖥️  Installing locally as: $LOCAL_SOURCE${NC}"
cd "$PKG_DIR"
chmod +x scripts/install.sh
scripts/install.sh \
  --source "$LOCAL_SOURCE" \
  --url "$SUPABASE_URL" \
  --key "$SUPABASE_KEY" \
  --type desktop

# ============================================================================
# Summary
# ============================================================================
echo -e "\n${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  🐾 Deployment complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e ""
echo -e "  Deployed to:"
for SOURCE_NAME in "${!DROPLETS[@]}"; do
  echo -e "    ✅ $SOURCE_NAME (${DROPLETS[$SOURCE_NAME]})"
done
echo -e "    ✅ $LOCAL_SOURCE (local)"
echo -e ""
echo -e "  Check status:"
echo -e "    openclaw-log sources"
echo -e "    openclaw-log tail"
echo -e ""
