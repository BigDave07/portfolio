import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon: the "d" monogram on the site's near-black. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#060706", color: "#c8ff2e", fontSize: 120, fontStyle: "italic", fontFamily: "serif" }}>
        d
      </div>
    ),
    { ...size },
  );
}
