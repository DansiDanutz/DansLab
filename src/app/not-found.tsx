import Link from "next/link";

export default function NotFound() {
  return (
    <section style={{ padding: "140px 0 160px", position: "relative", zIndex: 1 }}>
      <div className="dl-sec-head">
        <span className="dl-sec-idx">§ 404</span>
        <span className="dl-sec-tag">SIGNAL LOST // NO SUCH ROUTE</span>
      </div>
      <h1 className="dl-hero-title" style={{ marginTop: 28, maxWidth: 720 }}>
        No agent owns{" "}
        <em style={{ color: "var(--dl-accent-hot)", fontStyle: "italic" }}>this domain</em>.
      </h1>
      <p style={{ marginTop: 18, maxWidth: 460, color: "var(--ink-dim)", lineHeight: 1.6 }}>
        The fleet checked every bench, every droplet, every cron. Whatever used to live at this
        address has been decommissioned — or never shipped.
      </p>
      <div style={{ marginTop: 32, display: "flex", gap: 14, flexWrap: "wrap" }}>
        <Link href="/" className="dl-btn dl-btn-primary">
          Back to base →
        </Link>
        <Link href="/ecosystem" className="dl-btn dl-btn-ghost">
          View ecosystem
        </Link>
      </div>
    </section>
  );
}
