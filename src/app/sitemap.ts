import type { MetadataRoute } from "next";

const BASE = "https://danslab.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${BASE}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/ecosystem`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/lab`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/semeclaw`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/story`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];
}
