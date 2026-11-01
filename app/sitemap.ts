import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getProjects, getPosts } from "@/lib/content";
import { abs } from "@/lib/seo";
import { site } from "@/data/site";

/** Last time a content file changed (falls back to the site-wide "updated" date). */
function modified(...parts: string[]) {
  try {
    return fs.statSync(path.join(process.cwd(), ...parts)).mtime;
  } catch {
    return new Date(site.seo.updated);
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(site.seo.updated);
  const projects = getProjects();

  return [
    { url: abs("/"), lastModified: updated, changeFrequency: "monthly", priority: 1 },
    { url: abs("/about"), lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    { url: abs("/work"), lastModified: updated, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((p) => ({
      url: abs(`/work/${p.slug}`),
      lastModified: modified("content", "projects", `${p.slug}.mdx`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...(site.showWriting
      ? [
          { url: abs("/writing"), lastModified: updated, changeFrequency: "weekly" as const, priority: 0.6 },
          ...getPosts().map((p) => ({
            url: abs(`/writing/${p.slug}`),
            lastModified: p.date ? new Date(p.date) : modified("content", "writing", `${p.slug}.mdx`),
            changeFrequency: "yearly" as const,
            priority: 0.5,
          })),
        ]
      : []),
  ];
}
