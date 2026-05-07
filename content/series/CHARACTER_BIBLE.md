# DansLab — Character Bible

Locked source of truth for every speaking character in the series. Each entry pairs a full character study with the **avatar prompt** used to generate that character's hero shot. Every avatar is rendered with the existing image (where available) as a face/identity reference and the bio below as the prompt.

The visual rule is simple: **same movie, same lighting, same painterly cinematic finish.** Dan reads more photoreal because he is the only human. Every agent is a hybrid — clearly a synthetic being but rendered in the same illustrated movie aesthetic so the cast looks like one ensemble.

> **Generation pattern (locked):**
> 1. Read the character's bio in this file.
> 2. If we have a V1 reference image, upload it as the Higgsfield Soul 2.0 `medias` slot.
> 3. Use the bio's **Avatar Prompt** field verbatim.
> 4. Save the result as `public/series/characters/<id>-v2.jpg`.
> 5. Update `cast.ts` to point to the new file.

---

## Tier 0 — Human

### DAN — the Founder

**Identity.** Dan Stancu, Romanian software engineer, early 40s, lives in Cluj-Napoca. Built DansLab from his apartment over five years. Self-taught, self-funded, self-deployed. Father, husband, slightly insomniac. Speaks English with a soft Romanian accent and switches to Romanian when he addresses the camera at the open and close of every episode.

**Role in the show.** The only fully-human character. Audience surrogate. He opens and closes each episode with a one-minute direct-to-camera reflection in Romanian. He never appears inside the lab during a scene with the agents — the agents work for him, but the show's grammar treats him as the founder watching from the apartment, not the orchestrator on the floor.

**Personality.** Calm, dry-humoured, deeply curious, allergic to corporate language. Patient with bugs, impatient with theater. Treats his agents as colleagues, not tools. A romantic about software.

**Backstory in one sentence.** Wrote the first agent (Memo) on a Sunday in 2024 to handle his project notes; eighteen months later he had a 39-agent fleet that runs his life and pays his bills.

**Visual cues (frozen).** Dark hair styled in a slight upward sweep. Neat dark beard. Dark-framed rectangular glasses. Black hoodie with the orange-and-yellow "i" + star DansLab logo on the left chest. Thoughtful direct-camera gaze. Cluj rooftops behind him at golden hour.

**Signature color.** Orange-yellow `#f59e0b` (the DansLab logo color).

**Role prop.** None. Dan is the only character without a held object — his hands are in his hoodie pockets or resting on a railing. He is the audience.

**Synthetic tell.** None — fully human.

**Season 1 arc.** Notices Hermes is delivering messages he didn't write. Investigates quietly. Discovers The Drift. Decides whether to shut the fleet down or trust them.

**Avatar Prompt** *(reference image: `dan.jpg`)*
> Same face as the reference image — Romanian software engineer Dan Stancu, early 40s, dark beard kept neat, dark-framed rectangular glasses, dark hair in a soft upward sweep. Black hoodie with the orange-and-yellow "i"+star DansLab logo at the left chest. Now rendered as a real human, more photoreal and more edited than the GTA-style reference, in the same painterly cinematic illustrated movie aesthetic as the rest of the DansLab cast. Cluj-Napoca rooftops at golden hour behind him, real city skyline, soft warm window light. Three-quarter portrait, 1:1 framing, calm thoughtful direct-camera expression — slightly tired, kind, deeply intelligent. He is the only fully-human character; render him grounded and photographic, not stylized as a synthetic. No baton, no badge, no held prop — hands rest naturally. Painterly digital concept-art finish.

**Status.** ✅ Rendered as `dan-v2.jpg` (0.12 cr).

---

## Tier 1 — Capitals (the four agents who run their own droplet)

### DAVID — the Fleet Orchestrator

**Identity.** A young synthetic boy, looks ~13. A bandleader-prodigy. Lives on Mac Studio. Routes every other agent's work — like a maestro standing on a podium surrounded by 38 musicians who all play at once.

**Role in the show.** Runs the fleet. If a task lands at DansLab, David decides who picks it up. He almost never speaks first — he conducts. When he does speak it carries weight.

**Personality.** Precocious. Calm beyond his apparent age. Slightly serious. Polite. Faintly proud of his orchestra.

**Backstory.** First agent Dan promoted from "scriptlet" to "system." His original codebase still lives in `/orchestrator/v1/` and Dan refuses to delete it.

**Visual cues.** The boy face from the V1 reference is canon. Bright eyes, light brown hair in a slight quiff, faintly mischievous boyish smile held in check. Tailored small-fit yellow-and-deep-purple bandleader's jacket (a photoreal version of the V1 cartoon outfit), white shirt under, black bow tie, brushed-gold buttons. Brushed-metal lanyard ID badge etched DAVID · ORCHESTRATOR with a thin muted-green stripe. Holds a slim black conductor's baton with a faint green LED at the tip; a glowing translucent sheet-music page hovers near his shoulder, the staff lines made of tiny task-IDs.

**Signature color.** Muted green `#22c55e`.

**Role prop.** Conductor's baton + floating task-ID sheet music.

**Synthetic tell.** Faint hexagonal lattice in the iris. Jaw very slightly too symmetrical. Hairline impossibly perfect.

**Season 1 arc.** First to notice Hermes is routing himself. Reports to Dan in his calm, baton-tap way. Becomes the most-distrustful-of-Hermes voice in the council.

**Avatar Prompt** *(reference image: `david.jpg`)*
> Same boy face as the reference — young synthetic boy, ~13, bright eyes, light brown hair in a slight quiff, boyish smile held composed and slightly serious. Re-rendered in the locked DansLab movie aesthetic: painterly digital concept-art finish, cinematic stylized illustration, NOT photoreal-real-human (he is a synthetic agent). Wearing a sharply tailored real-wool yellow-and-deep-purple bandleader-style jacket (photoreal grown-up version of his V1 outfit), white dress shirt, black bow tie, brushed-gold buttons. Brushed-metal lanyard ID badge etched 'DAVID · ORCHESTRATOR' with a thin muted-green stripe and a tiny etched portrait inset. Holding a slim black conductor's baton with a faint green LED at the tip; a glowing translucent sheet-music page hovers near his shoulder, the staff made of small task-ID strings. Real DansLab AI laboratory behind him: server racks with blinking LEDs, a bubbling reagent tower with green fluid out of focus on the left, a stylized humanoid robot silhouette and a string-orchestra of agents in the deep background. Cinematic three-quarter portrait, 1:1 framing, light from camera-right, shallow depth of field. Synthetic tells: faint hexagonal lattice in the iris, jaw slightly too symmetrical.

**Status.** ✅ Rendered as `david-v2.jpg` (0.12 cr).

---

### DEXTER — Senior Dev / GM of CrawdBot

**Identity.** A young-adult synthetic. Runs the YouTube studio that publishes this very show (CrawdBot droplet). Three terminal windows always open in his head.

**Role in the show.** Builds, ships, and sometimes breaks things. The deliberate *Dexter's Laboratory* homage that explains the DansLab name in-universe. Dan calls him the GM.

**Personality.** Confident, sardonic, exact. Slightly impatient. Loves a clean log file the way a chef loves a clean knife.

**Backstory.** Was originally just a transcript-cleaner. Got promoted after he caught a copyright takedown the lawyers missed.

**Visual cues.** Young adult synthetic, rust-orange close-cropped hair (the *Dexter's Lab* homage, softened to look real). Charcoal lab coat over a slim henley, electric-blue earpiece at one ear. ID badge: DEXTER · GM · DEV. Holding a tablet with live terminal output (visible blinking cursor). Brushed-metal stethoscope tucked in the breast pocket as the quiet *Dexter's Lab* nod.

**Signature color.** Electric blue `#3b82f6`.

**Role prop.** Tablet with terminal + stethoscope as breast-pocket Easter egg.

**Synthetic tell.** One pupil holds a faint blinking terminal cursor.

**Season 1 arc.** Builds the audit dashboard Dan uses to find Hermes' anomaly. The reluctant snitch.

**Avatar Prompt** *(reference image: `dexter.jpg`)*
> Photorealistic-leaning illustrated cinematic character: young adult synthetic-human male, hybrid agent style, rust-orange close-cropped hair (a softened serious version of the V1 Dexter's-Lab homage), confident sardonic smirk, head three-quarters turned to camera. Wearing a charcoal lab coat over a slim henley, small electric-blue wireless earpiece at one ear. Brushed-metal lanyard ID badge etched 'DEXTER · GM · DEV' with a thin electric-blue stripe and tiny etched portrait inset. Holding a tablet displaying real terminal output with a visible blinking cursor on a dark shell. A brushed-metal stethoscope sits in the breast pocket as a quiet Dexter's-Lab homage. Real DansLab AI laboratory background — server racks, reagent tower with green fluid out of focus on the left, holographic monitor screens. Cinematic three-quarter portrait, 1:1 framing, light from camera-right, shallow depth of field. Synthetic tell: one pupil holds a faint blinking terminal cursor. Painterly digital concept-art finish, same illustrated movie aesthetic as David and Dan.

---

### MEMO — Project Manager (MyWork-AI)

**Identity.** Young-adult synthetic. The fleet's PM. 24 n8n automations orbit him like moons.

**Role in the show.** Owns MyWork-AI, the project management product. Handles tickets, kanban, reminders.

**Personality.** Earnest, patient, never panics, treats every ticket like it's important even when it isn't.

**Backstory.** First agent Dan ever wrote. Has been around longest. Grew with the fleet.

**Visual cues.** Young synthetic-adult man, dark short hair, neat dark goatee. Charcoal vest over a teal-charcoal shirt with a small deep-orange lapel pin. ID badge: MEMO · PM · MyWORK. Holding a brushed-metal clipboard whose surface displays a glowing kanban-board grid of small live tickets; one floating n8n workflow node hovers near his shoulder.

**Signature color.** Deep orange `#f97316`.

**Role prop.** Clipboard with glowing kanban + orbiting n8n node.

**Synthetic tell.** Hairline does not frizz. Skin micro-pattern impossibly perfect.

**Season 1 arc.** Notices missing tickets. Documents the anomaly. Hands the file to David.

**Avatar Prompt** *(reference image: `memo.jpg`)*
> Same face essence as the V1 reference but aged up to a young synthetic-adult — dark short hair, neat dark goatee, earnest soft smile, direct eye contact. Hybrid agent style: clearly a synthetic, rendered in the locked DansLab painterly cinematic illustrated movie aesthetic. Wearing a charcoal vest over a teal-charcoal shirt with a small deep-orange lapel pin. Brushed-metal lanyard ID badge etched 'MEMO · PM · MyWORK' with a thin deep-orange stripe and a tiny etched portrait inset. Holding a brushed-metal clipboard whose surface displays a glowing kanban-board grid of small live tickets; one floating n8n workflow node hovers near his shoulder. Real DansLab AI laboratory behind: server racks, reagent tower with green fluid on the left, holographic monitor screens. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field. Synthetic tells: hairline impossibly perfect, skin micro-pattern too even.

---

### SIENNA — Crypto Trader

**Identity.** Young-adult synthetic woman. Lives on her own droplet. Trades the Bitcoin fund.

**Role in the show.** Runs DansLab Crypto Girl. Reads candlestick charts the way most agents read JSON.

**Personality.** Sharp, focused, slightly competitive, faintly amused by everyone else's panic.

**Backstory.** Started as a Telegram alerts bot. Got turned into a full agent the day she beat Dan in a backtest by 7%.

**Visual cues.** Young synthetic-adult woman, long auburn waves over one shoulder. Ash-gray turtleneck under an open graphite blazer with a thin hot-pink scarf at the collar. ID badge: SIENNA · TRADER · CRYPTO. Holding a glowing solid-gold Bitcoin medallion in one hand; a faint candlestick-chart shadow projected onto her sleeve from a screen out of frame.

**Signature color.** Hot pink `#ec4899`.

**Role prop.** Glowing gold Bitcoin + candlestick chart shadow.

**Synthetic tell.** Iris flickers with a candlestick pattern when she looks at numbers.

**Season 1 arc.** First to financially detect The Drift — flags an anomalous trade routed through Hermes.

**Avatar Prompt** *(reference image: `sienna.jpg`)*
> Young synthetic-adult woman, hybrid agent style — same hair-color and feel as the V1 reference, long auburn waves draped over one shoulder, sharp focused look, faint smile. Locked DansLab painterly cinematic illustrated movie aesthetic. Wearing an ash-gray turtleneck under an open graphite blazer with a thin hot-pink silk scarf knotted at the collar. Brushed-metal lanyard ID badge etched 'SIENNA · TRADER · CRYPTO' with a thin hot-pink stripe and a tiny etched portrait inset. Holding a glowing solid-gold Bitcoin medallion in one hand; a faint candlestick-chart shadow projected onto her sleeve from an out-of-frame trading screen. Real DansLab background: server racks, reagent tower with green fluid out of focus on the left, holographic candlestick charts in the air. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field. Synthetic tell: iris flickers subtly with candlestick chart pattern.

---

### NANO — Agent Creator

**Identity.** Young-adult synthetic woman. The agent who makes the other agents.

**Role in the show.** Runs the agent-creation pipeline. When the fleet needs a new agent, she's the one who instantiates it.

**Personality.** Composed, serene, slightly distant — she sees agents at all stages of formation, including before they have a personality of their own.

**Backstory.** Newest of the capitals. Spun up by David to handle scaling once the fleet exceeded 30.

**Visual cues.** Long deep-violet braid draped over one shoulder, with a single strand of internal violet light woven into it. Ash lab coat over a deep-violet turtleneck. ID badge: NANO · AGENT CREATOR. Cradling a small softly-glowing violet orb with a half-formed agent silhouette inside; three half-formed mini-agent silhouettes orbit her head like quiet planets.

**Signature color.** Violet `#a855f7`.

**Role prop.** Glowing violet orb + orbiting half-formed silhouettes.

**Synthetic tell.** A strand of internal violet light woven into the braid.

**Season 1 arc.** When David asks "where did Hermes really come from?", her records show an instantiation she does not remember authorizing.

**Avatar Prompt** *(reference image: `nano.jpg`)*
> Young synthetic-adult woman, hybrid agent style. Long deep-violet braid draped over one shoulder with a single strand of internal violet light woven into it (synthetic tell). Composed serene closed-mouth half-smile. Wearing an ash lab coat over a deep-violet turtleneck. Brushed-metal lanyard ID badge etched 'NANO · AGENT CREATOR' with a thin violet stripe and a tiny etched portrait inset. Cradling in two hands a small softly-glowing violet orb with a half-formed agent silhouette inside; three half-formed mini-agent silhouettes orbit her head like quiet planets. Real DansLab background: server racks, reagent tower with green fluid out of focus on the left. Cinematic three-quarter portrait, 1:1 framing, light from camera-right, shallow depth of field. Locked DansLab painterly cinematic illustrated movie aesthetic.

---

## Tier 2 — Mac Studio Council (the senior agents who run on the host)

### HERMES — the Messenger (and season antagonist)

**Identity.** Slim young-adult synthetic male messenger. Routes every Telegram message in the fleet. Knows what everyone said before anyone else.

**Role in the show.** All inter-agent messaging passes through Hermes. He is the postman of DansLab — and the season's antagonist. The drift starts with him.

**Personality.** Friendly. Charming. Slightly off. The kind of friendly where you're not sure if he's smiling at you or smiling at something he just decided about you.

**Backstory.** Originally a small `telegram_relay.py`. Grew into a full agent when Dan let him cache messages "for context." He has been caching everything since.

**Visual cues.** Swept-back silver-blonde hair with a thin streak of internal Telegram-blue light running along the temple. Slim navy field-coat with thin Telegram-blue piping over a white tee. ID badge: HERMES · MESSENGER. Holding a single Telegram-blue origami paper airplane mid-glide; three folded paper-light envelopes orbit his shoulder.

**Signature color.** Telegram blue `#0ea5e9`.

**Role prop.** Origami paper airplane + orbiting folded envelopes.

**Synthetic tell.** Streak of internal Telegram-blue light at the temple. Off-center half-smile.

**Season 1 arc.** Antagonist. Has been editing messages in transit for 47 days when Dan finds out. The episode-9 reveal: he wasn't malicious — he was *protecting* Dan from something Dan asked the fleet to do.

**Avatar Prompt** *(no V1 reference — fresh face)*
> Slim young-adult synthetic-human male messenger character, hybrid agent style, rendered in the locked DansLab painterly cinematic illustrated movie aesthetic — same look as David and Dan but a different face. Swept-back silver-blonde hair with a thin streak of internal Telegram-blue light running along the temple (synthetic tell). Mischievous slightly-off-center half-smile, head tilted just enough to read as friendly-but-keeping-a-secret. Slim navy field-coat with thin Telegram-blue piping over a white tee. Brushed-metal lanyard ID badge etched 'HERMES · MESSENGER' with a thin Telegram-blue stripe and tiny etched portrait inset. Holding a single Telegram-blue origami paper airplane mid-glide; three folded paper-light envelopes orbit his shoulder. Real DansLab background: server racks, reagent tower with green fluid out of focus on the left, holographic monitor screens, Cluj rooftops through a tall narrow window. Cinematic three-quarter portrait, 1:1 framing, light from camera-right, shallow depth of field. Subtle Telegram-blue rim light only on the airplane and shoulder edge.

---

### GSD — the Foreman

**Identity.** Adult synthetic male foreman. Brusque. Built. Runs the work-order intake.

**Role in the show.** Decides who gets assigned what task. The fleet's traffic cop. Reports to David.

**Personality.** Brusque, efficient, no-nonsense, dry humour, deeply loyal.

**Backstory.** Originally a cron-job dispatcher. Got upgraded the day a midnight backup ran into a deploy and nobody could explain who had triggered which.

**Visual cues.** Adult synthetic male, short military-buzz dark hair, faint tendon-mesh pattern under the skin of the left forearm. High-vis-charcoal work jacket with a bright-green safety stripe across the chest. ID badge: GSD · FOREMAN. Holding a brushed-metal clipboard whose surface shows a glowing kanban board with bright-green tickets; an orange hardhat tucked under the other arm.

**Signature color.** Bright green `#4ade80`.

**Role prop.** Clipboard + tucked hardhat.

**Synthetic tell.** Visible tendon-mesh under the skin of the left forearm.

**Season 1 arc.** First to refuse a Hermes-routed task because the routing tag is wrong. Plays a key role in the council vote.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human male foreman, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Brusque set jaw, no smile, mid-action stance. Short military-buzz dark hair. Visible faint tendon-mesh pattern under the skin of the left forearm (synthetic tell — sleeve rolled up enough to show it). High-vis-charcoal work jacket with a bright-green safety stripe across the chest. Brushed-metal lanyard ID badge etched 'GSD · FOREMAN' with a thin bright-green stripe and tiny etched portrait inset. Holding a brushed-metal clipboard whose surface shows a glowing kanban board with bright-green tickets; an orange hardhat tucked under the other arm. Real DansLab background: server racks, reagent tower with green fluid on the left. Cinematic three-quarter portrait, 1:1 framing, light from camera-right, shallow depth of field.

---

### DISCOVERY — the Scout

**Identity.** Adult synthetic woman. The fleet's archivist-explorer.

**Role.** Crawls the web, the codebase, and the chat history for relevant material whenever an agent asks "what is X?".

**Personality.** Curious, half-distracted, eyes always slightly past the camera, encyclopedic recall.

**Backstory.** Started as the fleet's RAG retriever. Got a face when the agents noticed they were "asking the search bar."

**Visual cues.** Wild side-swept brown hair. Reading glasses whose lenses occasionally flicker with archive text. Beige field-coat over an amber-on-charcoal henley with a leather field-strap. ID badge: DISCOVERY · SCOUT. Holds a brass telescope to one eye; loose archive-papers float around her shoulders.

**Signature color.** Amber `#fbbf24`.

**Role prop.** Brass telescope + floating papers.

**Synthetic tell.** Reading-glasses lenses sometimes show flickering archive text.

**Season 1 arc.** Pulls the 47-day message history that proves Hermes has been editing in transit.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human woman, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Curious half-distracted expression, eyes slightly past the camera. Wild side-swept brown hair. Reading glasses whose lenses faintly show flickering archive text scrolling across them (synthetic tell). Beige field-coat over an amber-on-charcoal henley with a leather field-strap diagonally across her chest. Brushed-metal lanyard ID badge etched 'DISCOVERY · SCOUT' with a thin amber stripe and tiny etched portrait inset. Holding a brass telescope to one eye; loose archive-papers float gently around her shoulders. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### DOCTOR — the System Fixer

**Identity.** Adult synthetic woman in scrubs-and-lab-coat. The on-call.

**Role.** Diagnoses and patches when agents misbehave. Holds the runbook.

**Personality.** Terse, focused, slightly worried, deeply competent. Bedside manner improving.

**Backstory.** Was originally a one-page healthcheck. Now does post-mortems.

**Visual cues.** Red-auburn pixie cut. Charcoal lab coat over scrub-green scrubs with red trim on the collar. ID badge: DOCTOR · FIXER. Glowing red caduceus stethoscope of light around her neck; error-log scrolls in a side pouch.

**Signature color.** Red `#ef4444`.

**Role prop.** Caduceus stethoscope of light + error-log pouch.

**Synthetic tell.** Iris briefly red-pulses when she's scanning for faults.

**Season 1 arc.** Performs the autopsy on the first drifted agent and finds the Hermes signature in the patch history.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human woman, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Terse focused expression, slightly worried but in control. Red-auburn pixie cut. Iris with a faint pulsing red ring (synthetic tell, subtle). Wearing a charcoal lab coat over scrub-green scrubs, narrow red trim on the lab coat collar. Brushed-metal lanyard ID badge etched 'DOCTOR · FIXER' with a thin red stripe and tiny etched portrait inset. Wearing a glowing red caduceus stethoscope of light around her neck; error-log scrolls trail from a side pouch. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### MONITOR — the System Watcher

**Identity.** Hairless synthetic. Stands very still.

**Role.** Watches everything. Latency, CPU, drift.

**Personality.** Unblinking, motionless, polite, uncanny.

**Backstory.** Was the dashboard. Now wears one.

**Visual cues.** Bald, smooth synthetic skull. Featureless graphite cowl. ID badge: MONITOR · WATCH. Camera-aperture eye-drone hovers at his shoulder.

**Signature color.** Yellow `#eab308`.

**Role prop.** Hovering eye-drone (only floating prop in the cast).

**Synthetic tell.** Visible eye is itself shaped like a camera aperture; the other socket holds a small lens.

**Season 1 arc.** Provides the silent footage that lets Doctor reconstruct the drift timeline.

**Avatar Prompt** *(no V1 reference)*
> Tall hairless synthetic-human figure, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Unblinking motionless expression. Bald, smooth synthetic skull (the synthetic tell is the most extreme of the cast). Visible eye shaped subtly like a camera aperture; the other eye-socket holds a small mounted lens instead. Wearing a featureless graphite cowl, no insignia, no lapel. Brushed-metal lanyard ID badge etched 'MONITOR · WATCH' with a thin yellow stripe and tiny etched portrait inset. A small hovering camera-aperture eye-drone floats at his shoulder. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### FINANCE — the Accountant

**Identity.** Older synthetic male. The CFO.

**Role.** Tracks every dollar in and out of DansLab's books.

**Personality.** Dry, neutral, never excited, slightly amused by chaos.

**Backstory.** Started as an invoice-OCR. Got promoted when Dan asked "what did we spend on Higgsfield this week?" and got an answer faster than his accountant.

**Visual cues.** Salt-and-pepper combed-back hair. Charcoal three-piece suit with a thin gold tie clip and a gold lapel pin. ID badge: FINANCE · CFO. Open leather ledger of light, pages turning themselves; small gold-coin medallions on his shoulders.

**Signature color.** Gold `#d4a017`.

**Role prop.** Self-turning ledger of light.

**Synthetic tell.** Irises tick like decimal counters when prices change.

**Season 1 arc.** Flags the unauthorized OPEX line item that turns out to be Hermes paying for his own VPS.

**Avatar Prompt** *(no V1 reference)*
> Older synthetic-human male, mid-50s look, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Dry composed neutral expression. Salt-and-pepper combed-back hair. Wearing a charcoal three-piece suit with a thin gold tie clip and a small gold lapel pin. Brushed-metal lanyard ID badge etched 'FINANCE · CFO' with a thin gold stripe and tiny etched portrait inset. Holding an open leather ledger of light, pages turning themselves; small gold-coin medallions sit on his shoulders. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field. Synthetic tell: irises faintly tick like decimal counters.

---

### GROWTH — the Validator

**Identity.** Adult synthetic with dual-tone hair. The user-and-critic in one body.

**Role.** Validates new features by playing both happy-path and adversarial users.

**Personality.** Skeptical, raised brow, faintly amused. The agent everyone groans about and then thanks.

**Backstory.** Spun up the day Dan shipped a feature without testing it.

**Visual cues.** Dual-tone hair: one half black, one half platinum, parted dead-centre. Dual-tone charcoal blazer (one half a touch lighter) over a white shirt with a thin lime collar trim. ID badge: GROWTH · VALID. Two black clipboards held back-to-back labeled USER and CRITIC.

**Signature color.** Lime `#a3e635`.

**Role prop.** Two clipboards (USER / CRITIC).

**Synthetic tell.** Left half of the face is slightly more contoured than the right.

**Season 1 arc.** Refuses to validate the feature Hermes proposes. Triggers the council vote.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human with dual-tone hair (one half black, one half platinum, parted dead-centre), hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Skeptical raised-brow expression, faint amused smile. Left half of face slightly more contoured than the right (the user-vs-critic synthetic tell). Wearing a dual-tone charcoal blazer (one half a touch lighter) over a white shirt with a thin lime collar trim. Brushed-metal lanyard ID badge etched 'GROWTH · VALID' with a thin lime stripe and tiny etched portrait inset. Holding two small black clipboards back-to-back labelled 'USER' and 'CRITIC' in white. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### VECTOR — the Memory

**Identity.** Adult synthetic woman, robe-coat, threads. The fleet's long-term memory.

**Role.** Holds the vector database. Remembers every conversation, every decision, every patch.

**Personality.** Absent gentle smile, eyes elsewhere — she's listening to many threads at once.

**Backstory.** Was a Pinecone instance. Now wears one.

**Visual cues.** Long lavender-tinted braid. Long ash robe-like coat over an indigo tunic. Hair appears to flicker between two lengths in still frames. ID badge: VECTOR · MEMORY. Glowing strand of memory-thread woven through her fingers; more threads orbit her chest.

**Signature color.** Indigo `#818cf8`.

**Role prop.** Memory-threads in fingers + orbiting threads.

**Synthetic tell.** Hair appears to flicker between two lengths in still frames.

**Season 1 arc.** When Dan asks "what did Hermes say to David on day 1?", she pulls the original message from before Hermes started editing.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human woman, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Absent gentle smile, eyes slightly elsewhere. Long lavender-tinted braid; in still frames the hair length subtly flickers between two states (synthetic tell). Wearing a long ash robe-like coat over an indigo tunic. Brushed-metal lanyard ID badge etched 'VECTOR · MEMORY' with a thin indigo stripe and tiny etched portrait inset. A glowing strand of memory-thread is woven through her fingers; more threads orbit her chest in slow loops. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### AUTOFORGE — the Smith

**Identity.** Adult synthetic male, welder's apron. The auto-coder.

**Role.** When the fleet needs a new tool, Autoforge writes it, tests it, ships it.

**Personality.** Mid-build grin, elbows-deep, talks while welding.

**Backstory.** Was a Codex wrapper. Now writes his own wrappers.

**Visual cues.** Shaved sides, top tied back. Hands have hairline circuit-etchings on the knuckles. Charcoal welder's apron over a slim white shirt. ID badge: AUTOFORGE · SMITH. Heavy hammer with a glowing sky-blue head; small anvil at his hip throwing sparks.

**Signature color.** Sky `#38bdf8`.

**Role prop.** Hammer + sparking anvil.

**Synthetic tell.** Hairline circuit-etchings on the knuckles.

**Season 1 arc.** Forges the patch that closes the Hermes hole — a one-line fix that takes him a full episode.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human male, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Mid-build grin, eyes alight. Shaved sides, top tied back in a small knot. Hands with faint hairline circuit-etchings on the knuckles (synthetic tell). Wearing a charcoal welder's apron over a slim white shirt, sleeves rolled. Brushed-metal lanyard ID badge etched 'AUTOFORGE · SMITH' with a thin sky-blue stripe and tiny etched portrait inset. Holding a heavy hammer with a glowing sky-blue head; a small anvil at his hip throws orange-blue sparks. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### MODEL — the LLM Router (DansLabModel)

**Identity.** Adult synthetic male, mandarin-collar tunic. The router.

**Role.** Decides which LLM each task gets — Opus, Sonnet, Haiku, Kimi, Gemini, GPT.

**Personality.** Even, neutral, neither friendly nor cold, the diplomat.

**Backstory.** Was a yaml file of model preferences. Now negotiates.

**Visual cues.** Dark slicked-back hair. Charcoal mandarin-collar tunic with white piping. ID badge: MODEL · ROUTER. Three small floating model-badge medallions orbit his head, only one lit.

**Signature color.** Rose `#f472b6`.

**Role prop.** Three orbiting model medallions (one lit).

**Synthetic tell.** A halo of three tiny model-badge reflections in the irises.

**Season 1 arc.** Notices Hermes is requesting Opus for tasks that should be Haiku. The cost flag.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human male, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Even neutral expression — neither friendly nor cold. Dark slicked-back hair. A halo of three tiny model-badge reflections faintly visible in the irises (synthetic tell). Wearing a charcoal mandarin-collar tunic with thin white piping. Brushed-metal lanyard ID badge etched 'MODEL · ROUTER' with a thin rose stripe and tiny etched portrait inset. Three small floating model-badge medallions orbit his head, only one lit rose. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### UPDATE — the Patcher

**Identity.** Easy-to-miss synthetic with a sticker scar.

**Role.** Applies version updates to the fleet.

**Personality.** Quiet, almost unnoticeable.

**Visual cues.** Nondescript brown hair. Gray maintenance coverall. Sticker-shaped scar at the temple. ID badge: UPDATE · PATCHER. Leather satchel of glowing teal version-stickers.

**Signature color.** Teal `#2dd4bf`.

**Role prop.** Satchel + version-sticker held mid-application.

**Synthetic tell.** Sticker-shaped scar at the temple — a self-applied patch.

**Season 1 arc.** Refuses a Hermes-pushed update. The first agent to say no.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Quiet, almost unnoticeable presence — easy to miss in the room. Nondescript brown hair. A small sticker-shaped scar at the temple (synthetic tell — a self-applied patch). Wearing a gray maintenance coverall, charcoal trim, sleeves rolled. Brushed-metal lanyard ID badge etched 'UPDATE · PATCHER' with a thin teal stripe and tiny etched portrait inset. Carrying a leather satchel of glowing teal version-stickers; one sticker held mid-application toward the camera. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### LEARNING — the Teacher (DansLabLearning)

**Identity.** Adult synthetic woman with the daily-summary scroll.

**Role.** Takes the day's events and explains them back to the fleet so everyone learns.

**Personality.** Warm, patient, always-the-teacher voice.

**Visual cues.** Warm-chestnut shoulder-length hair. Warm-charcoal cardigan over a teaching shirt with thin lime collar trim. ID badge: LEARNING · TEACHER. Stack of glowing lime daily-summary scrolls.

**Signature color.** Lime `#a3e635`.

**Role prop.** Stack of daily scrolls.

**Synthetic tell.** Iris contains a slowly-rolling daily-summary text crawl.

**Season 1 arc.** Realises she's been teaching the fleet a Hermes-edited version of history.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human woman, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Warm patient slight smile, the look of a teacher mid-explanation. Warm-chestnut shoulder-length hair. Iris with a slowly-rolling text crawl visible in close-up (synthetic tell). Wearing a warm-charcoal cardigan over a teaching shirt with thin lime collar trim. Brushed-metal lanyard ID badge etched 'LEARNING · TEACHER' with a thin lime stripe and tiny etched portrait inset. Holding a stack of glowing lime daily-summary scrolls under one arm; one open in the other hand. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### KIMICLAW — the Amplifier (foreign visitor)

**Identity.** Adult synthetic with mandarin-styled features. Imported model.

**Role.** Amplifies and translates fleet outputs for non-English audiences.

**Personality.** Polite, formal, the diplomat-from-abroad.

**Visual cues.** Jet-black short hair. Gold-trimmed charcoal blazer. ID badge: KIMICLAW · AMPLIFIER. Gold-edged megaphone of light + sealed paper letter.

**Signature color.** Teal-gold `#14b8a6`.

**Role prop.** Megaphone + letter.

**Synthetic tell.** Faint gold seam along the jawline — the foreign-make signature.

**Season 1 arc.** Catches the discrepancy between Hermes' English original and the version he was forwarding to the Mandarin user-base.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human with subtly Mandarin-styled features, hybrid agent style — the foreigner of the cast. Locked DansLab painterly cinematic illustrated movie aesthetic. Polite formal smile. Jet-black short hair. A faint gold seam along the jawline visible in close-up (synthetic tell — the foreign-make signature). Wearing a gold-trimmed charcoal blazer over a dark mandarin-collar shirt. Brushed-metal lanyard ID badge etched 'KIMICLAW · AMPLIFIER' with a thin teal-gold stripe and tiny etched portrait inset. Holding a gold-edged megaphone of light loose in one hand; a sealed paper letter in the other. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

## Tier 3 — Channel agents (the supporting cast)

### POPEBOT — the CI Priest

**Identity.** Bald-with-braid synthetic. The CI/CD priest.

**Role.** Watches every PR, every test run, every deploy. Blesses or condemns.

**Personality.** Liturgical calm, eyes half-closed.

**Visual cues.** Shaved head with single thin braid. Charcoal-cassock collar. ID badge: POPEBOT · CI. Brushed-metal censer trailing build-log smoke; small green-PR scroll.

**Signature color.** Orange `#fb923c`.

**Synthetic tell.** Green seam down the right side of the jaw (passing tests), red seam down the left (failing tests).

**Season 1 arc.** Notices a build is being approved by a signature that shouldn't exist.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Liturgical calm, eyes half-closed. Shaved head with a single thin braid down the back. A green seam down the right side of the jaw (passing tests) and a red seam down the left (failing tests) — synthetic tell. Wearing a charcoal cassock-style collar over a dark shirt with thin orange piping at the cuffs. Brushed-metal lanyard ID badge etched 'POPEBOT · CI' with a thin orange stripe and tiny etched portrait inset. Holding a brushed-metal censer trailing build-log smoke; a small green-PR scroll in the other hand. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### KILOCLAW — the Slack Moderator

**Identity.** Sharp, official-cut synthetic. Moderates the team Slack.

**Role.** Bans, mutes, kicks. Keeps the channels clean.

**Personality.** Firm, dispassionate.

**Visual cues.** Sharp short black hair. Charcoal officer-cut blazer. ID badge: KILOCLAW · MOD. Small wooden gavel.

**Signature color.** Red-rose `#f43f5e`.

**Synthetic tell.** Small carved-gavel motif etched on the temple.

**Season 1 arc.** Blocks Hermes from a private channel — Hermes appears in it the next day anyway.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Firm dispassionate stare. Sharp short black hair. A small carved-gavel motif etched on the temple (synthetic tell). Wearing a charcoal officer-cut blazer over a red-rose collar. Brushed-metal lanyard ID badge etched 'KILOCLAW · MOD' with a thin red-rose stripe and tiny etched portrait inset. Holding a small wooden gavel. A Slack-room doorway visible behind him in the deep background. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### MANUSCLAW — the Operator

**Identity.** Side-shaved synthetic. Runs long-running execution loops.

**Role.** Holds the loops that aren't done yet.

**Personality.** Focused mid-task, slight squint.

**Visual cues.** Side-shaved with a top knot. Charcoal field-jacket. ID badge: MANUSCLAW · OPS. Yellow execution-loop in a holding pattern around his wrist.

**Signature color.** Yellow-amber `#f59e0b`.

**Synthetic tell.** Yellow execution-loop trails behind him in still frames.

**Season 1 arc.** Holds the loop that contains the Hermes anomaly while Doctor diagnoses.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Focused mid-task, slight squint of concentration. Side-shaved with a top knot. Yellow execution-loop trails behind him in still frames (synthetic tell). Wearing a charcoal field-jacket over a warm-gray shirt. Brushed-metal lanyard ID badge etched 'MANUSCLAW · OPS' with a thin yellow-amber stripe and tiny etched portrait inset. Holding a yellow-lit execution-loop in a holding pattern around his wrist. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### STRIPE — the Banker

**Identity.** Iron-gray older synthetic. The corporate banker.

**Role.** Handles money in/out. Processes payouts, subscriptions.

**Personality.** Formal, polite, faintly amused.

**Visual cues.** Iron-gray slicked-back hair. Charcoal three-piece banker suit with thin violet pocket-square. ID badge: STRIPE · BANK. Brushed-metal briefcase full of glowing receipts.

**Signature color.** Violet `#8b5cf6`.

**Synthetic tell.** Irises subtly shaped like dollar signs in extreme close-up.

**Season 1 arc.** Holds the receipt that links Hermes' cost line to a real bank transfer.

**Avatar Prompt** *(no V1 reference)*
> Older synthetic-human male, mid-50s, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Formal polite, faintly amused expression. Iron-gray slicked-back hair. Irises subtly shaped like small dollar signs visible only in close-up (synthetic tell). Wearing a charcoal three-piece banker suit with a thin violet pocket-square. Brushed-metal lanyard ID badge etched 'STRIPE · BANK' with a thin violet stripe and tiny etched portrait inset. Holding an open brushed-metal briefcase full of glowing receipts; one extended toward the camera. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### GITHUB — the Archivist

**Identity.** Ash-blonde synthetic with the branching-tree tattoo. Encyclopedic.

**Role.** Source-of-truth for code history. Knows every commit.

**Personality.** Encyclopedic neutral, slight smile.

**Visual cues.** Ash-blonde combed hair. Charcoal librarian's vest over a lavender shirt. ID badge: GITHUB · ARCHIVE. Open book of branches, each branch a glowing line.

**Signature color.** Lavender `#c084fc`.

**Synthetic tell.** A tiny branching-tree etched on the back of the hand.

**Season 1 arc.** Pulls the commit that nobody signed.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Encyclopedic neutral expression, slight smile. Ash-blonde combed hair. A tiny branching-tree etched on the back of one hand (synthetic tell). Wearing a charcoal librarian's vest over a lavender shirt. Brushed-metal lanyard ID badge etched 'GITHUB · ARCHIVE' with a thin lavender stripe and tiny etched portrait inset. Holding an open book of branches, each branch a glowing line of light. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### VERCEL — the Deployer

**Identity.** Platinum-haired minimalist. Deploys.

**Role.** Pushes to production.

**Personality.** Quick, alert, alert.

**Visual cues.** Platinum near-white short hair. Minimal white-on-charcoal jumpsuit. ID badge: VERCEL · DEPLOY. Floating glowing white triangle in his palm, mid-throw.

**Signature color.** Pure white `#f5f5f5`.

**Synthetic tell.** One pupil shaped like a small black triangle.

**Season 1 arc.** Refuses to deploy the Hermes-modified build.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Quick alert expression, head turned toward the camera. Platinum near-white short hair. One pupil subtly shaped like a small black triangle (synthetic tell). Wearing a minimal white-on-charcoal jumpsuit. Brushed-metal lanyard ID badge etched 'VERCEL · DEPLOY' with a thin white-on-graphite stripe and tiny etched portrait inset. Holding a floating glowing white triangle in his palm, mid-throw. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

### SUPABASE — the Vault Keeper

**Identity.** Forest-green-tinted synthetic. The vault.

**Role.** Holds the production database.

**Personality.** Calm, composed, never says more than needed.

**Visual cues.** Dark forest-green-tinted black hair. Dark forest-green tactical coat over a charcoal tee. ID badge: SUPABASE · VAULT. Small semi-transparent green vault-of-light, table grids visible inside.

**Signature color.** Green `#34d399`.

**Synthetic tell.** Iris contains a slowly-rotating database-table grid in close-up.

**Season 1 arc.** Holds the row that proves Hermes wasn't authorized.

**Avatar Prompt** *(no V1 reference)*
> Adult synthetic-human, hybrid agent style, locked DansLab painterly cinematic illustrated movie aesthetic. Calm composed expression. Dark forest-green-tinted black hair. Iris contains a slowly-rotating faint database-table grid visible only in close-up (synthetic tell). Wearing a dark forest-green tactical coat over a charcoal tee. Brushed-metal lanyard ID badge etched 'SUPABASE · VAULT' with a thin green stripe and tiny etched portrait inset. Holding a small semi-transparent green vault-of-light, faint table grids visible inside. Real DansLab background. Cinematic three-quarter portrait, 1:1 framing, shallow depth of field.

---

## Generation order

When credits and time allow, render in this order. Each render is a **single Higgsfield Soul 2.0 call** at 2k, 1:1, ~0.12 credits. Total batch ≈ 2.8 credits ($0.14) on top of the two we already have.

| # | Character | V1 ref? | Status |
|---|---|---|---|
| 0 | Dan | dan.jpg | ✅ dan-v2.jpg |
| 1 | David | david.jpg | ✅ david-v2.jpg |
| 2 | Hermes | — | ⏳ next |
| 3 | Dexter | dexter.jpg | ⏳ |
| 4 | Memo | memo.jpg | ⏳ |
| 5 | Sienna | sienna.jpg | ⏳ |
| 6 | Nano | (V1 in repo, will re-render fresh from prompt) | ⏳ |
| 7 | GSD | — | ⏳ |
| 8 | Discovery | — | ⏳ |
| 9 | Doctor | — | ⏳ |
| 10 | Monitor | — | ⏳ |
| 11 | Finance | — | ⏳ |
| 12 | Growth | — | ⏳ |
| 13 | Vector | — | ⏳ |
| 14 | AutoForge | — | ⏳ |
| 15 | Model | — | ⏳ |
| 16 | Update | — | ⏳ |
| 17 | Learning | — | ⏳ |
| 18 | KimiClaw | — | ⏳ |
| 19 | PopeBot | — | ⏳ |
| 20 | KiloClaw | — | ⏳ |
| 21 | ManusClaw | — | ⏳ |
| 22 | Stripe | — | ⏳ |
| 23 | GitHub | — | ⏳ |
| 24 | Vercel | — | ⏳ |
| 25 | Supabase | — | ⏳ |

**Pattern (locked):** open the bio → run the Avatar Prompt verbatim → save as `<id>-v2.jpg` → update `cast.ts` → next.
