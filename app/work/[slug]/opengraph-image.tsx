import { ImageResponse } from "next/og";
import { getProject, getProjects } from "@/lib/content";
import { site } from "@/data/site";

export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

/** Per-project share card: title, headline result, stack. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getProject(slug)?.meta;
  const title = m?.title ?? site.fullName;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#060706", color: "#eef2ea" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#9a9f96" }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: "#c8ff2e" }} />
          {m?.category ?? "Project"} · {m?.year}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: title.length > 34 ? 72 : 88, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
          {m?.metric ? <div style={{ marginTop: 24, fontSize: 38, lineHeight: 1.2, color: "#c8ff2e", fontStyle: "italic" }}>{m.metric}</div> : null}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#9a9f96" }}>
          <span>{m?.stack.slice(0, 4).join(" · ")}</span>
          <span>{site.fullName} · {site.url.replace("https://", "")}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
