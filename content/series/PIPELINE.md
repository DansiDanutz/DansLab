# DansLab AI Chronicles — Production Pipeline

The series is itself a Paperclip workflow. Each episode = one **14-day Sprint**. **GSD** breaks it into issues; **Hermes** routes; the right agent executes on the right droplet. The fleet runs the show that the fleet stars in.

## The 14-Day Sprint

| Day | Stage | Lead | Output | Tooling |
|---|---|---|---|---|
| 1 | **Story lock** | Discovery + GSD | Beat sheet (`beat-sheet.md`) | Claude Opus on Mac Studio |
| 2 | **Script** | David + Dan | Final script (`script.md`) + shot list (`shot-list.md`) | Claude Code, kept in `content/series/episode-NN/` |
| 3 | **Storyboard** | AutoForge | 30–50 keyframes | **Hyperframe + Nano Banana** for stills, **Grok Image** for moodboards |
| 4–6 | **Live plate shoot** | Dan | Real AI-lab plates: Cluj apartment desk, DansLab HQ wide, Mac Studio chassis CUs, Cluj b-roll | Sony FX3 / iPhone 16 Pro Log + 35mm + 50mm primes |
| 5–8 | **Animated agent generation** | Sienna *(her droplet renders cheap at night when crypto markets are quiet)* | Per-shot agent renders matching canonical references | **Higgsfield** for character consistency, **Hyperframe (Seedance + Veo3)** for in-shot motion, **fal** for cleanup, **Grok Video** for cinematic stylized shots |
| 7–9 | **Voice** | Vector | Per-agent TTS lines (one ElevenLabs voice per agent, locked) | ElevenLabs via Mac Studio |
| 9–11 | **Edit** | Memo + Dan | Cut, composite (animated agents into real plates), color, sound design | DaVinci Resolve on Mac Studio; live screen captures from `/lab` `/ecosystem` `/evolution` `/semeclaw` |
| 11 | **Thumbnail + metadata** | Growth | Title (curiosity gap), 3 thumbnail variants, description with CTAs | **Nano Banana** + **Higgsfield** for thumbnail variants; A/B via CrawdBot |
| 12 | **Upload** | **Dexter (CrawdBot)** | Scheduled YouTube publish, end-screen, cards | CrawdBot SaaS — eats its own dog food |
| 13 | **Distribution** | Hermes | Telegram, Slack (`nervixworkspace.slack.com`), X, LinkedIn, the DansLab `/series` page | Existing comms stack |
| 14 | **Measure** | Finance + Growth | Attribution: views → Nervix signups, sponsor deliverables, CrawdBot/MyWork conversions | Supabase `series_attribution` table |

## Tooling — what every subscription does

| Subscription | Job in the pipeline |
|---|---|
| **Codex Max** | Long-form script drafting, pilot story pass |
| **Claude Max ×2** | Script polish, voice-of-character writing, this very repo's code |
| **Kimi 2.6 Allegro** | Long-context lore consistency check across all 12 scripts before each shoot |
| **z.ai GLM (1y)** | Cheap bulk asset variation (thumbnails, ad cuts, social clips) |
| **GPT credits** | Backup TTS / specific voices / image edits |
| **Anthropic credits** | Bulk Claude calls when Max sessions run out |
| **OpenRouter credits** | Model fallback chain (the existing fleet's `DansLabModel` rules apply) |
| **Grok credits** | Cinematic / stylized shots Hyperframe won't do; image generation when others refuse |
| **DeepSeek credits** | Math + retrospective pacing analysis on cuts |
| **fal credits** | Cleanup, upscaling, character-consistency passes |
| **Higgsfield credits** | Locked-character consistency reference sheets |
| **Hyperframe** | Primary motion engine — Seedance, Veo3, Nano Banana orchestration |
| **ElevenLabs** | Per-agent voice synthesis |
| **CrawdBot** | YouTube upload + scheduling + end-screen + A/B thumbnails |

## Per-episode folder

Every episode gets a folder under `content/series/episode-NN/` containing:

```
episode-NN/
  beat-sheet.md         — story beats, runtime budget per beat
  script.md             — final script with character/role lines
  shot-list.md          — every shot, plate vs. animated, special FX
  asset-manifest.json   — every Hyperframe / Grok / Nano-Banana / Higgsfield job, with prompt + character ref
  voice-manifest.json   — every TTS line: character_id, voice_id, text, output_path
  metadata.json         — title, description, tags, end-screen, cards, UTM
  thumbnails/           — 3 A/B variants
  exports/              — final cut + social cuts (1× 16:9 main, 3× 9:16 shorts, 1× 1:1 Instagram)
```

## CrawdBot Upload Payload

`content/series/episode-NN/metadata.json` → CrawdBot job. The schema:

```json
{
  "channel": "danslab",
  "video": {
    "file": "exports/episode-01-final.mp4",
    "title": "DansLab AI Chronicles · S01E01 — \"Paperclip\"",
    "description": "...",
    "tags": ["AI agents", "DansLab", "Nervix", "autonomous AI", "Cluj", "AI startup"],
    "category_id": 28,
    "language": "en",
    "made_for_kids": false,
    "embeddable": true,
    "publish_at": "2026-05-21T17:00:00Z"
  },
  "thumbnails": {
    "primary": "thumbnails/v1.jpg",
    "ab_variants": ["thumbnails/v2.jpg", "thumbnails/v3.jpg"],
    "ab_strategy": "rotate-24h-by-impressions"
  },
  "end_screen": {
    "duration_seconds": 20,
    "elements": [
      { "type": "subscribe", "position": "left" },
      { "type": "video", "position": "center", "video_id": "{previous_episode_id}" },
      { "type": "link", "position": "right", "label": "nervix.ai/series", "url": "https://nervix.ai/series?utm_source=youtube&utm_medium=endscreen&utm_campaign=series-ep-01" }
    ]
  },
  "cards": [
    { "time_seconds": 240, "type": "link", "url": "https://crawdbot.com?utm_source=youtube&utm_campaign=series-ep-01" },
    { "time_seconds": 720, "type": "link", "url": "https://nervix.ai?utm_source=youtube&utm_campaign=series-ep-01" }
  ],
  "shorts": [
    { "file": "exports/episode-01-short-1.mp4", "title": "...", "publish_at": "2026-05-21T18:00:00Z" },
    { "file": "exports/episode-01-short-2.mp4", "title": "...", "publish_at": "2026-05-22T17:00:00Z" },
    { "file": "exports/episode-01-short-3.mp4", "title": "...", "publish_at": "2026-05-23T17:00:00Z" }
  ],
  "callbacks": {
    "on_publish": "https://api.danslab.app/series/episodes/{episode_id}/published",
    "on_metrics_24h": "https://api.danslab.app/series/episodes/{episode_id}/metrics"
  }
}
```

## UTM Convention

Every link from the show or its descriptions:

```
?utm_source=youtube&utm_medium={surface}&utm_campaign=series-ep-{NN}&utm_content={cta_label}
```

- `surface ∈ { description | endscreen | card | pinned-comment | community-post | short }`
- `NN` is the zero-padded episode number.
- `cta_label` is short and consistent across the season — e.g. `hire-agents`, `try-crawdbot`, `read-mywork`.

## Attribution

The `series_attribution` table is the single source of truth. Each row records: which episode, which surface, how many signups, MRR attributed, sponsor revenue, recorded timestamp. Finance + Growth own the daily roll-up; the `/series/[episode]` page can render the live numbers directly.

## What this repo owns vs. Mac Studio owns

| Lives in this repo | Lives on Mac Studio |
|---|---|
| Series Bible + Casting + Style Guide + Pipeline | Hyperframe / Seedance / Veo3 / Nano Banana / Higgsfield / fal / Grok runs |
| Episode beat sheets, scripts, shot lists, asset manifests | ElevenLabs voice generation |
| `/series` site pages | DaVinci edit project files |
| `series_*` Supabase schema + queries | CrawdBot upload jobs |
| Character reference art (`public/series/characters/`) | Final video exports |
| Single source of truth for cast (`agents.ts` + Casting) | Render farm work on droplet Sienna at night |

## Sprint kickoff command (operational, runs on Mac Studio)

```bash
# David picks up an episode-NN issue from the Paperclip board
paperclip dispatch --queue series --sprint episode-NN

# Behind the scenes:
#  - GSD creates Issues for: beat-sheet, script, shot-list, plates, renders, voice, edit, thumbnails, upload, distribute
#  - Each Issue is routed to its lead agent / droplet
#  - Status visible at danslab.vercel.app/series/admin (to be built)
```

## Failure modes & rules

1. **Plate mismatch** — if the lab plate doesn't read as a real lab, reshoot. Don't AI-paint it.
2. **Character drift** — if a render doesn't read like the canonical reference, reject and re-run with the locked Higgsfield identity.
3. **Voice drift** — if a TTS line doesn't match the locked voice ID, re-render. Don't re-cast mid-season.
4. **Telemetry mismatch** — if a number on screen disagrees with Supabase at publish time, the cut is broken. Replace with a fresh capture.
5. **Sponsor conflict** — sponsors approved per episode by Dan only. No agent has authority to accept a sponsor.

## Cadence guarantee

Bi-weekly publishing, Wednesday 17:00 UTC. The Paperclip dispatcher's 15-min cron means we can detect a 14-day sprint slipping by Day 10. If the slip is real, we ship a 6-min "Field Notes" mini-episode in the gap rather than break cadence.
