import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.fullName}: ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card for the home page: name, role, what he builds, domain. */
export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#060706", color: "#eef2ea" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#9a9f96" }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: "#c8ff2e" }} />
          {site.seo.city}, {site.seo.region} · Open to work
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 124, lineHeight: 1, letterSpacing: -4 }}>{site.fullName}</div>
          <div style={{ marginTop: 20, fontSize: 50, lineHeight: 1.15, color: "#c8ff2e", fontStyle: "italic" }}>
            AI products, built and shipped end to end.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#9a9f96" }}>
          <span>Synvora · Pickup · Claude · React Native · Next.js</span>
          <span>{site.url.replace("https://", "")}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
