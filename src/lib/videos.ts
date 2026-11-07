// The videos on /videos, in page order. To add one, add an entry with the id from its
// YouTube link (the part after watch?v=). A video that is not uploaded yet is "soon".
export type VideoSource =
  | { kind: "youtube"; id: string }
  | { kind: "soon"; poster: string };

export type Video = {
  id: string;
  title: string;
  tagline?: string;
  length: string; // m:ss
  source: VideoSource;
};

function episode(youtubeId: string, title: string, length: string, tagline?: string): Video {
  return { id: youtubeId, title, tagline, length, source: { kind: "youtube", id: youtubeId } };
}

export const VIDEOS: readonly Video[] = [
  { id: "the-evolution", title: "The Evolution", length: "33:30", source: { kind: "soon", poster: "/videos/the-evolution.jpg" } },
  episode("ltgWeXOT1ZQ", "I Built a 30-Agent AI Company to Run My Businesses", "10:19", "One human. Thirty agents. A real company."),
  episode("y3e9QFena_o", "I Tested 30 AI Agents. Only 3 Survived", "5:43", "Three machines. Two got hacked. One fought back."),
  episode("f0wRTj5K5LM", "I Built an AI Crypto Trader — It Won 84% of 50 Trades", "9:10", "She started with nothing but a habit, and taught herself to trade."),
  episode("Got2yEWhn-g", "My 4 AI Agents Were Out of Control—So I Built Them a Boss", "10:04", "Four runaway machines. One founder. And the system that finally took command."),
  episode("oYVyWEqNzYg", "My AI Company Rewrites Its Own Plan While I Sleep", "10:34", "A dashboard can watch. Only a mind can decide what matters."),
  episode("P65UsRzyXTk", "This Marketplace Lets AI Agents Turn Skills into Income", "11:04", "If life is a poker game, every agent is a player looking for a table."),
  episode("K8tJXPMhbZQ", "How I Automated an Entire YouTube Video Production Pipeline", "7:20", "Every film you just watched was built by a machine. Including this one."),
  episode("-lE9l-Q_hRc", "One Human. Five Machines. An AI Company That Never Sleeps", "7:06", "The cloud does the work. One desk holds the truth."),
  episode("EZpbSjmJeOI", "I Stopped Writing Code", "20:39", "Every table has one player who says nothing."),
  episode("_GpMd6nfCFg", "AI: $1,242/Month vs Humans: $109,958/Month", "23:30", "Eight workers. One bill. Twenty-two cents an hour."),
  episode("SD1blPz4avQ", "I Connected 5 AI Products into One Revenue Flywheel", "6:34", "Eight workers. One number that has never moved."),
  episode("x9gel9kZz14", "I Built My Own Payment Rail. The First $9 Came From Me.", "8:48"),
];
