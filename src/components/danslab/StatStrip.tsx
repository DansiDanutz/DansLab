"use client";

import { STATS, type Stat } from "@/lib/danslab-data";
import { useCountUp } from "./atoms";

export function StatStrip() {
  return (
    <section className="dl-stats">
      {STATS.map((s, i) => <StatCell key={s.label} s={s} i={i} />)}
    </section>
  );
}

function StatCell({ s, i }: { s: Stat; i: number }) {
  const v = useCountUp(s.value, 1200 + i * 200);
  const display = s.value % 1 === 0 ? Math.round(v).toString() : v.toFixed(2);
  return (
    <div className="dl-stat">
      <div className="dl-stat-num">
        {display}<span className="dl-stat-suffix">{s.suffix}</span>
      </div>
      <div className="dl-stat-label">{s.label}</div>
      <div className="dl-stat-sub">{s.sub}</div>
      <div className="dl-stat-idx">0{i + 1}</div>
    </div>
  );
}
