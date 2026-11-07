// The videos on /videos, in page order. To add one, add an entry here and its poster
// image to public/videos/. A YouTube video only needs the id from its link.
const RELEASE_URL = "https://github.com/DansiDanutz/Claude-Youtube/releases/download/episodes-v1";

export type VideoSource =
  | { kind: "file"; url: string }
  | { kind: "youtube"; id: string }
  | { kind: "soon" };

export type Video = {
  id: string;
  title: string;
  tagline?: string;
  length: string; // m:ss
  poster: string;
  source: VideoSource;
};

function episode(id: string, title: string, tagline: string, length: string, file: string): Video {
  return {
    id,
    title,
    tagline,
    length,
    poster: `/videos/${id}.jpg`,
    source: { kind: "file", url: `${RELEASE_URL}/danslab-episode-${file}.mp4` },
  };
}

export const VIDEOS: readonly Video[] = [
  { id: "the-evolution", title: "The Evolution", length: "33:30", poster: "/videos/the-evolution.jpg", source: { kind: "soon" } },
  episode("origin", "The Origin", "One human. Thirty agents. A real company.", "10:19", "01-origin-1080P"),
  episode("survivors", "The Survivors", "Three machines. Two got hacked. One fought back.", "5:43", "02-survivors-1080P"),
  episode("trader", "The Trader", "She started with nothing but a habit, and taught herself to trade.", "9:10", "03-trader-1080P"),
  episode("overseer", "The Overseer", "Four runaway machines. One founder. And the system that finally took command.", "10:03", "04-overseer-1080P"),
  episode("brain", "The Brain", "A dashboard can watch. Only a mind can decide what matters.", "10:34", "05-brain-1080P"),
  episode("marketplace", "The Marketplace", "If life is a poker game, every agent is a player looking for a table.", "11:04", "06-marketplace-1080P"),
  episode("factory", "The Factory", "Every film you just watched was built by a machine. Including this one.", "7:20", "07-factory-1080P"),
  episode("studio", "The Studio", "The cloud does the work. One desk holds the truth.", "7:06", "08-studio-1080P"),
  episode("player", "The Player", "Every table has one player who says nothing.", "20:39", "09-player-1080P-v2"),
  episode("payroll", "The Payroll", "Eight workers. One bill. Twenty-two cents an hour.", "23:30", "10-payroll-1080P-v2"),
  episode("flywheel", "The Flywheel", "Eight workers. One number that has never moved.", "6:34", "11-flywheel-1080P-v2"),
];
