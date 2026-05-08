#!/usr/bin/env bash
# Mux Brian VO + Mac-Studio fan-hum bed onto the silent trailer-teaser.mp4.
#
# Inputs:
#   public/series/trailer/trailer-teaser.mp4   (silent visual cut, 43s)
#   scripts/trailer/vo/manifest.json           (line offsets + filenames, from generate-vo.sh)
#   scripts/trailer/vo/line-*.mp3              (Brian VO clips)
#
# Output:
#   public/series/trailer/trailer-teaser.mp4   (in-place, now with audio)
#
# We synthesize a low fan-hum bed in ffmpeg (no external sample required)
# so the cut has the "Mac Studio room tone" pad called for in music.md.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
VID_IN="$ROOT/public/series/trailer/trailer-teaser.mp4"
VID_OUT="$ROOT/public/series/trailer/trailer-teaser.mp4"
TMP="$ROOT/public/series/trailer/.trailer-teaser.muxing.mp4"
VO_DIR="$ROOT/scripts/trailer/vo"
MANIFEST="$VO_DIR/manifest.json"

[[ -f "$VID_IN" ]]    || { echo "✗ missing $VID_IN — run build-trailer.sh first" >&2; exit 1; }
[[ -f "$MANIFEST" ]]  || { echo "✗ missing $MANIFEST — run generate-vo.sh first" >&2; exit 1; }

# Total duration of the visual cut.
DUR=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VID_IN")
echo "▶ Visual cut: ${DUR}s"

# Build ffmpeg input args + filter graph from the manifest.
#   [0:a] = synthesized fan-hum bed (continuous, ducked under VO)
#   [1:a]..[Na] = Brian lines, each delayed to its offset
#
# Each line gets `adelay=offsetMs|offsetMs` to place it on the timeline.

readarray -t OFFSETS < <(jq -r '.lines[].offset' "$MANIFEST")
readarray -t FILES   < <(jq -r '.lines[].file'   "$MANIFEST")

INPUTS=( -f lavfi -i "anoisesrc=color=brown:amplitude=0.04:duration=${DUR}" )
FILTER="[0:a]volume=0.35,lowpass=f=200,highpass=f=40,asetpts=PTS-STARTPTS[bed];"

VO_LABELS=()
for i in "${!FILES[@]}"; do
  off="${OFFSETS[$i]}"
  file="${FILES[$i]}"
  off_ms=$(awk -v o="$off" 'BEGIN{printf "%d", o*1000}')
  INPUTS+=( -i "$VO_DIR/$file" )
  src=$((i+1))
  FILTER+="[${src}:a]adelay=${off_ms}|${off_ms},volume=1.4[v${i}];"
  VO_LABELS+=( "[v${i}]" )
done

# Mix all VO lines together first, then sidechain-duck the fan-hum under them.
N_VO=${#VO_LABELS[@]}
FILTER+="${VO_LABELS[*]}amix=inputs=${N_VO}:normalize=0:duration=longest[vo];"
FILTER+="[bed][vo]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=400[bed_ducked];"
FILTER+="[bed_ducked][vo]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95,aresample=48000[mix]"

echo "▶ Muxing ${N_VO} Brian lines + brown-noise fan bed..."
ffmpeg -y -hide_banner -loglevel error \
  -i "$VID_IN" \
  "${INPUTS[@]}" \
  -filter_complex "$FILTER" \
  -map 0:v -map "[mix]" \
  -c:v copy \
  -c:a aac -b:a 192k -ar 48000 \
  -shortest -movflags +faststart \
  "$TMP"

mv "$TMP" "$VID_OUT"

echo "✅ Audio muxed."
ffprobe -v error -show_entries stream=index,codec_type,codec_name,channels,sample_rate -of default=noprint_wrappers=1 "$VID_OUT"
ls -lh "$VID_OUT"
