import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // Background Container (The Night)
      <div
        style={{
          fontSize: 24,
          background: "#0a0a0a", // Mafia Base
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c5a059", // Mafia Accent (Gold)
          borderRadius: "20%", // Slightly rounded corners (App icon style)
          border: "2px solid #c5a059", // Gold Border
        }}
      >
        {/* The Symbol: An abstract Metronome / 'A' / The Pyramid of Power */}
        <div
            style={{
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: "16px solid #c5a059",
                position: "relative",
                top: "-2px"
            }}
        >
            {/* The Needle (The Ticking Time) */}
            <div 
                style={{
                    position: "absolute",
                    top: "2px",
                    left: "-1px",
                    width: "2px",
                    height: "12px",
                    background: "#0a0a0a",
                    transform: "rotate(15deg)",
                    transformOrigin: "bottom center",
                }}
            />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}