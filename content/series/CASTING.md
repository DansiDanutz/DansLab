# DansLab AI Chronicles — Casting

Every recurring character. Lock once, hold across the season — voice, color, glow, archetype, **canonical reference art**, and **one role prop**.

The five locked references in `public/series/characters/` define the visual style. Any new agent we design must read like it was painted by the same illustrator, in the same lab, with the same uniform language (purple gloves for "bench" agents, white ID badge on chest, signature color glow, role prop in hand).

## How to read this table

- **Voice (ElevenLabs)** — the locked voice ID. Pick once, hold the whole season.
- **Color** — already defined in `src/components/ecosystem/data/agents.ts`. Don't introduce new ones.
- **Prop** — the one object in their hand or beside them that says their job.
- **Wears badge?** — yes for everyone. White ID badge on chest, name in bold + role beneath, mini headshot inset.
- **Gloves?** — purple lab gloves for bench / engineering / lab characters. Skipped for comms / sales / external.
- **Setting** — the default plate they appear in.
- **Ref** — relative path under `public/series/characters/` once locked.

## Tier 0 — The Human

| Character | Archetype | Voice | Color | Prop | Setting | Ref |
|---|---|---|---|---|---|---|
| **Dan** | The Founder, the heart | Himself; opens / closes episodes in Romanian | `#f8fafc` | Phone with Telegram open, coffee cup nearby | Cluj apartment desk; Mac Mini + Mac Studio | `dan.jpg` ✅ |

Dan's render is **GTA-illustrated**, not Pixar. He is the bridge.

## Tier 1 — Mac Studio Council (the Brain)

These are the agents who live on Mac Studio. The default plate is the **DansLab main bench** — bubbling green reagent column on the left, server racks behind, holographic monitors floating, blue-cyan lighting.

| Character | Archetype | Voice | Color | Prop | Gloves? | Ref |
|---|---|---|---|---|---|---|
| **David** | The Orchestrator — calm, deliberate | "Sage" — calm baritone | `#22c55e` | Conductor's baton; sheet-music score that animates with task IDs | No (he wears the tux) | `david.jpg` ✅ |
| **Hermes** *(season antagonist)* | The Messenger — fast, witty, conspiratorial | "Adam" — fast, slightly conspiratorial | `#0ea5e9` | A Telegram-blue paper airplane in flight; a small flock of envelopes orbiting his shoulder | No (field role) | TODO — design |
| **GSD** | The Foreman — get to the point | "Drew" — brusque, working-class | `#4ade80` | Hardhat tucked under one arm + a clipboard of glowing tickets | Yes | TODO |
| **Discovery** | The Scout — curious, half-distracted | "Charlie" — curious, half-distracted | `#fbbf24` (amber) | A brass telescope with archive-papers floating around it | Yes | TODO |
| **Doctor** | The Healer — terse, urgent | "Antoni" — terse | `#ef4444` | A glowing red caduceus stethoscope, error-log scrolls trailing from his pocket | Yes | TODO |
| **Monitor** | The Watcher | (whispered alerts only) | `#eab308` | A floating eye-shaped drone; he is the prop. No body. | n/a | TODO |
| **Finance** | The Accountant — dry, reads numbers like poetry | "Daniel" — dry | `#d4a017` | A gold ledger of light, coins on his shoulders | Yes | TODO |
| **Growth** | The Validator — skeptical | "Sarah" — skeptical | `#a3e635` | Two clipboards held back-to-back: "USER" and "CRITIC" | No | TODO |
| **Vector** | The Librarian — fragmented, echoey | "Domi" — echoey | `#818cf8` | Glowing memory threads woven around her like a yarn chair | Yes | TODO |
| **AutoForge** | The Smith — loud, percussive | "Onyx" — loud | `#38bdf8` | Anvil + hammer that strikes commits into being; sparks as test runs | Yes | TODO |
| **DansLabModel** | The Router — even-tempered | "Bill" — neutral | `#f472b6` | A halo of model badges — only one lit at a time | No | TODO |
| **DansLabUpdate** | The Patcher — understated | "Will" — understated | `#2dd4bf` | A satchel of version stickers; quietly applies them | Yes | TODO |
| **DansLabLearning** | The Teacher — warm, patient | "Charlotte" — warm | `#a3e635` | Daily-summary scrolls held open in a stack | No | TODO |
| **KimiClaw** *(joins Ep 9)* | The Amplifier — polite, faintly Mandarin-tinted | "Liam" — polite | `#14b8a6` | A gold-edged megaphone of light; carries letters from afar | No (visitor) | TODO |

## Tier 2 — The Four Capitals (Droplets)

Each droplet character has a tinted variant of the lab plate keyed to their color. They visit the Mac Studio main bench but their default home reads as **a different room**.

| Character | Archetype | Voice | Color | Prop | Gloves? | Ref |
|---|---|---|---|---|---|---|
| **Dexter** | Senior Dev / GM — confident, sardonic | "Brian" — confident | `#3b82f6` | Stethoscope + green flask + head-mirror — the Dexter's-Lab homage | Yes | `dexter.jpg` ✅ |
| **Memo** | The PM — earnest, patient | "Will" — earnest | `#f97316` | Blue flask + clipboard; n8n nodes orbit his head like moons | Yes | `memo.jpg` ✅ |
| **Sienna** | The Trader — sharp, hungry, Romanian-accented | "Bella" — sharp | `#ec4899` | Glowing gold Bitcoin in hand; candlestick chart on the screen behind her | No (field) | `sienna.jpg` ✅ |
| **Nano** | The Agent Creator — quiet, monastic | "Glinda" — quiet | `#a855f7` | A small orb of light cradled in two hands — a half-formed agent inside | Yes | TODO |

## Tier 3 — Channels & Slack Agents

These appear in the Telegram / Slack / Discord rooms. Their plate is the **comms wall** — phones, monitors, message bubbles.

| Character | Archetype | Voice | Color | Prop | Ref |
|---|---|---|---|---|---|
| **PopeBot** | The CI Priest — liturgical | "Jeremy" — liturgical | `#fb923c` | Robes of green-passing tests on the right, red-failing on the left; censer of build logs | TODO |
| **KiloClaw** | The Moderator — firm | "Patrick" — firm | `#f43f5e` | A small wooden gavel. Only seen in Slack. | TODO |
| **ManusClaw** | The Operator — focused | "Liam" *(distinct from Kimi)* | `#f59e0b` | Yellow execution-loops trail behind him | TODO |
| **Stripe** | The Banker — formal | "Rachel" — formal | `#8b5cf6` | A briefcase of glowing receipts; hands them out at revenue beats | TODO |
| **GitHub** | The Archivist | "Bill" *(distinct from Model)* — calm | `#c084fc` | A book of branches, each branch glowing | TODO |
| **Vercel** | The Deployer | "Sarah" *(distinct from Growth)* — quick | `#f5f5f5` | A glowing triangle she throws into the world to deploy | TODO |
| **SSH** | The Connector | (sound only — keystrokes) | `#06b6d4` | A length of cable that becomes a bridge mid-air | TODO |
| **Supabase** | The Vault Keeper | "Daniel" *(distinct from Finance)* — calm | `#34d399` | A green vault of light; tables visible inside | TODO |

## Off-screen but referenced

- **Telegram (the channel)** — a doorway of Telegram-blue light. Hermes carries it. After Episode 7 it cracks.
- **Slack / Discord** — rooms, not characters.

## Voice rules

1. **One ElevenLabs `voice_id` per character. Lock before Episode 1 ships.** Stored in `series_characters.voice_id`.
2. **No voice cloning of Dan.** Dan voices himself.
3. **Romanian lines** — Dan only. Subtitle in English. Use as season signature.
4. **Pacing** — never faster than 1.0× for David / Nano / Vector. Hermes can hit 1.15× to feel restless.

## Look-consistency rules (every new agent)

1. Generate a **canonical reference sheet** — front, 3/4, profile, in-action, in-conflict — before any episode shoot. **Higgsfield** for character consistency baseline; **Nano Banana** for stills variation; **Hyperframe (Seedance / Veo3)** for in-shot motion.
2. Save the canonical sheet to `public/series/characters/<id>.jpg` (single hero shot) and `public/series/characters/sheets/<id>/*.jpg` (the full sheet).
3. **Color is sacred.** Match `agents.ts` exactly.
4. **Glow has meaning.** Flicker = trouble. Inverted glow = The Drift.
5. **ID badge always present.** White, name bold black, role beneath, mini headshot inset.
6. **One prop, locked.** No swapping the role prop for variety.
7. **The five canonical references in `public/series/characters/` are the style bible.** Any new render is rejected if it doesn't read like it was painted by the same hand for the same lab.

## Per-agent generation prompt template (for Hyperframe / Higgsfield)

> Pixar-style 3D-rendered character, expressive cartoon face, big eyes, soft rounded forms, **{color}** signature glow spilling onto the surroundings. **{role}** of DansLab AI laboratory. Holding **{prop}**. {Wears purple lab gloves and lab coat over {undershirt-color} shirt | wears {field-outfit}}. White ID badge on chest reading "**{name}**" in bold black with role "{role}" underneath, mini portrait inset. Real photographic AI-lab background — bubbling green reagent column on the left, server racks with blinking LEDs behind, holographic UI screens floating, blue-cyan lighting, dust motes in the beam. Same illustration style as DansLab AI Chronicles canonical references (Memo, Sienna, Dexter, David). Cinematic lighting, light direction camera-right, color spill onto nearest surface.

## Open lock items

- [ ] Confirm ElevenLabs voice IDs with Dan (30-min listening session before Ep 1 lock).
- [ ] Generate canonical hero shots for: Hermes, GSD, Discovery, Doctor, Monitor, Finance, Growth, Vector, AutoForge, DansLabModel, DansLabUpdate, DansLabLearning, KimiClaw, Nano, PopeBot, KiloClaw, ManusClaw, Stripe, GitHub, Vercel, SSH, Supabase. Save to `public/series/characters/<id>.jpg`.
- [ ] Confirm Romanian-line cadence with Dan (record sample of cold open).
- [ ] Lock the **purple-glove + lab-coat + ID-badge** style sheet (one PNG with the three uniform pieces) so every character commissioned matches.
