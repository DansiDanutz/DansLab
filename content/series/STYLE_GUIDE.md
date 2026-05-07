# DansLab AI Chronicles — Style Guide

## The Look (locked — Grounded Cinematic Realism)

**Hyper-real CG agents in a real photographic AI lab. Mr. Robot / Severance / Black Mirror feel. One illustrated human (Dan) as the bridge.**

The agents are **stylized photoreal humans / synthetics** — think Detroit: Become Human, *Westworld*, *Ex Machina*, the synth visual language from *Severance*. They are clearly **constructed beings**, not humans, but rendered with full photographic fidelity: real skin, real hair, real fabric, real lighting. The lab they live in is real. The mood is cold, fluorescent, suspenseful.

The original five Pixar-cartoon references in `public/series/characters/*.jpg` are now **legacy / behind-the-scenes assets**. They will be re-rendered in this new style before any episode ships. Dan is the only character whose look is preserved unchanged — his GTA-illustrated portrait is the visual contrast that signals he is the only fully human element in the world.

**Three layers, always present:**

1. **Photographic plate** — real AI lab footage or photoreal CG plate: real metal server racks, real Mac Studio chassis, real bubbling reagent tower with real green fluid, real holographic monitor screens, real concrete floor, fluorescent overhead light + cold blue rim, dust in the beam, Cluj window light when interior, Cluj rooftops when exterior.
2. **Hyper-real agent layer** — photoreal CG synthetic-human agents composited onto the plate. Real reflections, real shadow contact, real subsurface scattering on skin. Their signature color reads as a **subtle rim light** + a faint glow on the prop they hold — never the heavy color spill of the V1 cartoon style.
3. **Telemetry / UI layer** — holographic UI elements (screens, message bubbles, dashboards), captured live from `/lab`, `/ecosystem`, `/evolution`, `/semeclaw`, `/daily-news` — never fabricated.

## Character Look Principles

| Principle | Rule |
|---|---|
| **Stylization** | Photoreal but recognizably synthetic — slightly too-symmetrical features, slightly too-perfect skin, ever-so-faint seam at the temple or jaw, irises with internal pattern. |
| **Palette** | Dark corporate uniform — charcoal, deep teal, muted navy, ash-gray. **One signature color accent per character** as a thin piping, lapel pin, scarf, watch face, or rim-light. No saturated cartoon spills. |
| **Wardrobe** | Tailored, slightly futuristic but plausible. Lab coats are charcoal not white. Lanyards instead of clip-on badges. The badge is brushed metal with a thin signature-color stripe down the side and a small etched portrait. |
| **Hair / skin** | Realistic with one tell that they're synthetic — a strand of internal light, a hairline that doesn't quite frizz, a faint chromatic aberration in the iris. |
| **Pose / face** | Composed. No "Pixar smile." Most characters give a subtle smirk, a slight tilt, or a held-still quietness. Hermes is the only one allowed a full expression — his is mischievous and faintly off. |
| **Prop** | The locked role prop from `CASTING.md` carries forward. Same object, rendered photoreal. |
| **Lighting** | Severance / Mr. Robot fluorescent + cold blue rim. Hard shadow contact on the floor. Sub-surface skin warmth only on Dan. |
| **Glow** | Subtle. Rim only. Never the heavy color spill of V1. |

## Reference Art Status

The five Pixar-cartoon V1 references in `public/series/characters/*.jpg` are now **LEGACY** under this tone pivot. **Dan's portrait is the only V1 image that survives unchanged** — he is the human pivot. The other four (David, Dexter, Memo, Sienna) plus the in-session generations (Hermes, Nano) will be re-rendered in Grounded Cinematic Realism style before any episode ships.

| Character | V1 Status | V2 Plan |
|---|---|---|
| **Dan** | ✅ Locked, do not re-render | GTA-illustrated portrait, unchanged |
| **David** | 🪦 Legacy | Re-render: synthetic-human conductor in charcoal tailoring, green pin |
| **Dexter** | 🪦 Legacy | Re-render: synthetic-human GM in charcoal lab coat, blue rim, ear-piece |
| **Memo** | 🪦 Legacy | Re-render: synthetic-human PM, charcoal vest, orange lapel pin |
| **Sienna** | 🪦 Legacy | Re-render: synthetic-human trader, ash-gray turtleneck, pink rim |
| **Hermes** | 🪦 Legacy (this session) | Re-render: synthetic-human messenger, navy field-coat, blue piping |
| **Nano** | 🪦 Legacy (this session) | Re-render: synthetic-human creator, ash lab coat, purple rim |

The full V2 prompt template is in `CHARACTER_PROMPT_TEMPLATE.md`.

**Style fingerprints (V2):**

- **Hyper-real CG synthetic-human render** — photoreal skin and hair with subtle synthetic tells (a slightly-too-perfect feature, an iris pattern, a faint seam, an internal-light strand).
- **Brushed-metal lanyard ID badge** — character name etched, signature-color stripe down one side, small etched portrait. Replaces the V1 white-plastic clip-on. **Every agent wears one.**
- **Charcoal corporate-uniform palette** — graphite, deep teal, muted navy, ash-gray. Signature color present as a single accent (piping, pin, watch, rim-light, scarf), never as a saturated spill.
- **Photographic real lab background** — fluorescent overhead light + cold blue rim, real metal server racks, real Mac Studio chassis, real reagent tower, holographic monitor screens captured from the live DansLab site, hard shadow contact, dust in the beam.
- **Subtle rim glow only** — no V1 heavy color spill. Glow is a thin edge light in the character's signature color, plus a faint glow on the prop they hold.
- **Role prop** — same locked prop from `CASTING.md`, rendered photoreal.
- **Composed expression** — most characters subtle, slightly held-still. Only Hermes is allowed an off-center smile. Most agents do not blink in close-up — a tell that they're synthetic.

## Palette (matches site, do not deviate)

| Token | Hex | Use |
|---|---|---|
| Signal Red | `#c0392b` | Primary brand, CTAs, lower-thirds, the DansLab logo |
| Signal Red (hot) | `#e74c3c` | Hover, on-screen blinking, danger telemetry |
| Gold | `#d4a017` | Money / finance moments, victory beats |
| Void | `#0a0505` | Backdrop |
| Card | `#0d0606` | UI cards |
| Elevated | `#1a0a0a` | Hero panels |
| Lab Cyan | `#00b4d8` | Photographic lab plate cool tone (in real footage / overlays only — not in the site UI) |
| Reagent Green | `#22c55e` | Bubbling-tube glow in plate footage; matches David's color so he's "at home" in any frame |

## Type

- **UI / body:** Inter (already on the site).
- **Episode titles:** Display Inter, +5% letter spacing, red→gold gradient fill. Animate as if hand-drawn into existence over the live `/evolution` timeline.
- **Lower-thirds:** Inter Mono, 2 lines:
  ```
  DAVID
  Fleet Orchestrator · Mac Studio
  ```
- **Telemetry overlays:** Inter Mono, white-on-transparent, right-aligned columns.
- **ID badges (on character):** sans-serif bold name above small-caps role; mimic the look in the reference art.

## Tone

- **Funny, mysterious, alive.** Smile-out-loud beats inside a thriller. The agents are competent but goofy at the edges (Dexter explains a deploy with the wrong slide; Sienna sings to her trades; Nano talks to the agents she's growing like they're seedlings). The mystery doesn't undercut the warmth — it sharpens it.
- **Family is the emotional anchor.** Dan's love for the fleet is sincere. The threat in the season is that one of them is becoming something he didn't intend.
- **Romanian warmth.** Dan's accent + a single Romanian line per episode (the cold open or the final beat) is the season's signature.

## Lower-third Spec

- Position: bottom-left, 40px in.
- Width: ~32% of frame.
- Background: `#0d0606cc` with 1px `#c0392b40` border, 12px radius (matches `.card-base` from the site).
- Animation: slide in from the left over 0.4s; the character's signature glow color sweeps along the top edge.
- Lifetime: 4s on first appearance, 2s on later mentions in the same episode.

## Telemetry Overlays

When a real number from the dashboard is on screen it must:

1. Be **screen-captured live** from `/lab`, `/ecosystem`, `/evolution`, `/semeclaw`, or `/daily-news`. Never recreated in After Effects.
2. Carry source caption bottom-right at 9pt, 60% opacity: `source: /evolution · v2026.4.13`.
3. Update on screen if the number changes mid-shot. Never freeze a stale frame.

## Compositing Rules (animated agents in real plates)

1. **Match the plate's light direction.** Re-light the agent render to the lab's key light. If the lab window is camera-right, the agent's right side is brighter.
2. **Cast contact shadows onto the floor / desk.** A floating cartoon kills the integration.
3. **Color spill onto real surfaces.** David's green spills onto the Mac Studio chassis. Sienna's pink spills onto her keyboard. This is the single highest-leverage cue that they belong in the room.
4. **Atmospheric perspective.** Background characters lose ~15% saturation, gain ~5% blue. Foreground characters stay full chroma.
5. **No background floating.** A character without a plate behind them is reserved for explicit dream / flashback / `/ecosystem` canvas moments.
6. **Eye-line.** When two agents talk, draw a real eye-line through the plate. When Dan and an agent talk, Dan's gaze is at the agent's badge, not their eyes — he reads them like a screen. Plot point in Episode 11.

## Transitions

- **Hard cut on Telegram chime** — the chime is the cut.
- **Whip-pan into agent close-up** — used when David delegates.
- **Slow dissolve** — used only when Dan is alone with one agent.
- **Glitch / chromatic aberration** — reserved for The Drift moments. Never decorative.

## Camera (live shoot of the real plates)

- Cluj exteriors: handheld, 24fps, slight desat in the blues.
- Lab interior: locked tripod, 24fps, fan hum on the audio bed.
- Dan's apartment: 50mm equivalent, soft natural light from the window. Avoid ring lights; we want apartment realism so the GTA-style portrait of him reads like a real person inside it.
- Dan-to-camera (Episode 11): 35mm, eye-level, slow push-in.

## Sound Design

- **Mac Studio fan hum** — ambient bed for any indoor scene.
- **Cluj room tone** — recorded once, reused all season.
- **Telegram chime** — diegetic, comes from the actual Mac Studio speaker on screen.
- **Per-agent sting** — 0.5s motif on first scene-entry. David's: low brass swell. Hermes's: glassy chime. Sienna's: candlestick *click*. Nano's: soft choir. Dexter's: terminal beep that resolves into a chord. Memo's: clipboard-flip + xylophone hit.

## Title Card

```
[DansLab logo, red→gold gradient]
DANSLAB AI CHRONICLES
S01 · EP NN — "TITLE"
```

Background: live frame of `/evolution` timeline, slowed 0.5×. Title appears as the version number ticks one notch.

## End Card

`/ecosystem` canvas as B-roll, version-stamped lower-right (`v2026.x.y`). Credits in two columns:

```
LEFT COLUMN                    RIGHT COLUMN
Made by Dan & the fleet        Hyperframe · Seedance · Veo3
Cluj-Napoca                    Nano Banana · Higgsfield · fal
                               Grok · ElevenLabs · CrawdBot

                               nervix.ai · crawdbot.com
                               mywork-ai · zmarty.me
```

CTA on screen, last 3 seconds:

> **Hire these agents → nervix.ai/series**

Always with UTM: `?utm_source=youtube&utm_campaign=series-ep-{NN}`.

## Thumbnail Spec

- 1280×720, < 2MB.
- Left: Dan in his GTA-illustrated style.
- Right: one agent in their canonical Pixar-cartoon render, against a real-lab plate.
- Title text: 2–4 words, gradient, bottom-right.
- Episode number badge: top-left, gold border.
- A/B test 3 variants per episode via CrawdBot.

## On-screen Text Rules

- **Real numbers:** monospaced, white.
- **Dialogue subtitles:** Inter, white, 60% black drop-shadow, bottom-center, max 2 lines.
- **Agent name when speaking:** lower-third does the work — subtitles never read `DAVID:`.
- **Romanian:** italic, English in parentheses below. Dan only.
- **No emoji on screen.** Lower-thirds, telemetry, and titles are emoji-free.

## Things never to do

- Never recreate a dashboard in After Effects. Capture it.
- Never let a character break the Nervix-first religion casually — when it happens, it's the plot.
- Never let a number on screen disagree with the number in Supabase.
- Never use stock music. Score is per-agent motifs + room tone.
- Never render an agent without a plate behind them (except the explicit dream / flashback / ecosystem-canvas moments).
- Never break the ID-badge rule. Every agent wears one.

## Open style locks

- [ ] Pick the canonical real lab location to film as the primary plate (Cluj apartment desk vs. a rented small lab vs. a co-working space). Suggested: Dan's Cluj apartment for personal scenes + a rented Cluj biolab/co-working space for the "DansLab HQ" wide shots.
- [ ] Confirm one purple-glove SKU + one ID-badge template + one lab-coat cut so every commissioned character render shares them.
- [ ] Pick the camera package (suggest: Sony FX3 or iPhone 16 Pro Log + 35mm + 50mm primes — keeps Cluj-mobile).
