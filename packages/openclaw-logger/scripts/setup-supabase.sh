#!/usr/bin/env bash
# ============================================================================
# OpenClaw Logger — Run Supabase Migration
# ============================================================================
# Runs the SQL migration to create all logging tables in your Supabase project.
#
# Usage:
#   ./setup-supabase.sh
#
# Prerequisites:
#   - OPENCLAW_SUPABASE_URL and OPENCLAW_SUPABASE_KEY set in environment
#   - Or pass as arguments: ./setup-supabase.sh <url> <key>
# ============================================================================

set -euo pipefail

SUPABASE_URL="${1:-${OPENCLAW_SUPABASE_URL:-${NEXT_PUBLIC_SUPABASE_URL:-}}}"
SUPABASE_KEY="${2:-${OPENCLAW_SUPABASE_KEY:-${SUPABASE_SERVICE_ROLE_KEY:-}}}"

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
  echo "❌ Missing Supabase credentials."
  echo "Usage: ./setup-supabase.sh <supabase-url> <service-role-key>"
  echo "Or set OPENCLAW_SUPABASE_URL and OPENCLAW_SUPABASE_KEY"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="$(dirname "$(dirname "$SCRIPT_DIR")")/supabase/migrations/001_create_logging_system.sql"

if [ ! -f "$SQL_FILE" ]; then
  echo "❌ Migration file not found: $SQL_FILE"
  exit 1
fi

echo "🐾 Running OpenClaw logging migration..."
echo "   URL: $SUPABASE_URL"
echo "   SQL: $SQL_FILE"
echo ""

# Extract the database connection string from Supabase URL
# Format: https://PROJECT_ID.supabase.co -> postgresql://postgres:KEY@db.PROJECT_ID.supabase.co:5432/postgres
PROJECT_ID=$(echo "$SUPABASE_URL" | sed -n 's|https://\([^.]*\)\.supabase\.co.*|\1|p')

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Could not parse project ID from URL"
  exit 1
fi

# Use Supabase REST API to execute SQL
SQL_CONTENT=$(cat "$SQL_FILE")

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$SQL_CONTENT" | jq -Rs .)}" \
  2>/dev/null || echo "000")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "204" ]; then
  echo "✅ Migration completed successfully!"
else
  echo "⚠️  REST API exec_sql not available (common)."
  echo ""
  echo "📋 Please run the migration manually:"
  echo "   1. Go to: ${SUPABASE_URL//.supabase.co/.supabase.com}/project/${PROJECT_ID}/sql"
  echo "   2. Paste the contents of: $SQL_FILE"
  echo "   3. Click 'Run'"
  echo ""
  echo "   Or use psql:"
  echo "   psql postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres < $SQL_FILE"
fi
