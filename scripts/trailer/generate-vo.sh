#!/usr/bin/env bash
# Generate Brian VO lines for the 43s teaser cut using the ElevenLabs API.
#
# Voice: Brian (public preset, voice_id nPczCjzI2devNBz1zQrb)
# Settings: stability 0.45 / similarity 0.75 / style 0.20 / speed 0.95×
# (matches content/series/trailer/script.md and the /trailer page spec)
#
# Reads ELEVENLABS_API_KEY from env or .env.local at the repo root.
# Emits MP3 per line into scripts/trailer/vo/.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/scripts/trailer/vo"
mkdir -p "$OUT"

# Pick up key from .env.local if not already in env.
if [[ -z "${ELEVENLABS_API_KEY:-}" && -f "$ROOT/.env.local" ]]; then
  set -a; . "$ROOT/.env.local"; set +a
fi
if [[ -z "${ELEVENLABS_API_KEY:-}" ]]; then
  echo "✗ ELEVENLABS_API_KEY not set. Add it to .env.local or export it." >&2
  exit 1
fi

VOICE_ID="nPczCjzI2devNBz1zQrb"   # Brian
MODEL="eleven_multilingual_v2"
STABILITY=0.45
SIMILARITY=0.75
STYLE=0.20
SPEAKER_BOOST=true
SPEED=0.95

# Lines for the 43s teaser cut. Offsets refer to seconds in trailer-teaser.mp4.
# Order matches scripts/trailer/build-trailer.sh.
declare -a LINES=(
  "01|0.5|whispered|What if I told you..."
  "02|5.5|normal|A man in Romania built a million-dollar AI company."
  "03|10.5|whispered|Alone."
  "04|16.2|normal|He hired eleven agents."
  "05|23.2|low|One of them is lying."
  "06|30.5|normal|Who's really running it?"
)

generate_line() {
  local id="$1" tone="$2" text="$3"
  local out_mp3="$OUT/line-${id}.mp3"
  echo "  ▶ line ${id} (${tone}): ${text}"

  # Tone-driven micro-tweaks (still inside the locked Brian envelope).
  local stability=$STABILITY style=$STYLE
  case "$tone" in
    whispered) stability=0.60; style=0.30 ;;
    low)       stability=0.55; style=0.25 ;;
    normal)    : ;;
  esac

  local body
  body=$(jq -n \
    --arg text "$text" \
    --arg model "$MODEL" \
    --argjson stability "$stability" \
    --argjson similarity_boost "$SIMILARITY" \
    --argjson style "$style" \
    --argjson use_speaker_boost "$SPEAKER_BOOST" \
    --argjson speed "$SPEED" \
    '{
      text: $text,
      model_id: $model,
      voice_settings: {
        stability: $stability,
        similarity_boost: $similarity_boost,
        style: $style,
        use_speaker_boost: $use_speaker_boost,
        speed: $speed
      }
    }')

  curl -fsSL \
    -X POST "https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_192" \
    -H "xi-api-key: ${ELEVENLABS_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "$body" \
    -o "$out_mp3"

  # Sanity: ffprobe must report a positive duration.
  local dur
  dur=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$out_mp3")
  printf "    ✓ %s (%.2fs)\n" "$out_mp3" "$dur"
}

echo "▶ Generating Brian VO (${#LINES[@]} lines)..."
for entry in "${LINES[@]}"; do
  IFS='|' read -r id offset tone text <<<"$entry"
  generate_line "$id" "$tone" "$text"
done

# Emit a manifest the mux step reads to position each clip on the timeline.
MANIFEST="$OUT/manifest.json"
{
  echo '{ "voice": "Brian", "voice_id": "'"$VOICE_ID"'", "lines": ['
  for i in "${!LINES[@]}"; do
    IFS='|' read -r id offset tone text <<<"${LINES[$i]}"
    sep=","; [[ $i -eq $((${#LINES[@]}-1)) ]] && sep=""
    printf '    {"id":"%s","offset":%s,"tone":"%s","text":%s,"file":"line-%s.mp3"}%s\n' \
      "$id" "$offset" "$tone" "$(jq -Rn --arg t "$text" '$t')" "$id" "$sep"
  done
  echo '] }'
} > "$MANIFEST"

echo "✅ Done. ${#LINES[@]} MP3s + manifest at $OUT/"
