#!/usr/bin/env bash
# Build the DansLab AI Chronicles trailer-teaser MP4 from the rendered Kling clips
# and the V2 hero stills. Output: public/series/trailer/trailer-teaser.mp4.
#
# Inputs (must already exist in clips/):
#   01-cluj.mp4          5s  Kling motion on hero-01-cluj-cold-open
#   02-warroom.mp4       5s  Kling motion on hero-02-warroom-council
#   03-sienna.mp4        5s  Kling motion on hero-03-sienna-double-agent
#   04-money.mp4         5s  Kling motion on hero-04-money-frame
#
# Stills used for Ken Burns logo cuts:
#   public/series/trailer/logo-openclaw-lobster.png
#   public/series/trailer/logo-hermes-airplane.png
#
# All title cards are generated inline with ffmpeg drawtext.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CLIPS="$ROOT/scripts/trailer/clips"
OUT="$ROOT/public/series/trailer/trailer-teaser.mp4"
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

# Resolution / framerate locked at 1920x1080 / 30fps for clean YouTube export.
W=1920; H=1080; FPS=30
# Each Kling clip lands at variable size; we scale + pad to 1920x1080.
SCALE="scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${FPS}"

mkdir -p "$CLIPS"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# ─── Title cards (3s each, black with white DejaVu Bold text) ──────────
title_card() {
  local text="$1" out="$2" dur="${3:-3}"
  ffmpeg -y -hide_banner -loglevel error \
    -f lavfi -i "color=c=black:s=${W}x${H}:d=${dur}:r=${FPS}" \
    -vf "drawtext=fontfile=${FONT}:text='${text}':fontcolor=white:fontsize=84:x=(w-text_w)/2:y=(h-text_h)/2" \
    -c:v libx264 -pix_fmt yuv420p -movflags +faststart "$out"
}

# ─── Ken Burns on a still (slow zoom-in) ───────────────────────────────
# zoompan emits its own frame stream, so we cap output duration with -t after -vf.
kenburns() {
  local src="$1" out="$2" dur="${3:-3}"
  local frames=$((dur * FPS))
  ffmpeg -y -hide_banner -loglevel error \
    -loop 1 -i "$src" \
    -vf "scale=${W}*1.1:${H}*1.1:force_original_aspect_ratio=increase,zoompan=z='min(zoom+0.0008,1.08)':d=${frames}:s=${W}x${H}:fps=${FPS},setsar=1,trim=duration=${dur},setpts=PTS-STARTPTS" \
    -t "$dur" \
    -c:v libx264 -pix_fmt yuv420p -movflags +faststart "$out"
}

# ─── Normalize a Kling clip to 1920x1080 / 30fps ───────────────────────
normalize() {
  local src="$1" out="$2"
  ffmpeg -y -hide_banner -loglevel error \
    -i "$src" -vf "${SCALE}" -an \
    -c:v libx264 -pix_fmt yuv420p -movflags +faststart "$out"
}

echo "▶ Title cards..."
title_card "DANSLAB" "$WORK/00-logo.mp4" 3
title_card "AI CHRONICLES"      "$WORK/00b-logo2.mp4" 2
title_card "ALONE."             "$WORK/01b-alone.mp4" 2
title_card "HE HIRED ELEVEN AGENTS." "$WORK/02b-eleven.mp4" 2
title_card "ONE OF THEM IS LYING."   "$WORK/03b-lying.mp4" 2
title_card "WHO?"               "$WORK/05b-who.mp4" 2
title_card "WHO'S REALLY RUNNING IT?" "$WORK/end-question.mp4" 3
title_card "DANSLAB AI CHRONICLES · LATE 2026" "$WORK/end-card.mp4" 3

echo "▶ Ken Burns on logos..."
kenburns "$ROOT/public/series/trailer/logo-openclaw-lobster.png" "$WORK/lobster.mp4" 2
kenburns "$ROOT/public/series/trailer/logo-hermes-airplane.png"  "$WORK/airplane.mp4" 2

echo "▶ Normalize Kling clips..."
normalize "$CLIPS/01-cluj.mp4"     "$WORK/01-cluj.mp4"
normalize "$CLIPS/02-warroom.mp4"  "$WORK/02-warroom.mp4"
normalize "$CLIPS/03-sienna.mp4"   "$WORK/03-sienna.mp4"
normalize "$CLIPS/04-money.mp4"    "$WORK/04-money.mp4"

# ─── Build concat list (cut order matches beat-sheet.md) ───────────────
# Use filter_complex concat: all inputs are passed as separate -i flags and
# stitched in a single re-encode. Bullet-proof against stream-parameter drift
# from mixing color-source title cards, zoompan stills, and Kling clips.

INPUTS=(
  "$WORK/00-logo.mp4"          # 0:00 DANSLAB
  "$WORK/00b-logo2.mp4"        # 0:03 AI CHRONICLES
  "$WORK/01-cluj.mp4"          # 0:05 Cluj cold-open (5s)
  "$WORK/01b-alone.mp4"        # 0:10 ALONE.
  "$WORK/lobster.mp4"          # 0:12 OpenClaw lobster (2s)
  "$WORK/airplane.mp4"         # 0:14 Hermes airplane (2s)
  "$WORK/02b-eleven.mp4"       # 0:16 HE HIRED ELEVEN AGENTS.
  "$WORK/02-warroom.mp4"       # 0:18 War-room council (5s)
  "$WORK/03b-lying.mp4"        # 0:23 ONE OF THEM IS LYING.
  "$WORK/04-money.mp4"         # 0:25 $100,000 money frame (5s)
  "$WORK/03-sienna.mp4"        # 0:30 Sienna double-agent (5s)
  "$WORK/05b-who.mp4"          # 0:35 WHO?
  "$WORK/end-question.mp4"     # 0:37 WHO'S REALLY RUNNING IT?
  "$WORK/end-card.mp4"         # 0:40 DANSLAB AI CHRONICLES · LATE 2026
)

INPUT_ARGS=()
FILTER=""
N=${#INPUTS[@]}
for i in "${!INPUTS[@]}"; do
  INPUT_ARGS+=( -i "${INPUTS[$i]}" )
  FILTER+="[$i:v]${SCALE}[v$i];"
done
for i in "${!INPUTS[@]}"; do
  FILTER+="[v$i]"
done
FILTER+="concat=n=${N}:v=1:a=0[out]"

echo "▶ filter_complex concat (n=${N})..."
ffmpeg -y -hide_banner -loglevel error \
  "${INPUT_ARGS[@]}" \
  -filter_complex "$FILTER" \
  -map "[out]" \
  -c:v libx264 -pix_fmt yuv420p -movflags +faststart -preset slow -crf 20 \
  -an "$OUT"


echo "✅ Output: $OUT"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration -of default=noprint_wrappers=1 "$OUT"
ls -lh "$OUT"
