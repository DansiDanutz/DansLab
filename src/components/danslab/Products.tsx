"use client";

import { AGENTS, AUDITED_PRODUCTS, PRODUCTS, type Product, type ProductTier } from "@/lib/danslab-data";
import { Monogram, SectionLabel, cssVar } from "./atoms";
import { ProductArt } from "./ProductArt";

const GLYPHS: Record<string, string> = {
  nervixpay: "◒",
  youtubestudio: "▶",
  fakereal: "f/r",
  worldcup: "⚽",
};

const TIER_HEADINGS: Record<ProductTier, { title: string; note: string }> = {
  flagship: { title: "Flagship", note: "Production-ready, and what we would show you first." },
  shipping: { title: "Shipping", note: "Live and in use." },
  lab: { title: "From the lab", note: "Smaller builds and experiments." },
  audited: { title: "Verified", note: "Production apps checked by RepoAudit." },
};

const isExternal = (href: string) => href.startsWith("http");

function ProductCard({ p, index, youtubeKpi }: { p: Product; index: number; youtubeKpi?: string }) {
  const leadAgent = AGENTS.find((a) => a.name === p.lead);
  const Art = ProductArt[p.id];
  const glyph = GLYPHS[p.id];
  const external = isExternal(p.href);
  const showDocsLink = p.docs !== undefined && p.docs !== p.href;

  return (
    <div className="dl-product" style={cssVar({ "--p-color": p.color })}>
      <a
        className="dl-product-main"
        href={p.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
      >
        <div className="dl-product-head">
          <span className="dl-product-idx">P/{String(index + 1).padStart(2, "0")}</span>
          <span className="dl-product-dot" />
        </div>
        <div className="dl-product-placeholder">
          <div className="dl-product-ph-inner" style={{ borderColor: `${p.color}33`, background: "transparent", padding: 0 }}>
            {Art ? <Art color={p.color} /> : (
              <span className="dl-product-glyph" style={{ color: p.color }}>{glyph ?? "◉"}</span>
            )}
          </div>
        </div>
        <div className="dl-product-body">
          <div className="dl-product-name">{p.name}</div>
          <div className="dl-product-desc">{p.desc}</div>

          <div className="dl-product-divider" />

          <div className="dl-product-lead-row">
            {leadAgent && <Monogram agent={leadAgent} size={32} />}
            <div className="dl-product-lead-info">
              <div className="dl-product-lead-label">LEAD</div>
              <div className="dl-product-lead-name">{p.lead}</div>
            </div>
          </div>

          <div className="dl-product-kpi-row">
            <span className="dl-product-kpi-dot" />
            <span className="dl-product-kpi-val">{p.id === "youtube" && youtubeKpi ? youtubeKpi : p.kpi}</span>
          </div>

          <div className="dl-product-cta">
            <span>{external ? "Open" : "Read"}</span>
            <span className="dl-product-arrow">→</span>
          </div>
        </div>
      </a>
      {showDocsLink && (
        <a className="dl-product-docs" href={p.docs}>
          <span>Docs</span>
          <span className="dl-product-arrow">→</span>
        </a>
      )}
    </div>
  );
}

function LabRow({ p }: { p: Product }) {
  const external = isExternal(p.href);
  return (
    <a
      className="dl-labrow"
      href={p.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      style={cssVar({ "--p-color": p.color })}
    >
      <span className="dl-labrow-name">{p.name}</span>
      <span className="dl-labrow-desc">{p.desc}</span>
      <span className="dl-labrow-arrow">→</span>
    </a>
  );
}

export function Products({ youtubeKpi }: { youtubeKpi?: string }) {
  const byTier = (tier: ProductTier) => PRODUCTS.filter((p) => p.tier === tier);
  const liveCount = byTier("flagship").length + byTier("shipping").length;
  let cardIndex = 0;

  return (
    <section className="dl-products" id="dl-products">
      <SectionLabel n={4} title={`SHIPPING // ${liveCount} LIVE PRODUCTS`} />
      <div className="dl-products-head">
        <h2 className="dl-h2">
          What the crew<br />
          <span className="dl-h2-dim">has built.</span>
        </h2>
        <div className="dl-products-sub">
          Each product has a lead agent and a docs page. Everything here is live and public.
        </div>
      </div>

      {(["flagship", "shipping"] as const).map((tier) => (
        <div key={tier} className="dl-tier">
          <div className="dl-tier-head">
            <h3>{TIER_HEADINGS[tier].title}</h3>
            <span>{TIER_HEADINGS[tier].note}</span>
          </div>
          <div className="dl-products-grid">
            {byTier(tier).map((p) => (
              <ProductCard key={p.id} p={p} index={cardIndex++} youtubeKpi={youtubeKpi} />
            ))}
          </div>
        </div>
      ))}

      <div className="dl-tier">
        <div className="dl-tier-head">
          <h3>{TIER_HEADINGS.lab.title}</h3>
          <span>{TIER_HEADINGS.lab.note}</span>
        </div>
        <div className="dl-labgrid">
          {byTier("lab").map((p) => <LabRow key={p.id} p={p} />)}
        </div>
      </div>

      <details className="dl-audited">
        <summary>
          <span>All {AUDITED_PRODUCTS.length} RepoAudit-verified apps</span>
          <span className="dl-audited-hint">Show</span>
        </summary>
        <p className="dl-audited-note">
          RepoAudit is our audit control plane. It tracks security, correctness and deployment
          status across the fleet&rsquo;s repositories, and these apps are on its verified production list.
        </p>
        <div className="dl-audited-grid">
          {AUDITED_PRODUCTS.map((p) => {
            const external = isExternal(p.href);
            return (
              <a
                key={p.id}
                className="dl-audited-chip"
                href={p.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer noopener" : undefined}
              >
                {p.name}
              </a>
            );
          })}
        </div>
      </details>
    </section>
  );
}
