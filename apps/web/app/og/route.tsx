import { ImageResponse } from "next/og";

export const runtime = "edge";

const size = { width: 1200, height: 630 };

const SWARAS = [0, 2, 4, 6, 7, 9, 11];

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#0E0C0A",
        color: "#F4EBDD",
        padding: "64px 72px",
        position: "relative",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -140,
          top: -140,
          width: 640,
          height: 640,
          borderRadius: 9999,
          background: "radial-gradient(circle, rgba(232,163,61,0.22) 0%, rgba(232,163,61,0) 70%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "62%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            letterSpacing: 4,
            color: "#B9AB97",
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: 42, height: 1, background: "#E8A33D" }} />A living atlas of raga
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, lineHeight: 0.95, letterSpacing: -2 }}>The day has</div>
          <div
            style={{
              fontSize: 88,
              lineHeight: 0.95,
              letterSpacing: -2,
              fontStyle: "italic",
              color: "#E8A33D",
            }}
          >
            a scale.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 26,
              lineHeight: 1.4,
              color: "#B9AB97",
              maxWidth: 560,
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            24 ragas · 8 prahars · zero samples
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, letterSpacing: 2, color: "#F4EBDD" }}>
          swarmandala
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 330,
            height: 330,
            borderRadius: 9999,
            border: "1px solid rgba(244,235,221,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {SWARAS.map((semitone) => {
            const angle = (semitone * 30 - 90) * (Math.PI / 180);
            return (
              <div
                key={semitone}
                style={{
                  position: "absolute",
                  width: semitone === 0 ? 22 : 12,
                  height: semitone === 0 ? 22 : 12,
                  borderRadius: 9999,
                  background: semitone === 0 ? "#E8A33D" : "#F4EBDD",
                  left: 165 + Math.cos(angle) * 165 - (semitone === 0 ? 11 : 6),
                  top: 165 + Math.sin(angle) * 165 - (semitone === 0 ? 11 : 6),
                }}
              />
            );
          })}
          <div style={{ fontSize: 22, color: "#B9AB97", letterSpacing: 6 }}>स्वर</div>
        </div>
      </div>
    </div>,
    size,
  );
}
