import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/danslab-data";
import { PROJECT_DOCS, getProjectDoc } from "@/lib/project-docs";

type Params = { project: string };

export function generateStaticParams(): Params[] {
  return PROJECT_DOCS.map((doc) => ({ project: doc.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { project } = await params;
  const doc = getProjectDoc(project);
  if (!doc) return { title: "Docs — DansLab" };
  return {
    title: `${doc.name} — Docs — DansLab`,
    description: `${doc.name}: ${doc.tagline}. Documentation, links, and architecture.`,
  };
}

export default async function ProjectDocPage({ params }: { params: Promise<Params> }) {
  const { project } = await params;
  const doc = getProjectDoc(project);
  if (!doc) notFound();

  const product = PRODUCTS.find((p) => p.id === doc.id);
  const color = product?.color ?? "#c0392b";
  const isExternal = (href: string) => href.startsWith("http");

  return (
    <div className="dl-docs" style={{ ["--p-color" as string]: color }}>
      <nav className="dl-docs-crumbs">
        <Link href="/docs">Docs</Link>
        <span>/</span>
        <span>{doc.name}</span>
      </nav>

      <header className="dl-docs-head">
        <div className="dl-docs-label">
          PROJECT // {doc.id.toUpperCase()} · {doc.status.toUpperCase()}
        </div>
        <h1 className="dl-h2">{doc.name}</h1>
        <p className="dl-docs-sub">{doc.tagline}</p>
      </header>

      <div className="dl-docs-facts">
        <div className="dl-docs-fact">
          <span className="dl-docs-fact-k">LIVE AT</span>
          <a href={doc.liveUrl} target={isExternal(doc.liveUrl) ? "_blank" : undefined} rel="noreferrer noopener">
            {doc.liveLabel}
          </a>
        </div>
        <div className="dl-docs-fact">
          <span className="dl-docs-fact-k">LEAD</span>
          <span>{doc.lead}</span>
        </div>
        <div className="dl-docs-fact">
          <span className="dl-docs-fact-k">STACK</span>
          <span>{doc.stack.join(" · ")}</span>
        </div>
      </div>

      {doc.sections.map((section) => (
        <section key={section.title} className="dl-docs-section">
          <h2>{section.title}</h2>
          {section.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </section>
      ))}

      <section className="dl-docs-section">
        <h2>Links</h2>
        <ul className="dl-docs-links">
          {doc.links.map((link) => (
            <li key={link.href}>
              {isExternal(link.href) ? (
                <a href={link.href} target="_blank" rel="noreferrer noopener">{link.label} →</a>
              ) : (
                <Link href={link.href}>{link.label} →</Link>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
