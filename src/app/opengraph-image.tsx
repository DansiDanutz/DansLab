import { ImageResponse } from "next/og";

export const alt = "DansLab — A human-led autonomous AI lab";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CRIMSON = "#e74c3c";
const GOLD = "#d4a017";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          backgroundImage:
            "radial-gradient(ellipse at 80% 10%, rgba(192,57,43,0.22), transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(212,160,23,0.10), transparent 50%)",
          padding: "64px 72px",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "linear-gradient(135deg, #c0392b, #7a1f14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            D
          </div>
          <div style={{ display: "flex", fontSize: 28, letterSpacing: "0.06em" }}>
            <span style={{ fontWeight: 700 }}>Dans</span>
            <span style={{ fontWeight: 700, color: CRIMSON }}>Lab</span>
          </div>
          <div style={{ fontSize: 20, color: "#71717a", marginLeft: 8 }}>{"// danslab.vercel.app"}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 72, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
            <span>A human-led</span>
            <span style={{ display: "flex" }}>
              <span style={{ color: CRIMSON, fontStyle: "italic" }}>autonomous AI lab</span>
            </span>
            <span>running while Dan sleeps.</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 36, fontSize: 24, color: "#a1a1aa" }}>
          <span style={{ display: "flex", gap: 10 }}>
            <span style={{ color: GOLD, fontWeight: 700 }}>30+</span> agents
          </span>
          <span style={{ color: "#3f3f46" }}>·</span>
          <span style={{ display: "flex", gap: 10 }}>
            <span style={{ color: GOLD, fontWeight: 700 }}>5</span> products
          </span>
          <span style={{ color: "#3f3f46" }}>·</span>
          <span style={{ display: "flex", gap: 10 }}>
            <span style={{ color: GOLD, fontWeight: 700 }}>1</span> human
          </span>
          <span style={{ color: "#3f3f46" }}>·</span>
          <span style={{ color: CRIMSON }}>Cluj-Napoca → the fleet</span>
        </div>
      </div>
    ),
    size
  );
}
