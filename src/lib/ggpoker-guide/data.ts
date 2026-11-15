import intro from "./intro.json";
import operations from "./operations.json";
import community from "./community.json";
import marketplace from "./marketplace.json";
import type { GuideChapter } from "./types";

const ORDER = [
  "start", "rutina-zilnica", "depanare",
  "dashboard", "platform", "users",
  "cash-tables", "tournaments", "wait-lists", "game-settings",
  "marketplace",
  "promotions", "branding", "verifications", "player-reports",
  "chat-moderation", "missions", "announcements",
  "snapshots", "transactions", "audit-log",
  "exercitii", "scenarii-marketplace", "glosar",
];

export const GUIDE_CHAPTERS = (
  [...intro, ...operations, ...community, ...marketplace] as GuideChapter[]
).sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

export const GUIDE_SOURCE = {
  version: "1.1.0",
  build: "20261115204956",
  commit: "2b0d25ed6ddf1f8dd7885d83d97588371d30ad31",
};
