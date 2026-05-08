import fs from "node:fs";
import path from "node:path";
import { agentMap } from "@/components/ecosystem/data/agents";
import PageWrapper from "@/components/PageWrapper";
import TeamGallery, { type TeamMember, type Variant } from "@/components/team/TeamGallery";

// Casting overrides: characters in the series (CASTING.md / PAPERCLIP_ROSTER.md)
// that aren't in the operational ecosystem agents.ts.
const SERIES_ONLY: Record<
  string,
  { name: string; role: string; description: string; color: string; tier: TeamMember["tier"] }
> = {
  discovery: {
    name: "Discovery",
    role: "The Scout",
    description:
      "Weekly opportunity ping. Cold-open archetype — appears with a paper in hand and a half-finished thought.",
    color: "#fbbf24",
    tier: "council",
  },
  finance: {
    name: "Finance",
    role: "The Accountant",
    description:
      "Weekly Monday reports. Reads MRR, CAC, and runway as if reciting verse.",
    color: "#d4a017",
    tier: "council",
  },
  growth: {
    name: "Growth",
    role: "The Validator",
    description:
      "Validates every new agent before they ship. Two clipboards, never the same answer on both.",
    color: "#a3e635",
    tier: "council",
  },
  popebot: {
    name: "ThePopeBot",
    role: "CI Priest",
    description:
      "Autonomous GitHub Actions worker. Blesses every PR. Cron + webhook triggers.",
    color: "#fb923c",
    tier: "channel",
  },
  macstudio: {
    name: "Mac Studio",
    role: "Central Hub",
    description:
      "Dan's Mac Studio — runs David, Qwen 3.5 local, Codex & Claude Code. The room every council scene happens in.",
    color: "#a1a1aa",
    tier: "infra",
  },
};

// Filename slug → ecosystem agentMap key (covers spelling differences).
const AGENT_ALIAS: Record<string, string> = { popebot: "pope" };

// Operational tier from agents.ts → series tier.
const TYPE_TO_TIER: Record<string, TeamMember["tier"]> = {
  main: "capital",
  support: "council",
  infra: "infra",
  channel: "channel",
  slack: "channel",
};

// Override per-agent tier where the show-side disagrees with the ops side.
const TIER_OVERRIDE: Record<string, TeamMember["tier"]> = {
  dan: "human",
  david: "council",
  hermes: "council",
  monitor: "council",
  paperclip: "council",
  obsidian: "council",
  // Capitals
  dexter: "capital",
  memo: "capital",
  sienna: "capital",
  nano: "capital",
  // OpenClaw pod = pod
  "openclaw-1": "pod",
  "openclaw-2": "pod",
  "openclaw-3": "pod",
  "openclaw-4": "pod",
  manusclaw: "pod",
  kimiclaw: "pod",
  kiloclaw: "channel",
};

function readTeam(): TeamMember[] {
  const dir = path.join(process.cwd(), "public", "series", "characters");
  const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  return files
    .map<TeamMember>((file) => {
      const slug = file.replace(/\.(jpe?g|png|webp)$/i, "");
      let variant: Variant = "v1";
      let agentKey = slug;
      if (slug.endsWith("-v2")) {
        variant = "v2";
        agentKey = slug.slice(0, -3);
      } else if (slug.endsWith("-source")) {
        variant = "source";
        agentKey = slug.slice(0, -7);
      }
      const aliasKey = AGENT_ALIAS[agentKey] ?? agentKey;
      const agent = agentMap.get(aliasKey);
      const fallback = SERIES_ONLY[agentKey];
      const name = agent?.name ?? fallback?.name ?? agentKey;
      const role = agent?.role ?? fallback?.role ?? "—";
      const description =
        fallback?.description ?? agent?.description ?? "Reference render.";
      const color = agent?.color ?? fallback?.color ?? "#c0392b";
      const tier =
        TIER_OVERRIDE[agentKey] ??
        fallback?.tier ??
        (agent ? TYPE_TO_TIER[agent.type] : "council");
      return { file, agentKey, variant, src: `/series/characters/${file}`, name, role, description, color, tier };
    })
    .sort((a, b) => a.name.localeCompare(b.name) || a.variant.localeCompare(b.variant));
}

export default function TeamPage() {
  const team = readTeam();
  return (
    <PageWrapper>
      <TeamGallery team={team} />
    </PageWrapper>
  );
}
