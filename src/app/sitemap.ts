import type { MetadataRoute } from "next";
import { PROJECT_DOCS } from "@/lib/project-docs";

const BASE = "https://danslab.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const docPages: MetadataRoute.Sitemap = PROJECT_DOCS.map((doc) => ({
    url: `${BASE}/docs/${doc.id}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [
    { url: `${BASE}/docs`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    ...docPages,
    { url: `${BASE}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/ecosystem`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/lab`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/semeclaw`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/story`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];
}
