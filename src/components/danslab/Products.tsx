"use client";

import { AGENTS, PRODUCTS } from "@/lib/danslab-data";
import { Monogram, SectionLabel, cssVar } from "./atoms";
import { ProductArt } from "./ProductArt";

export function Products() {
  return (
    <section className="dl-products" id="dl-products">
      <SectionLabel n={3} title="SHIPPING // 6 PRODUCTS" />
      <div className="dl-products-head">
        <h2 className="dl-h2">
          Six products.<br />
          <span className="dl-h2-dim">One human approval per direction.</span>
        </h2>
        <div className="dl-products-sub">
          Each product has a lead agent. They ship without asking — but Dan signs off on direction.
        </div>
      </div>

      <div className="dl-products-grid">
        {PRODUCTS.map((p, i) => {
          const leadAgent = AGENTS.find((a) => a.name === p.lead);
          const Art = ProductArt[p.id];
          const isExternal = p.href.startsWith("http");
          return (
            <a
              key={p.id}
              className="dl-product"
              href={p.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer noopener" : undefined}
              style={cssVar({ "--p-color": p.color })}
            >
              <div className="dl-product-head">
                <span className="dl-product-idx">P/{String(i + 1).padStart(2, "0")}</span>
                <span className="dl-product-dot" />
              </div>
              <div className="dl-product-placeholder">
                <div className="dl-product-ph-inner" style={{ borderColor: `${p.color}33`, background: "transparent", padding: 0 }}>
                  {Art ? <Art color={p.color} /> : (
                    <>
                      <span style={{ fontSize: 28, color: p.color }}>◉</span>
                      <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: "var(--ink-faint)", letterSpacing: ".1em" }}>[ product screen ]</span>
                    </>
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
                  <span className="dl-product-kpi-val">{p.kpi}</span>
                </div>

                <div className="dl-product-cta">
                  <span>Open</span>
                  <span className="dl-product-arrow">→</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
