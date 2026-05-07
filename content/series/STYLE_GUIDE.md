# DansLab AI Chronicles — Style Guide

## The Look (locked by reference art + photographic-background rule)

**Animated cartoon characters composited into a real-world photographic AI lab.**

Roger Rabbit / Cool World / Space Jam style mix: the **characters** are stylized 3D-rendered Pixar-cartoon (matching the five locked references in `public/series/characters/`); the **background plate** is a real photographed AI laboratory — real metal server racks, real bubbling reagent tower with real green fluid, real holographic monitor screens, real concrete floor, real cinematic lighting, dust in the beam. Strong stylistic contrast between the cartoon character in the foreground and the photographic backdrop behind them.

> **The five canonical references are canonical for the character only — not for the background.** They were rendered with a cartoon background; from now on every new render uses a photographic AI-lab plate. Memo / Sienna / Dexter / David / Dan stay as locked character canon for now; we may re-render them onto photo plates in the future, but their faces, props, ID badges, and color glow are frozen.

Dan is the only character rendered in a separate, more grounded illustrated style (think GTA loading-screen portrait). He is the bridge between the photographic real lab and the cartoon fleet.

**Three layers, always present:**

1. **Photographic plate** — real AI lab footage or real photographic CG plate: glassware, Mac Studio chassis, server LEDs, monitors, Cluj window light, dust in the beam. Filmed for real.
2. **Animated agent layer** — 3D Pixar-style characters composited onto the plate, casting real shadows onto real surfaces. Their colored glow spills onto the lab equipment around them.
3. **Telemetry / UI layer** — holographic UI elements (screens, message bubbles, dashboards), drawn from the real DansLab site (`/lab`, `/ecosystem`, `/evolution`, `/semeclaw`, `/daily-news`) — never fabricated.

## Reference Art (canonical)

These five images are locked. Match them.

| Character | Reference | Notes |
|---|---|---|
| **Dan** | `public/series/characters/dan.jpg` | GTA illustrated portrait. Glasses, beard, dark hoodie with orange "i" logo. Cluj rooftops behind. Distinct from the cartoon style — Dan is the human pivot. |
| **David** | `public/series/characters/david.jpg` | Boy conductor. Yellow & purple tuxedo, bowtie, baton. Conducts the orchestra of agents. "DAVID / ORCHESTRATOR" ID badge. The "DansLab" sign is in his frame on purpose. |
| **Dexter** | `public/series/characters/dexter.jpg` | Orange-hair scientist with thick black glasses, head mirror, lab coat, purple gloves, green flask, stethoscope dangling. The deliberate *Dexter's Laboratory* homage that explains the DansLab name. |
| **Memo** | `public/series/characters/memo.jpg` | Young scientist, dark hair with goatee, lab coat over teal undershirt, purple gloves, blue flask, "MEMO" ID badge. Smiling thumbs-up. |
| **Sienna** | `public/series/characters/sienna.jpg` | Long auburn hair, green eyes, pink-and-cyan headphones with mic, pink crop top with Bitcoin medallion, holding a glowing gold Bitcoin, candlestick chart on the screen behind her. "SIENNA / CRYPTO GIRL" badge. |

**Style fingerprints to carry across every other agent we design:**

- **Cartoon-Pixar render** — soft rounded forms, big expressive eyes, slightly heightened proportions.
- **ID badge on chest** — white, rounded corners, character name in bold black, role title underneath, mini headshot on the left. **Every agent must wear one.** The badge is the signature.
- **Purple lab gloves** — recurring uniform element. Memo and Dexter wear them; most other "lab tier" agents do too. **Exception:** comms / sales / external agents (Hermes, Sienna, Stripe, Growth) skip the gloves to read as "field" rather than "bench."
- **Lab background** — blue-cyan undertone, green bubbling reagent column on the left, server racks and holographic monitors behind. This is the **default home set** for any character who lives on Mac Studio. Droplet-tier characters get a tinted variant of their droplet's color.
- **Color glow** — each character's signature color (locked in `agents.ts`) glows softly off them onto the lab equipment they touch.
- **Role prop** — a single object the character is holding or beside that *says their job in one beat* (Memo's flask, Sienna's coin, Dexter's stethoscope, David's baton). Lock one prop per agent.

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
