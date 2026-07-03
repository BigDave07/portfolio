import type { MetadataRoute } from "next";
import { getProjects, getPosts } from "@/lib/content";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const staticRoutes = ["", "/work", "/writing"].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));

  const projectRoutes = getProjects().map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: new Date(),
  }));

  const postRoutes = getPosts().map((p) => ({
    url: `${base}/writing/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : new Date(),
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
