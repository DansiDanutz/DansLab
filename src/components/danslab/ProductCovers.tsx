import type { ReactNode } from "react";
import { ArtFrame } from "./ProductArt";

// Inline SVG covers for the flagship products that have no design-system art.
// Same frame, label and motion language as ProductArt.

type CoverProps = { color?: string };

const MONO = "JetBrains Mono,monospace";
const svgStyle = { position: "absolute", inset: 0, width: "100%", height: "100%" } as const;

function Cover({ color, label, children }: { color: string; label: string; children: ReactNode }) {
  return (
    <ArtFrame color={color}>
      <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" style={svgStyle}>
        {children}
      </svg>
      <div style={{ position: "absolute", left: 10, bottom: 10, fontFamily: MONO, fontSize: 9, letterSpacing: ".15em", color }}>
        {label}
      </div>
    </ArtFrame>
  );
}

function Pulse({ cx, cy, r, color, dur = "3s" }: { cx: number; cy: number; r: number; color: string; dur?: string }) {
  return (
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="0.4">
      <animate attributeName="r" values={`${r};${r * 1.8};${r}`} dur={dur} repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.7;0;0.7" dur={dur} repeatCount="indefinite" />
    </circle>
  );
}

// Deterministic pseudo-random so server and client render identically.
const seeded = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

function NervixPayArt({ color = "#d4a017" }: CoverProps) {
  const chains = ["POLYGON", "BNB", "TON", "TRON"];
  return (
    <Cover color={color} label="◈ MULTI-CHAIN · USDC / USDT">
      <rect x="18" y="16" width="44" height="44" rx="3" fill="#0d0907" stroke={color} strokeOpacity=".6" strokeWidth=".5" />
      {Array.from({ length: 81 }, (_, i) => {
        const x = i % 9, y = Math.floor(i / 9);
        const finder = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5);
        return (finder || seeded(i) > 0.5) && (
          <rect key={i} x={22 + x * 4} y={20 + y * 4} width="3.4" height="3.4" fill={finder ? color : "#f5e6c8"} opacity={finder ? 1 : 0.8} />
        );
      })}
      <line x1="18" x2="62" y1="38" y2="38" stroke={color} strokeWidth=".6">
        <animate attributeName="y1" values="18;58;18" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="y2" values="18;58;18" dur="2.6s" repeatCount="indefinite" />
      </line>
      <text x="74" y="30" fill="#f5e6c8" fontFamily={MONO} fontSize="13" fontWeight="700">16.00</text>
      <text x="116" y="30" fill={color} fontFamily={MONO} fontSize="6">USDC</text>
      <text x="74" y="39" fill="#22c55e" fontFamily={MONO} fontSize="5">● PAID · CONFIRMED</text>
      {chains.map((c, i) => (
        <g key={c} transform={`translate(${74 + (i % 2) * 36} ${46 + Math.floor(i / 2) * 10})`}>
          <rect width="33" height="7" rx="3.5" fill="none" stroke={color} strokeOpacity=".55" strokeWidth=".4" />
          <text x="16.5" y="5" textAnchor="middle" fill={color} fontFamily={MONO} fontSize="3.6">{c}</text>
        </g>
      ))}
    </Cover>
  );
}

function FakeRealArt({ color = "#22c55e" }: CoverProps) {
  return (
    <Cover color={color} label="⌕ EVIDENCE · VERDICT">
      <rect x="20" y="14" width="120" height="12" rx="6" fill="#0d1210" stroke={color} strokeOpacity=".5" strokeWidth=".5" />
      <text x="28" y="22" fill="#9ca3af" fontFamily={MONO} fontSize="4.5">https://news.example/story-claim</text>
      <rect x="20" y="34" width="56" height="34" rx="3" fill="#2a0d0d" stroke="#ef4444" strokeOpacity=".7" strokeWidth=".5" />
      <text x="48" y="54" textAnchor="middle" fill="#ef4444" fontFamily={MONO} fontSize="9" fontWeight="700" opacity=".55">FAKE</text>
      <rect x="84" y="34" width="56" height="34" rx="3" fill="#0b2216" stroke={color} strokeWidth=".8" />
      <text x="112" y="54" textAnchor="middle" fill={color} fontFamily={MONO} fontSize="9" fontWeight="700">REAL</text>
      <Pulse cx={112} cy={51} r={14} color={color} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={20 + i * 41} y="74" width="38" height="3" rx="1.5" fill={color} opacity={0.25 + i * 0.25} />
      ))}
    </Cover>
  );
}

function RepoAuditArt({ color = "#22c55e" }: CoverProps) {
  const kpis = [{ v: "57.4%", l: "AUDITED" }, { v: "32.7%", l: "PROD READY" }, { v: "44.6%", l: "HEALTHY" }];
  return (
    <Cover color={color} label="▣ FLEET AUDIT CONTROL PLANE">
      {kpis.map((k, i) => (
        <g key={k.l} transform={`translate(${16 + i * 44} 14)`}>
          <rect width="40" height="24" rx="2" fill="#0a120d" stroke={color} strokeOpacity=".4" strokeWidth=".4" />
          <text x="4" y="12" fill={color} fontFamily={MONO} fontSize="8" fontWeight="700">{k.v}</text>
          <text x="4" y="19" fill="#9ca3af" fontFamily={MONO} fontSize="3.4">{k.l}</text>
        </g>
      ))}
      {Array.from({ length: 6 }, (_, i) => {
        const w = 30 + seeded(i + 3) * 90;
        return (
          <g key={i} transform={`translate(16 ${44 + i * 6})`}>
            <rect width="128" height="3.4" rx="1" fill="#ffffff" opacity=".05" />
            <rect width={w} height="3.4" rx="1" fill={i % 3 === 1 ? "#d4a017" : color} opacity=".75">
              <animate attributeName="width" values={`0;${w}`} dur="1.6s" begin={`${i * 0.15}s`} fill="freeze" />
            </rect>
          </g>
        );
      })}
    </Cover>
  );
}

function DailyStockArt({ color = "#f97316" }: CoverProps) {
  const candles = Array.from({ length: 16 }, (_, i) => {
    const base = 62 - i * 1.8 + (seeded(i) - 0.5) * 10;
    const up = seeded(i + 40) > 0.35;
    return { x: 24 + i * 5.6, o: up ? base + 4 : base - 4, c: up ? base - 4 : base + 4, h: base - 9, l: base + 9, up };
  });
  return (
    <Cover color={color} label="◢ TODAY'S SETUPS · SCORED">
      {candles.map((k, i) => (
        <g key={i}>
          <line x1={k.x} x2={k.x} y1={k.h} y2={k.l} stroke={k.up ? "#22c55e" : "#ef4444"} strokeWidth=".4" />
          <rect x={k.x - 1.8} y={Math.min(k.o, k.c)} width="3.6" height={Math.abs(k.o - k.c)} fill={k.up ? "#22c55e" : "#ef4444"} />
        </g>
      ))}
      <circle cx="132" cy="38" r="15" fill="none" stroke="#ffffff" strokeOpacity=".08" strokeWidth="3" />
      <circle cx="132" cy="38" r="15" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
              strokeDasharray="94.2" strokeDashoffset="16" transform="rotate(-90 132 38)">
        <animate attributeName="stroke-dashoffset" values="94.2;16" dur="1.8s" fill="freeze" />
      </circle>
      <text x="132" y="41" textAnchor="middle" fill="#f5e6c8" fontFamily={MONO} fontSize="9" fontWeight="700">83</text>
      <text x="132" y="62" textAnchor="middle" fill={color} fontFamily={MONO} fontSize="4">SCORE</text>
    </Cover>
  );
}

function AdNowArt({ color = "#d4a017" }: CoverProps) {
  return (
    <Cover color={color} label="▶ 30-SECOND AD CARDS">
      {[2, 1, 0].map((i) => (
        <rect key={i} x={40 + i * 6} y={14 - i * 3} width="70" height="56" rx="4"
              fill={i === 0 ? "#1a1206" : "#0d0907"} stroke={color} strokeOpacity={i === 0 ? 0.9 : 0.3} strokeWidth=".5" />
      ))}
      <text x="48" y="32" fill="#f5e6c8" fontFamily={MONO} fontSize="7" fontWeight="700">AD NOW</text>
      <text x="48" y="40" fill={color} fontFamily={MONO} fontSize="4">before every meeting</text>
      <rect x="48" y="50" width="54" height="3" rx="1.5" fill="#ffffff" opacity=".08" />
      <rect x="48" y="50" width="54" height="3" rx="1.5" fill={color}>
        <animate attributeName="width" values="0;54" dur="3s" repeatCount="indefinite" />
      </rect>
      <circle cx="128" cy="24" r="10" fill="none" stroke={color} strokeWidth="1.2" />
      <text x="128" y="27" textAnchor="middle" fill={color} fontFamily={MONO} fontSize="7" fontWeight="700">30</text>
      <Pulse cx={128} cy={24} r={10} color={color} />
    </Cover>
  );
}

function DextyArt({ color = "#a855f7" }: CoverProps) {
  const years = ["1500", "1700", "1900", "2026", "2100"];
  return (
    <Cover color={color} label="? DID YOU KNOW THAT · 1500 → 2100">
      <defs>
        <linearGradient id="dexty-q" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f97316" />
          <stop offset=".5" stopColor="#ec4899" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
        <filter id="dexty-glow"><feGaussianBlur stdDeviation="2.4" /></filter>
      </defs>
      <text x="80" y="58" textAnchor="middle" fontSize="54" fontWeight="900" fill="url(#dexty-q)" filter="url(#dexty-glow)" opacity=".7">?</text>
      <text x="80" y="58" textAnchor="middle" fontSize="54" fontWeight="900" fill="url(#dexty-q)">?</text>
      <line x1="26" x2="134" y1="72" y2="72" stroke={color} strokeOpacity=".5" strokeWidth=".5" />
      {years.map((y, i) => (
        <g key={y} transform={`translate(${26 + i * 27} 72)`}>
          <circle r="1.6" fill={i === 3 ? "#f97316" : color} />
          <text y="-4" textAnchor="middle" fill="#c4b5fd" fontFamily={MONO} fontSize="3.6">{y}</text>
        </g>
      ))}
      <circle cy="72" r="2.4" fill="#fff">
        <animate attributeName="cx" values="26;134;26" dur="6s" repeatCount="indefinite" />
      </circle>
    </Cover>
  );
}

function RealityArt({ color = "#38bdf8" }: CoverProps) {
  return (
    <Cover color={color} label="◉ LIVING 3D EARTH">
      <defs>
        <radialGradient id="reality-globe" cx="38%" cy="35%">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset=".55" stopColor="#0c4a6e" />
          <stop offset="1" stopColor="#020617" />
        </radialGradient>
        <clipPath id="reality-clip"><circle cx="80" cy="46" r="30" /></clipPath>
      </defs>
      <circle cx="80" cy="46" r="36" fill={color} opacity=".08" />
      <circle cx="80" cy="46" r="30" fill="url(#reality-globe)" />
      <g clipPath="url(#reality-clip)" stroke={color} strokeOpacity=".45" strokeWidth=".35" fill="none">
        {[-20, -10, 0, 10, 20].map((y) => <ellipse key={y} cx="80" cy={46 + y} rx={Math.sqrt(900 - y * y)} ry="3" />)}
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx="80" cy="46" ry="30" rx="8">
            <animate attributeName="rx" values="0;30;0" dur="8s" begin={`${-i * 2}s`} repeatCount="indefinite" />
          </ellipse>
        ))}
      </g>
      <ellipse cx="80" cy="46" rx="48" ry="12" fill="none" stroke={color} strokeOpacity=".4" strokeWidth=".4" transform="rotate(-18 80 46)" />
      <circle r="1.8" fill="#f5e6c8">
        <animateMotion dur="5s" repeatCount="indefinite" path="M32,46 a48,12 0 1,0 96,0 a48,12 0 1,0 -96,0" />
      </circle>
    </Cover>
  );
}

function PlayingCard({ x, rank, suit, red }: { x: number; rank: string; suit: string; red: boolean }) {
  const ink = red ? "#dc2626" : "#111827";
  return (
    <g transform={`translate(${x} 22)`}>
      <rect width="24" height="34" rx="2.5" fill="#f8fafc" />
      <text x="3" y="8" fill={ink} fontSize="6" fontWeight="700">{rank}</text>
      <text x="12" y="23" textAnchor="middle" fill={ink} fontSize="11">{suit}</text>
    </g>
  );
}

function PreFlopArt({ color = "#22c55e" }: CoverProps) {
  return (
    <Cover color={color} label="♠ PREDICT THE FLOP · 22,100">
      <ellipse cx="80" cy="44" rx="70" ry="32" fill="#064e3b" stroke="#d4a017" strokeOpacity=".6" strokeWidth="1" />
      <ellipse cx="80" cy="44" rx="62" ry="26" fill="none" stroke={color} strokeOpacity=".25" strokeWidth=".4" />
      <PlayingCard x={50} rank="A" suit="♠" red={false} />
      <PlayingCard x={68} rank="K" suit="♥" red />
      <g>
        <PlayingCard x={86} rank="?" suit="◆" red />
        <animate attributeName="opacity" values="1;.35;1" dur="2.4s" repeatCount="indefinite" />
      </g>
      <text x="80" y="70" textAnchor="middle" fill="#f5e6c8" fontFamily={MONO} fontSize="4.2">FLUSH 0.84% · STRAIGHT 3.27%</text>
    </Cover>
  );
}

function ShikakuArt({ color = "#a3e635" }: CoverProps) {
  const cell = 9;
  const blocks = [
    { x: 0, y: 0, w: 3, h: 2, c: "#a3e635" }, { x: 3, y: 0, w: 2, h: 3, c: "#38bdf8" },
    { x: 5, y: 0, w: 3, h: 1, c: "#f97316" }, { x: 5, y: 1, w: 3, h: 2, c: "#ec4899" },
    { x: 0, y: 2, w: 1, h: 4, c: "#a855f7" }, { x: 1, y: 2, w: 2, h: 2, c: "#d4a017" },
    { x: 3, y: 3, w: 5, h: 1, c: "#22c55e" }, { x: 1, y: 4, w: 4, h: 2, c: "#38bdf8" },
    { x: 5, y: 4, w: 3, h: 2, c: "#f97316" },
  ];
  return (
    <Cover color={color} label="▦ PUZZLE QUEST">
      <g transform="translate(44 12)">
        {blocks.map((b, i) => (
          <g key={i}>
            <rect x={b.x * cell + 0.6} y={b.y * cell + 0.6} width={b.w * cell - 1.2} height={b.h * cell - 1.2} rx="1.6"
                  fill={b.c} fillOpacity=".22" stroke={b.c} strokeWidth=".6">
              <animate attributeName="fill-opacity" values=".22;.5;.22" dur="4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </rect>
            <text x={b.x * cell + 4} y={b.y * cell + 6.5} fill={b.c} fontFamily={MONO} fontSize="4.5" fontWeight="700">{b.w * b.h}</text>
          </g>
        ))}
        <rect width={8 * cell} height={6 * cell} fill="none" stroke={color} strokeOpacity=".5" strokeWidth=".5" />
      </g>
    </Cover>
  );
}

function WorldCup26Art({ color = "#22c55e" }: CoverProps) {
  return (
    <Cover color={color} label="★ LEGEND CARDS · UNLOCK">
      <defs>
        <linearGradient id="wc-holo" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#d4a017" />
          <stop offset=".5" stopColor="#fef3c7" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="wc-shine" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="wc-card"><rect x="58" y="8" width="44" height="64" rx="4" /></clipPath>
      </defs>
      <rect x="40" y="16" width="36" height="52" rx="4" fill="#0b2216" stroke={color} strokeOpacity=".35" strokeWidth=".5" transform="rotate(-10 58 42)" />
      <rect x="84" y="16" width="36" height="52" rx="4" fill="#0b2216" stroke={color} strokeOpacity=".35" strokeWidth=".5" transform="rotate(10 102 42)" />
      <rect x="58" y="8" width="44" height="64" rx="4" fill="#062014" stroke="url(#wc-holo)" strokeWidth="1.2" />
      <polygon points="80,22 84,32 95,32 86,38 89,49 80,42 71,49 74,38 65,32 76,32" fill="url(#wc-holo)" />
      <text x="80" y="60" textAnchor="middle" fill="#fef3c7" fontFamily={MONO} fontSize="3.5" fontWeight="700">THE VANISHED HERO</text>
      <g clipPath="url(#wc-card)">
        <rect x="-30" y="0" width="20" height="100" fill="url(#wc-shine)" transform="skewX(-20)">
          <animate attributeName="x" values="30;150" dur="3.2s" repeatCount="indefinite" />
        </rect>
      </g>
    </Cover>
  );
}

function SeriesArt({ color = "#ec4899" }: CoverProps) {
  return (
    <Cover color={color} label="● THE SERIES · 9 FILMS">
      <rect x="0" y="20" width="160" height="40" fill="#0a0507" />
      {Array.from({ length: 20 }, (_, i) => (
        <g key={i}>
          <rect x={i * 8 + 2} y="22" width="4" height="3" rx=".6" fill="#2a1a20" />
          <rect x={i * 8 + 2} y="55" width="4" height="3" rx=".6" fill="#2a1a20" />
        </g>
      ))}
      <g>
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={6 + i * 30} y="28" width="26" height="24" rx="1.5"
                fill={color} fillOpacity={0.08 + (i % 3) * 0.06} stroke={color} strokeOpacity=".5" strokeWidth=".4" />
        ))}
        <animateTransform attributeName="transform" type="translate" values="0 0;-120 0" dur="10s" repeatCount="indefinite" />
      </g>
      <text x="80" y="14" textAnchor="middle" fill="#f5e6c8" fontSize="8" fontStyle="italic" fontFamily="Georgia,serif">
        A company built by machines<tspan fill={color}>.</tspan>
      </text>
      <text x="80" y="72" textAnchor="middle" fill={color} fontFamily={MONO} fontSize="4">BUILT IN THE OPEN</text>
    </Cover>
  );
}

export const ProductCovers: Record<string, (props: CoverProps) => React.JSX.Element> = {
  nervixpay: NervixPayArt,
  fakereal: FakeRealArt,
  repoaudit: RepoAuditArt,
  dailystock: DailyStockArt,
  adnow: AdNowArt,
  dexty: DextyArt,
  reality: RealityArt,
  preflop: PreFlopArt,
  shikaku: ShikakuArt,
  worldcup26: WorldCup26Art,
  danslabvideo: SeriesArt,
};
