#!/usr/bin/env bash
# Poll ElevenLabs every 60s. Stay silent while billing is still blocked.
# Emit exactly one line — and exit — when the TTS endpoint accepts a request.
#
# Output contract (each line is a chat notification):
#   BILLING_OK ...    → ready to generate. Run the pipeline.
#   AUTH_FAIL ...     → key rotated or revoked. Need a new one in .env.local.
#   HEARTBEAT ...     → still polling, ~once per hour.
#
# Free path: GET /v1/user (no character spend). TTS probe only fires once
# /user reports a non-past_due status, to confirm the endpoint actually works.

set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
set -a; . "$ROOT/.env.local"; set +a

PROBE_BODY=/tmp/tts-probe.bin
HEARTBEAT_EVERY=60   # 60 polls × 60s = 1h
ticks=0

while true; do
  user_resp=$(curl -fsS --max-time 15 \
    -H "xi-api-key: ${ELEVENLABS_API_KEY}" \
    https://api.elevenlabs.io/v1/user 2>/dev/null || echo '')

  if [[ -z "$user_resp" ]]; then
    : # transient network — silent, retry
  else
    status=$(echo "$user_resp" | jq -r '.subscription.status // "_err"' 2>/dev/null)

    if [[ "$status" == "_err" || "$status" == "null" ]]; then
      # /user returned but parse failed — likely auth changed.
      err_preview=$(echo "$user_resp" | head -c 240)
      echo "AUTH_FAIL parse-error: ${err_preview}"
      exit 1
    fi

    if [[ "$status" != "past_due" ]]; then
      # Subscription is no longer past_due. Confirm TTS works.
      code=$(curl -sS -o "$PROBE_BODY" -w "%{http_code}" --max-time 30 \
        -X POST "https://api.elevenlabs.io/v1/text-to-speech/nPczCjzI2devNBz1zQrb?output_format=mp3_44100_64" \
        -H "xi-api-key: ${ELEVENLABS_API_KEY}" \
        -H "Content-Type: application/json" \
        -d '{"text":".","model_id":"eleven_multilingual_v2"}' 2>/dev/null || echo "000")

      if [[ "$code" == "200" ]]; then
        echo "BILLING_OK status=${status} tts=200 — ready to generate"
        exit 0
      fi

      err=$(jq -r '.detail.status // .detail.message // "unknown"' "$PROBE_BODY" 2>/dev/null || echo "no-body")
      if [[ "$err" != "payment_issue" ]]; then
        echo "AUTH_FAIL status=${status} tts=${code} err=${err}"
        head -c 240 "$PROBE_BODY"
        exit 1
      fi
      # Else billing still settling on TTS path — keep polling silently.
    fi
  fi

  ticks=$((ticks + 1))
  if (( ticks % HEARTBEAT_EVERY == 0 )); then
    echo "HEARTBEAT still polling (${ticks} min) status=${status:-network}"
  fi
  sleep 60
done
