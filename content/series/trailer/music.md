# DansLab AI Chronicles — Trailer Music & Sound Brief

3:00 mystery-thriller cut. Score is one custom track in three movements with a deliberate dropout. Sound design is sparse, mechanical, and built from real lab elements where possible.

## Reference cocktail

- **Mr. Robot — Mac Quayle** (the show's score is the gold standard for this cut)
- **Severance — Theodore Shapiro** (cold, deliberate, slightly off)
- **The Social Network — Trent Reznor & Atticus Ross** (mechanical builds, founder-loneliness)
- **Black Mirror trailer scoring** (Hans Zimmer's *Bagatella* family — taut, relentless)
- One specific cue: **Mr. Robot Vol. 1 · "I Am Mr. Robot"** for the cold-open energy

## Three movements + the dropout

| TC | Movement | BPM | Mood | Instrumentation |
|---|---|---|---|---|
| 0:00–1:10 | **I. The Plant** | 70 | Lonely, deliberate, low-frequency dread | Sub-bass drone in low E, single piano note hits on title burns, Mac Studio fan hum bed underneath the entire movement |
| 1:10–1:40 | **II. The Question** | 70→stop | Quiet, intimate, paranoid | Piano alone, no bass, room tone. Score *stops completely* at 1:36 for four seconds of pure room tone before Brian's whisper |
| 1:40–2:30 | **III. The Conspiracy & Climax** | 110 | Tense, mechanical, escalating | Drum machine pulse, layered synth arps in minor third, brass-string stab on every title burn, processed Telegram-bell as a rhythmic element. Builds to 2:30 |
| 2:30–2:40 | **IV. The Dropout** | — | Silence + room tone | Mac Studio fan wind-down. No music. This is the negative space the final question lives in |
| 2:40–3:00 | **V. The Final Question** | 60 | Cold, sustained, unresolved | One sustained low piano chord (D minor add9) under Dan's Romanian line, decays to silence under the **WHO'S REALLY RUNNING IT?** title |

## Sound-design palette (non-music)

Built from **real lab elements** where possible. Source material is Dan's apartment, not a Foley library.

| Cue | Source | Treatment | Used at |
|---|---|---|---|
| `mac-fan-hum` | Mac Studio fan, recorded close | Looped, low-passed at 200 Hz | Bed under acts 1, 2, 5, 8 |
| `mac-fan-windup` | Mac Studio booting | Used clean | 0:15 (Dan sits down) |
| `mac-fan-winddown` | Mac Studio shutdown | Used clean, panned center | 2:30 (the dropout) |
| `telegram-bell` | Real Telegram desktop notification | Stretched 3×, pitched -2 semitones | 0:20, 1:54, 2:00 |
| `terminal-clack` | Mechanical keyboard, single keystroke | Used as title-burn punctuation | 0:08, 0:23, 0:43, 1:33, 2:05, 2:08, 2:55, 2:58 |
| `paper-fold` | Real paper airplane being folded | Layered with `brass-bell` | Every Hermes logo unfold |
| `claw-clack` | Plastic clack ×2 | Tight, dry | Every OpenClaw lobster claw snap |
| `glass-resonance` | Tap on a glass beaker | Pitched up to a high D | Money frame at 0:55 |
| `static-jitter` | Old CRT interference loop | Panned random | Title burns 30, 31 |
| `room-tone` | Cluj apartment loft, no HVAC | Continuous bed | Always present, -32 dB |

## Mix targets

- **Brian VO**: -8 dB peak, -16 LUFS bed
- **Dan Romanian line**: -6 dB peak (one notch hotter — it's the personal line)
- **Music bed**: -18 LUFS, ducks 6 dB under VO
- **Sound design hits**: -12 dB peak each
- **Final master**: -14 LUFS integrated, -1 dBFS true peak (YouTube target)

## Stems to deliver to the editor

1. `score-mvmt-I.wav` — 70 BPM bed, 0:00–1:10
2. `score-mvmt-II.wav` — piano-only, 1:10–1:40 with the silence baked in
3. `score-mvmt-III.wav` — 110 BPM build, 1:40–2:30
4. `score-mvmt-V.wav` — D-minor add9 sustained chord, 2:40–3:00
5. `sfx-pack.zip` — every cue above as a separate WAV
6. `vo-brian-en.wav` — Brian master VO from ElevenLabs
7. `vo-brian-en-whispers.wav` — separate whisper passes, pre-stacked at -8 dB
8. `vo-dan-ro.wav` — Dan's Romanian line, raw + cleaned

## Where the music makes the mystery

The dropout from 2:30 to 2:40 is the most important music decision in the cut. **Ten seconds of silence over the Mac Studio fan windown** is what makes "...if it's even possible" land. We spent the previous 2:30 stacking sound; this is where we admit the trick.

The final movement's chord — D minor add9 — never resolves. It sits there under the question and never moves. The audience leaves with an unfinished feeling because the chord is unfinished.
