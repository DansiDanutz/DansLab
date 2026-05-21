import type { ReactNode } from "react";

// Inline SVG cover art for each product card
// Ported from design-system/product-art.jsx

function ArtFrame({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div style={{
      position: "absolute", inset: 0, borderRadius: 4, overflow: "hidden",
      background: `radial-gradient(140% 110% at 20% 15%, ${color}22, transparent 60%), #050303`,
    }}>
      {children}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)",
        mixBlendMode: "overlay",
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.6) 100%)",
      }} />
      <div style={{ position: "absolute", top: 6, left: 6, width: 10, height: 10, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}`, opacity: .7 }} />
      <div style={{ position: "absolute", top: 6, right: 6, width: 10, height: 10, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}`, opacity: .7 }} />
      <div style={{ position: "absolute", bottom: 6, left: 6, width: 10, height: 10, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}`, opacity: .7 }} />
      <div style={{ position: "absolute", bottom: 6, right: 6, width: 10, height: 10, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}`, opacity: .7 }} />
    </div>
  );
}

function NervixArt({ color = "#c0392b" }: { color?: string }) {
  const nodes = [
    { x: 50, y: 50, r: 7, hub: true },
    { x: 22, y: 28, r: 3 }, { x: 74, y: 22, r: 3.4 },
    { x: 18, y: 60, r: 2.8 }, { x: 82, y: 58, r: 3.2 },
    { x: 30, y: 78, r: 2.6 }, { x: 62, y: 82, r: 3 },
    { x: 40, y: 18, r: 2.4 }, { x: 58, y: 32, r: 2.8 },
    { x: 36, y: 58, r: 2.2 }, { x: 66, y: 52, r: 2.6 },
    { x: 14, y: 42, r: 2 }, { x: 88, y: 38, r: 2.2 },
    { x: 48, y: 72, r: 2.4 },
  ];
  const edges: [number, number][] = [];
  for (let i = 1; i < nodes.length; i++) edges.push([0, i]);
  edges.push([1, 8], [2, 8], [3, 11], [4, 12], [5, 13], [6, 13], [7, 1], [8, 10], [9, 5], [10, 6], [11, 3], [12, 4]);
  return (
    <ArtFrame color={color}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
           style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="nervix-hub" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#f4c15c" />
            <stop offset="60%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nervix-node">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="60%" stopColor={color} />
          </radialGradient>
          <filter id="nervix-glow"><feGaussianBlur stdDeviation="0.8" /></filter>
        </defs>
        <circle cx="50" cy="50" r="30" fill="url(#nervix-hub)" opacity="0.35" />
        {edges.map(([a, b], i) => {
          const A = nodes[a], B = nodes[b];
          return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                       stroke={color} strokeOpacity="0.55" strokeWidth="0.3"
                       strokeDasharray="1.2 0.6" />;
        })}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r + 2} fill={color} opacity="0.18" filter="url(#nervix-glow)" />
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.hub ? "url(#nervix-hub)" : "url(#nervix-node)"} />
            {n.hub && <circle cx={n.x} cy={n.y} r={n.r + 0.8} fill="none" stroke="#f4c15c" strokeWidth="0.3" opacity="0.9" />}
          </g>
        ))}
        <circle cx="50" cy="50" r="14" fill="none" stroke={color} strokeWidth="0.2" opacity="0.6">
          <animate attributeName="r" values="10;22;10" dur="3.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="3.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" r="18" fill="none" stroke={color} strokeWidth="0.2" opacity="0.4">
          <animate attributeName="r" values="14;26;14" dur="3.6s" begin="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="3.6s" begin="1.2s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div style={{ position: "absolute", left: 10, bottom: 10, fontFamily: "JetBrains Mono,monospace", fontSize: 9, letterSpacing: ".15em", color }}>⎔ FEDERATION · 247 AGENTS</div>
    </ArtFrame>
  );
}

function CrawdbotArt({ color = "#d4a017" }: { color?: string }) {
  const clips = [
    { x: 2, w: 18, c: "#d4a017" },
    { x: 21, w: 12, c: "#22c55e" },
    { x: 34, w: 22, c: "#d4a017" },
    { x: 57, w: 10, c: "#c0392b" },
    { x: 68, w: 16, c: "#d4a017" },
    { x: 85, w: 13, c: "#3b82f6" },
  ];
  return (
    <ArtFrame color={color}>
      <div style={{
        position: "absolute", left: "6%", right: "6%", top: "7%", height: "50%",
        background: "linear-gradient(180deg,#0a0504,#1a0e0b)",
        border: `1px solid ${color}55`, borderRadius: 4, overflow: "hidden",
      }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
             style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="cb-bg"><stop offset="0" stopColor="#c0392b" stopOpacity=".35" /><stop offset="1" stopColor="#050303" stopOpacity="0" /></radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#cb-bg)" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={i * 18 - 8} y={18} width={14} height={18} fill="#1a0e0b" stroke={color} strokeOpacity=".3" strokeWidth=".3" rx="1" />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={`b${i}`} x={i * 18 - 8} y={44} width={14} height={18} fill="#1a0e0b" stroke={color} strokeOpacity=".3" strokeWidth=".3" rx="1" />
          ))}
          <g transform="translate(50 50)">
            <rect x="-15" y="-10" width="30" height="20" rx="4" fill="#c0392b" />
            <polygon points="-4,-6 8,0 -4,6" fill="#fff" />
          </g>
          <g transform="translate(82 18)" opacity=".85">
            <path d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z" fill="#f4c15c" />
          </g>
        </svg>
        <div style={{ position: "absolute", bottom: 4, right: 6, fontFamily: "JetBrains Mono,monospace", fontSize: 8, color: "#f4c15c", letterSpacing: ".1em" }}>● REC 00:24:12</div>
      </div>
      <div style={{
        position: "absolute", left: "6%", right: "6%", bottom: "7%", height: "33%",
        background: "rgba(0,0,0,.5)", border: `1px solid ${color}44`, borderRadius: 4,
        padding: "4px 6px", display: "flex", flexDirection: "column", gap: 3,
      }}>
        <div style={{ position: "relative", height: "38%", background: "rgba(0,0,0,.4)", borderRadius: 2 }}>
          {clips.map((c, i) => (
            <div key={i} style={{
              position: "absolute", left: `${c.x}%`, width: `${c.w}%`, top: 2, bottom: 2,
              background: `linear-gradient(180deg, ${c.c}aa, ${c.c}55)`,
              border: `1px solid ${c.c}`, borderRadius: 1,
            }} />
          ))}
        </div>
        <div style={{ position: "relative", height: "28%", background: "rgba(0,0,0,.4)", borderRadius: 2, overflow: "hidden" }}>
          <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            {Array.from({ length: 60 }).map((_, i) => {
              const h = 2 + Math.abs(Math.sin(i * 0.7 + i * 0.3)) * 6;
              return <rect key={i} x={i * 1.7} y={(10 - h) / 2} width={1} height={h} fill="#22c55e" opacity=".8" />;
            })}
          </svg>
        </div>
        <div style={{ position: "relative", height: "18%", display: "flex", alignItems: "center", fontFamily: "JetBrains Mono,monospace", fontSize: 7, color: "#b9b1a4", letterSpacing: ".1em" }}>
          <span>00:00</span><span style={{ marginLeft: "auto" }}>07:30</span>
        </div>
        <div style={{ position: "absolute", left: "42%", top: 4, bottom: 4, width: 1, background: "#f4c15c", boxShadow: "0 0 6px #f4c15c" }}>
          <div style={{ position: "absolute", top: -3, left: -3, width: 7, height: 7, background: "#f4c15c", transform: "rotate(45deg)" }} />
        </div>
      </div>
    </ArtFrame>
  );
}

function MyworkArt({ color = "#c0392b" }: { color?: string }) {
  const tools = [
    { g: "$", lbl: "stripe" },
    { g: "◉", lbl: "webhook" },
    { g: "⌬", lbl: "cron", hot: true },
    { g: "▣", lbl: "supabase" },
    { g: "#", lbl: "slack" },
    { g: "✉", lbl: "email" },
    { g: "↻", lbl: "n8n" },
    { g: "▶", lbl: "ffmpeg" },
    { g: "✓", lbl: "tests" },
  ];
  return (
    <ArtFrame color={color}>
      <div style={{
        position: "absolute", left: "6%", right: "6%", top: "7%", bottom: "7%",
        background: "linear-gradient(180deg,#0a0504,#050303)",
        border: `1px solid ${color}44`, borderRadius: 4, overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 4, padding: "4px 7px",
          borderBottom: `1px solid ${color}33`, fontFamily: "JetBrains Mono,monospace",
          fontSize: 7, letterSpacing: ".15em", color,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, boxShadow: `0 0 4px ${color}` }} />
          <span style={{ color: "#fafafa", fontWeight: 700 }}>MYWORK-AI</span>
          <span style={{ opacity: .6 }}>· TOOLKIT</span>
          <span style={{ marginLeft: "auto", color: "#b9b1a4" }}>72 · v2.4.1</span>
        </div>
        <div style={{
          margin: "6px 8px 4px", padding: "3px 6px", border: `1px solid ${color}33`,
          borderRadius: 2, background: "rgba(0,0,0,.4)",
          fontFamily: "JetBrains Mono,monospace", fontSize: 7, color: "#b9b1a4", letterSpacing: ".1em",
        }}>⌕ search 72 commands…</div>
        <div style={{
          flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 5, padding: "4px 8px 8px",
        }}>
          {tools.map((t, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 2,
              background: t.hot ? `linear-gradient(145deg, ${color}33, ${color}08)` : "rgba(0,0,0,.35)",
              border: `1px solid ${t.hot ? color : color + "33"}`,
              borderRadius: 3, padding: "4px 2px",
              boxShadow: t.hot ? `0 0 12px ${color}55` : "none",
            }}>
              <div style={{ fontFamily: "Newsreader,serif", fontSize: 16, color: t.hot ? "#fafafa" : color, lineHeight: 1 }}>{t.g}</div>
              <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 6, letterSpacing: ".1em", color: "#b9b1a4" }}>{t.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </ArtFrame>
  );
}

function ZmartyArt({ color = "#d4a017" }: { color?: string }) {
  const bars = [
    { o: 40, c: 50, h: 54, l: 38, up: true },
    { o: 50, c: 44, h: 52, l: 42, up: false },
    { o: 44, c: 48, h: 50, l: 41, up: true },
    { o: 48, c: 42, h: 50, l: 38, up: false },
    { o: 42, c: 46, h: 49, l: 40, up: true },
    { o: 46, c: 52, h: 55, l: 44, up: true },
    { o: 52, c: 48, h: 54, l: 46, up: false },
    { o: 48, c: 54, h: 58, l: 46, up: true },
    { o: 54, c: 60, h: 63, l: 52, up: true },
    { o: 60, c: 56, h: 62, l: 54, up: false },
    { o: 56, c: 64, h: 67, l: 54, up: true },
    { o: 64, c: 62, h: 66, l: 58, up: false },
    { o: 62, c: 72, h: 75, l: 60, up: true },
    { o: 72, c: 82, h: 85, l: 70, up: true, glow: true },
  ];
  const bw = 100 / (bars.length + 2);
  const linePts = bars.map((b, i) => `${(i + 1.5) * bw},${100 - b.c}`).join(" ");
  return (
    <ArtFrame color={color}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"
           style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="zm-bg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity=".12" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="zm-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#22c55e" stopOpacity=".35" />
            <stop offset="1" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#zm-bg)" />
        {[25, 50, 75].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke={color} strokeOpacity=".15" strokeWidth=".2" strokeDasharray=".6 .6" />
        ))}
        <path d={`M ${bw * 1.5},${100 - bars[0].c} ${bars.slice(1).map((b, i) => `L ${(i + 2.5) * bw},${100 - b.c}`).join(" ")} L ${(bars.length + 0.5) * bw},100 L ${bw * 1.5},100 Z`}
              fill="url(#zm-fill)" />
        {bars.map((b, i) => {
          const cx = (i + 1.5) * bw;
          const top = 100 - Math.max(b.o, b.c);
          const bot = 100 - Math.min(b.o, b.c);
          const col = b.up ? "#22c55e" : "#ec4899";
          return (
            <g key={i}>
              <line x1={cx} y1={100 - b.h} x2={cx} y2={100 - b.l} stroke={col} strokeWidth=".3" />
              <rect x={cx - bw * 0.28} y={top} width={bw * 0.56} height={Math.max(0.6, bot - top)}
                    fill={col} opacity={b.glow ? 1 : 0.85}
                    filter={b.glow ? "drop-shadow(0 0 3px #22c55e)" : ""} />
            </g>
          );
        })}
        <polyline points={linePts} fill="none" stroke="#f4c15c" strokeWidth=".5" strokeOpacity=".9" />
      </svg>
      <div style={{ position: "absolute", left: 10, top: 8, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 8, color, letterSpacing: ".2em", fontWeight: 700 }}>◢ BTC / USDT · 4H</div>
        <div style={{ fontFamily: "Newsreader,serif", fontSize: 20, fontWeight: 500, color: "#fafafa", letterSpacing: "-.01em", lineHeight: 1 }}>96.2<span style={{ fontSize: 12, color: "#22c55e" }}>%</span></div>
        <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 7, color: "#b9b1a4", letterSpacing: ".15em" }}>WIN RATE</div>
      </div>
      <div style={{ position: "absolute", right: 8, top: 14, fontFamily: "JetBrains Mono,monospace", fontSize: 8, color: "#22c55e", padding: "1px 5px", border: "1px solid #22c55e", borderRadius: 2, background: "rgba(0,0,0,.4)" }}>+$4,218 ▲</div>
    </ArtFrame>
  );
}

function SemeclawArt({ color = "#c0392b" }: { color?: string }) {
  const seats = [
    { angle: -90, label: "RS", c: "#60a5fa" },
    { angle: -38, label: "WR", c: "#d4a017" },
    { angle: 12, label: "CD", c: "#a78bfa" },
    { angle: 60, label: "SP", c: "#22c55e" },
    { angle: 108, label: "HM", c: "#f4c15c" },
    { angle: 155, label: "DN", c: "#f8fafc" },
    { angle: -150, label: "OR", c: "#e74c3c" },
  ];
  const R = 32;
  return (
    <ArtFrame color={color}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
           style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="sc-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff5e6" />
            <stop offset="35%" stopColor="#f4c15c" />
            <stop offset="75%" stopColor="#c0392b" />
            <stop offset="100%" stopColor="#7a1f16" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sc-room" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="rgba(192,57,43,0.18)" />
            <stop offset="80%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <linearGradient id="sc-ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(212,160,23,0.55)" />
            <stop offset="50%" stopColor="rgba(192,57,43,0.45)" />
            <stop offset="100%" stopColor="rgba(212,160,23,0.55)" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#sc-room)" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(192,57,43,0.18)" strokeWidth=".25" strokeDasharray=".4 .8" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="url(#sc-ring)" strokeWidth=".5" />
        <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(212,160,23,0.25)" strokeWidth=".3" />
        <circle cx="50" cy="50" r="14" fill="rgba(0,0,0,0.45)" stroke="rgba(192,57,43,0.4)" strokeWidth=".3" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r1 = 30, r2 = 28;
          const x1 = 50 + Math.cos(a) * r1;
          const y1 = 50 + Math.sin(a) * r1;
          const x2 = 50 + Math.cos(a) * r2;
          const y2 = 50 + Math.sin(a) * r2;
          const bold = i % 6 === 0;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={bold ? "rgba(244,193,92,0.5)" : "rgba(212,160,23,0.2)"} strokeWidth={bold ? ".4" : ".2"} />;
        })}
        {seats.map((s, i) => {
          const a = (s.angle * Math.PI) / 180;
          const x = 50 + Math.cos(a) * R;
          const y = 50 + Math.sin(a) * R;
          return (
            <line key={`l${i}`} x1="50" y1="50" x2={x} y2={y}
              stroke={s.c} strokeOpacity="0.35" strokeWidth=".25" strokeDasharray=".6 .8" />
          );
        })}
        <circle cx="50" cy="50" r="10" fill="url(#sc-core)" opacity="0.95" />
        <circle cx="50" cy="50" r="3.2" fill="#fff5e6">
          <animate attributeName="r" values="3;4.5;3" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.6;1" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" r="12" fill="none" stroke="#f4c15c" strokeWidth=".25" opacity="0.4">
          <animate attributeName="r" values="10;18;10" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <text x="50" y="51.5" textAnchor="middle"
          fontFamily="Newsreader, serif" fontStyle="italic" fontSize="5.2"
          fill="#1a0a0a" fontWeight="600">S</text>
        {seats.map((s, i) => {
          const a = (s.angle * Math.PI) / 180;
          const x = 50 + Math.cos(a) * R;
          const y = 50 + Math.sin(a) * R;
          return (
            <g key={`s${i}`}>
              <circle cx={x} cy={y} r="4.4" fill={s.c} opacity="0.15" />
              <circle cx={x} cy={y} r="3.2" fill="rgba(10,5,4,0.85)" stroke={s.c} strokeWidth=".4" />
              <text x={x} y={y + 1.1} textAnchor="middle"
                fontFamily="JetBrains Mono, monospace" fontSize="2.4"
                fontWeight="700" fill={s.c}>{s.label}</text>
            </g>
          );
        })}
      </svg>
      <div style={{
        position: "absolute", left: "50%", top: 36, transform: "translateX(-50%)",
        fontFamily: "JetBrains Mono,monospace", fontSize: 7,
        color: "#f4c15c", letterSpacing: ".22em", fontWeight: 700,
        textShadow: "0 1px 2px rgba(0,0,0,0.7)",
      }}>WAR ROOM</div>
    </ArtFrame>
  );
}

export const ProductArt: Record<string, (props: { color?: string }) => React.JSX.Element> = {
  nervix: NervixArt,
  crawdbot: CrawdbotArt,
  mywork: MyworkArt,
  zmarty: ZmartyArt,
  semeclaw: SemeclawArt,
  openclaw: SemeclawArt,
};
