import Link from "next/link";
import { PRODUCTS } from "@/lib/danslab-data";
import { PROJECT_DOCS } from "@/lib/project-docs";

export const metadata = {
  title: "Project Documentation — DansLab",
  description: "Documentation for every DansLab project: nervix.ai, crawdbot.com, WorldCup Central, MyWork-AI, zmarty.me, and SemeClaw.",
};

export default function DocsIndexPage() {
  return (
    <div className="dl-docs">
      <header className="dl-docs-head">
        <div className="dl-docs-label">DOCS // {PROJECT_DOCS.length} PROJECTS</div>
        <h1 className="dl-h2">Project documentation.</h1>
        <p className="dl-docs-sub">
          One page per product — what it is, how it works, where it runs, and who leads it.
        </p>
      </header>

      <div className="dl-docs-grid">
        {PROJECT_DOCS.map((doc) => {
          const product = PRODUCTS.find((p) => p.id === doc.id);
          return (
            <Link key={doc.id} href={`/docs/${doc.id}`} className="dl-docs-card" style={{ ["--p-color" as string]: product?.color ?? "#c0392b" }}>
              <div className="dl-docs-card-name">{doc.name}</div>
              <div className="dl-docs-card-tagline">{doc.tagline}</div>
              <div className="dl-docs-card-meta">
                <span>LEAD · {doc.lead}</span>
                <span>{doc.liveLabel}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
