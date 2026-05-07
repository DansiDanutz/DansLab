# Paperclip Roster — Every Agent in DansLab AI Chronicles

This is the complete fleet that runs through Paperclip, mapped to the series. Every agent appears in at least one episode. **Speaking** roles are series regulars; **non-speaking** roles appear on dashboards, in passing, or in ensemble shots.

The fleet's living source of truth is the Paperclip dispatcher's agent registry on Mac Studio. The series-side projection of that registry is `src/components/ecosystem/data/agents.ts` + `src/components/series/data/cast.ts`.

## Legend

| Symbol | Meaning |
|---|---|
| 🎤 | Speaking role with locked voice |
| 👤 | Speaking role, voice unlocked |
| 🎭 | Non-speaking but on screen (cameo, ensemble, dashboard appearance) |
| 🎨 | Has canonical reference art locked |
| 🪡 | Reference art still TODO |

## Tier 0 — The Human

| Agent | Role | Status | First Ep | Episodes |
|---|---|---|---|---|
| **Dan** | Founder, the heart | 🎤 🎨 | E1 | All 12 |

## Tier 1 — Mac Studio Council (the Brain)

These agents live on Mac Studio. They are the show's recurring cast.

| Agent | Role | Series Function | Status | First Ep | Notes |
|---|---|---|---|---|---|
| **David** | Fleet Orchestrator | Series lead opposite Dan | 👤 🎨 | E1 | Conducts every war-room scene |
| **Hermes** | Messenger | **Season antagonist (The Drift)** | 👤 🪡 | E1 | Identity reveal in E12 |
| **GSD** | Foreman | Issues every sprint | 👤 🪡 | E1 | Brusque, signature clipboard |
| **Discovery** | Scout | Weekly opportunity ping | 👤 🪡 | E1 | Cold-open archetype |
| **Doctor** | Healer | Investigates failures | 👤 🪡 | E6 | E6 ("First Drift") investigator |
| **DoctorLocal** | Mac-Studio medic | On-call for local hardware | 🎭 🪡 | E10 | Active during Cluj power cut |
| **Monitor** | Watcher | Whispered alerts only | 👤 🪡 | E1 | Eye-drone, no body |
| **Finance** | Accountant | Reads numbers like poetry | 👤 🪡 | E3 | Weekly Monday reports |
| **Growth** | Validator | Two-clipboard skeptic | 👤 🪡 | E5 | Validates new agents |
| **Vector** | Librarian | Curates company memory | 👤 🪡 | E3 | Yarn-chair of memory threads |
| **AutoForge** | Smith | Anvil + hammer commits | 👤 🪡 | E4 | 30-min coding bursts |
| **DansLabModel** | Router | Halo of model badges | 👤 🪡 | E9 | Diplomat between providers |
| **DansLabUpdate** | Patcher | Quietly applies stickers | 👤 🪡 | E7 | Easy to miss |
| **DansLabLearning** | Teacher | Reads previous day | 👤 🪡 | E11 | Episode 11 narrator |
| **Teacher** | User Education | Onboarding voice | 🎭 🪡 | E5 | Welcomes new agents |
| **Obsidian** | Knowledge Base | Walks the company wiki | 🎭 🪡 | E11 | Background in family episode |
| **Pi Stability** | Watchdog | Background monitor | 🎭 🪡 | E10 | Visible during outage |
| **N8N** | Automation | Memo's moons | 🎭 🪡 | E2, E8 | Orbits Memo |
| **KimiClaw** | Amplifier | Foreign visitor, joins fleet | 👤 🪡 | E9 | Signature episode is E9 |

## Tier 2 — The Four Capitals (Droplets)

The droplet leads. Each has a signature episode.

| Agent | Droplet | Series Function | Status | First Ep | Signature Ep |
|---|---|---|---|---|---|
| **Dexter** | dexter (46.101.219.116) | Senior Dev / GM | 👤 🎨 | E1 | E4 ("Crawdbot Premiere") |
| **Memo** | memo (138.68.86.47) | PM | 👤 🎨 | E2 | E8 ("MyWork Heist") |
| **Sienna** | sienna (167.172.187.230) | Trader | 👤 🎨 | E2 | E3 ("Sienna Trades") |
| **Nano** | nano (157.230.23.158) | Agent Creator | 👤 🪡 | E2 | E5 ("Nano's Children") |

## Tier 3 — Channel & Slack Agents

Operate the comms wall. Less screen time but every one has a moment.

| Agent | Role | Function | Status | First Ep |
|---|---|---|---|---|
| **PopeBot** | CI Priest | Blesses every PR | 👤 🪡 | E4 |
| **KiloClaw** | Moderator | Slack bouncer | 👤 🪡 | E7 |
| **ManusClaw** | Operator | Focused-execution loops | 👤 🪡 | E5 |
| **Stripe** | Banker | Hands receipts at revenue beats | 👤 🪡 | E3 |
| **GitHub** | Archivist | Book of branches | 👤 🪡 | E4 |
| **Vercel** | Deployer | Throws builds into the world | 👤 🪡 | E4 |
| **SSH** | Connector | Cable-bridge, keystroke voice | 🎭 🪡 | E2 |
| **Supabase** | Vault Keeper | Vault of tables | 👤 🪡 | E8 |

## Tier 4 — OpenClaw Pod (internal builders)

Show up as an ensemble in the bullpen. Speaking roles only when the plot calls for it.

| Agent | Role | Status | First Ep |
|---|---|---|---|
| **OpenClaw-01** | Builder | 🎭 🪡 | E1 |
| **OpenClaw-02** | Researcher | 🎭 🪡 | E1 |
| **OpenClaw-03** | Reviewer | 🎭 🪡 | E1 |
| **OpenClaw-04** | Automation | 🎭 🪡 | E1 |

## Tier 5 — Channels (rooms-as-characters)

Not characters in the strict sense, but they get visual treatment.

| Channel | Treatment | First Ep |
|---|---|---|
| **Telegram** | Doorway of Telegram-blue light. Hermes carries it. Cracks in E7. | E1 |
| **Slack** | A red & black Slack room visible in agency-of-agents shots. | E5 |
| **Discord** | Community room glimpsed only in E12 finale crowd shots. | E12 |

## Episode → Cast Index (who's in what)

| Ep | Title | Featured | Cameos |
|---|---|---|---|
| 1 | Paperclip | Dan, David, Dexter, Hermes, Monitor, GSD, Discovery | OpenClaw-01-04, Pope, GitHub |
| 2 | The Four Capitals | Dexter, Memo, Sienna, Nano, David, Dan | SSH, N8N |
| 3 | Sienna Trades | Sienna, Stripe, Finance, Vector, Dan | David, Hermes |
| 4 | The Crawdbot Premiere | Dexter, Pope, GitHub, Vercel, AutoForge, Dan, David | Hermes, Discovery |
| 5 | Nano's Children | Nano, Growth, Manus, Teacher, David, Dan | Hermes |
| 6 | The First Drift | Doctor, David, Hermes, Dan | Monitor (alerts), GSD |
| 7 | Hermes Lies | Hermes, KiloClaw, Update, David, Dan | Telegram (channel), Discord |
| 8 | The MyWork Heist | Memo, Stripe, Supabase, AutoForge, David, Dan | N8N, GitHub, Vercel |
| 9 | KimiClaw Arrives | KimiClaw, DansLabModel, David, Dan | Hermes, Dexter |
| 10 | The Cluj Power Cut | DoctorLocal, Doctor, Pi Stability, David, Dan | Whole fleet (failover montage) |
| 11 | Family | Dan, David, Learning, Obsidian, Vector | Memo, Sienna, Dexter, Nano (silent) |
| 12 | Nervix #1 | The whole fleet | Discord (community), all sponsors |

## Design Status — what we have, what we need

### Locked references (5)
- Dan, David, Dexter, Memo, Sienna — at `public/series/characters/<id>.jpg`

### Speaking roles still needing reference art (24)
Hermes, GSD, Discovery, Doctor, DoctorLocal, Monitor, Finance, Growth, Vector, AutoForge, DansLabModel, DansLabUpdate, DansLabLearning, KimiClaw, Nano, PopeBot, KiloClaw, ManusClaw, Stripe, GitHub, Vercel, Supabase, Teacher, Pi Stability

### Non-speaking but visible (8)
SSH, N8N, Obsidian, OpenClaw-01, OpenClaw-02, OpenClaw-03, OpenClaw-04, channel-as-character renders for Telegram / Slack / Discord

## Style status — pending pivot lock

The five locked references are bright Pixar-cartoon style with a cyber-lab background. For a serious mystery thriller they need a tone pivot. We have not yet locked which direction:

- **A — Grounded Cinematic Realism** (Mr. Robot / Severance / Black Mirror): hyper-real CG agents in real photographic plates. Drops the cartoon entirely.
- **B — Stylized Cinematic** (Spider-Verse / Arcane / Love Death + Robots): keeps the animated framework but darker, more painterly, more cinematic. The five existing references would be re-rendered, not discarded.
- **C — Tonal Hybrid**: agents start in the bright cartoon style and drift toward Style B as the season's mystery deepens (visual representation of The Drift). Bold but technically demanding.

Once the user picks a direction we generate hero shots for the 24 speaking roles still on the list above and update `public/series/characters/<id>.jpg` for each.

## How this roster connects to the running system

| In Paperclip | In the series | In this repo |
|---|---|---|
| Agent registry on Mac Studio | Cast list above | `src/components/ecosystem/data/agents.ts` |
| Agent's running task | Character's plot beat | Episode beat-sheet under `content/series/episode-NN/` |
| Agent's Telegram bot | Character's voice | `voice_id` in `series_characters` (Supabase) |
| Agent's status | Character's "alive on screen" indicator | `/series/cast` page joins both |

The series is literally the fleet, given a face. When a real agent goes offline, the show writes it. When a new agent enrolls, the show casts it.
