// iPhone/iPad home-screen icon (180×180 PNG), generated from the brand mark.
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const gold = "#D9A441";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#14213D" }}>
        <svg width="130" height="130" viewBox="0 0 100 100">
          <g fill="none" stroke={gold} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M50 20 V80" />
            <path d="M21 31 H79" />
            <path d="M25 33 L15 55 M25 33 L35 55" />
            <path d="M75 33 L65 55 M75 33 L85 55" />
            <path d="M36 82 H64" />
          </g>
          <g fill={gold}>
            <circle cx="50" cy="15" r="6" />
            <path d="M11 55 H39 Q39 66 25 66 Q11 66 11 55 Z" />
            <path d="M61 55 H89 Q89 66 75 66 Q61 66 61 55 Z" />
          </g>
        </svg>
      </div>
    ),
    size
  );
}
