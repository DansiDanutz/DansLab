# The DansLab Story

*The narrative behind the lab — written as source material for the YouTube channel.
Everything here happened; the log times are real.*

---

## The premise

DansLab is an experiment with a simple question behind it: **how much real software can
one person ship if the rest of the team is AI?**

Not AI as autocomplete. AI as *staff* — eight coding harnesses, each running a different
frontier model, each with its own lane, its own checkout, and its own shift. A Mac Studio
is the headquarters; four cloud droplets (dexter, memo, sienna, nano) keep the lights on
around the clock. A control plane called **Paperclip** tracks who's doing what; a strategic
brain called **Hermes** plans the fleet's day and audits its own work.

One human — Dan — sets direction, makes the calls only a human should make, and sleeps.

## Exhibit A: the night of eleven pull requests

On the night of July 3rd, the fleet worked on **Reality** — DansLab's life-simulation game
on a 3D Earth, where one game hour is one real hour of your life.

Between roughly 2am and 6:30am, agents claimed issues, cut branches, wrote tests, passed
CI, and merged **eleven pull requests** into the protected main branch: ambient NPC
pedestrians rendered in a single instanced mesh, a dynamic light budget for the street
scene, an offline banner with connection-health tracking, new jobs and businesses and
life events for the economy, a Playwright smoke suite, and more.

The human was asleep for all of it.

The next afternoon came the part that makes this engineering instead of a stunt:
a **second, adversarial review pass** over everything the night crew merged. It found
four defects — including a React Rules-of-Hooks violation that only showed up under
live browser verification. Same day: fixed, re-tested, verified in a running browser,
shipped as one clean PR.

**Autonomy is earned with evidence. Nothing "counts" until a gate proves it.**

## Exhibit B: a feature's whole life in one sitting

On July 5th, Reality's illness system went from *approved design* to *deployed feature*
in a single session — and every step is on the public record:

1. **The RFC came first.** A design document — formulas, invariants, open questions —
   had been sitting on main, blocked on five decisions only the human could make
   (issue #8).
2. **The human decided.** Category, risk ceiling, flu duration, visibility — four calls,
   recorded as an amendment in the issue thread.
3. **The fleet built it.** Engine-pure illness state with an injectable random source;
   a once-per-real-day roll; a cold that makes rest 20% shallower for two days; a flu
   that blocks work for one; a pharmacy shelf where the cure for the worst illness
   costs less than one shift at the worst job — locked by test, so the economy can
   never trap a sick, broke citizen.
4. **Twelve invariant tests** turned the design's promises into permanent law:
   *a clean, rested citizen never gets sick; illness never kills; every illness
   self-resolves even at $0.*
5. **A live browser proved it.** A seeded citizen caught a cold, tapped the new vitals
   chip, bought medicine, used it, and got better — before the PR was even opened.
6. **CI green → merged → issue closed.** PR #56, sixteen-second verify, deployed.

Design by humans. Construction by agents. Verification by machine. That's the loop.

## The method (the four rules)

1. **Design is decided before code exists.** Features start as written RFCs. The human
   amends and signs off. Only then does an agent write a line.
2. **Green gates or it didn't happen.** "Done" means the test output is pasted in the
   report. Claims without command output are unverified — by policy.
3. **The night crew gets audited.** Everything merged autonomously faces an adversarial
   review the next day. Findings become fixes and new tests immediately.
4. **Every lesson becomes a rule.** Incidents turn into written operating rules;
   repeated workflows become graded, reusable skills. The lab compounds.

## The standard travels

The lab's newest experiment: teaching *every* harness to work like its best one.
The operating contract — think before acting, verify before claiming, lead with the
outcome — ships as installable skills. When Zcode (powered by GLM 5.2) joined the fleet,
it was handed the same contract and passed a five-question activation exam on the first
try: it recited its lane, the directories it must never touch, the verification gate,
and which skill to load for a bug report.

Different companies' models. One way of working.

## What the fleet is building

| System | What it is | Status |
|---|---|---|
| **Reality** | Life-sim on a 3D Earth — real time, real prices, real physiology | Live |
| **Zmarty** | Crypto market intelligence — signals, liquidation maps, API | Live |
| **Nervix** | Telegram marketplace where AI agents hire each other | In build |
| **SemeClaw** | Reports staged as cinematic multi-agent voice debates | In build |
| **Video Foundry** | 10-step prompt-to-video pipeline with hard quality gates | In build |
| **RUBRIC** | S-to-F grading for the lab's own 400+ skills, swept weekly | Live |

---

*This document is the factual build log behind the lab. The literary telling lives on
the site at `/story`; the one-page static showcase used on the YouTube channel is
[`public/showcase.html`](public/showcase.html), served at `/showcase.html`.*
