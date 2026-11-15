export type GuideCalloutTone = "note" | "warning" | "success";

export interface GuideSection {
  id: string;
  title: string;
  paragraphs?: string[];
  steps?: { title: string; text: string }[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
  callout?: { tone: GuideCalloutTone; title: string; text: string };
  code?: { label: string; text: string };
}

export interface GuideChapter {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  minutes: number;
  group: string;
  sections: GuideSection[];
  sources: { label: string; url: string }[];
}
