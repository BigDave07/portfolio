import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const runtime = "edge";
export const alt = `${site.fullName} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0b",
          color: "#ededed",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#f5b544",
            marginBottom: 24,
          }}
        >
          {site.role}
        </div>
        <div style={{ fontSize: 64, lineHeight: 1.1, maxWidth: 900 }}>
          {site.tagline}
        </div>
        <div style={{ marginTop: 40, fontSize: 28, color: "#a0a0ab" }}>
          {site.url.replace("https://", "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
