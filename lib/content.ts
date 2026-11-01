import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  /** e.g. "AI/ML" | "Full-stack" — used as a small tag. */
  category: string;
  /** The headline metric that sells the project. */
  metric: string;
  stack: string[];
  year: string;
  live?: string;
  repo?: string;
  /** Looping scroll-through video of the live site (public path), shown on hover. */
  preview?: string;
  /** Still frame for the preview / thumbnail. */
  poster?: string;
  /** "phone" for portrait app recordings; default is a landscape browser capture. */
  previewShape?: "phone" | "browser";
  /** Display order — lower is shown first. */
  order: number;
  featured: boolean;
};

export type AwardMeta = {
  slug: string;
  title: string;
  /** Headline outcome, e.g. "2nd place" or "$7,000 in prizes". */
  result: string;
  host: string;
  /** Team name, when the team had one (e.g. "Penrider"). */
  team?: string;
  /** What was pitched (e.g. "Downtown Unity Centre"). */
  idea?: string;
  year: string;
  /** Human-readable date, e.g. "November 2025". */
  date: string;
  summary: string;
  images: { src: string; alt: string }[];
  order: number;
};

export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
};

type Loaded<T> = { meta: T; content: string };

function readCollection(dir: string): { slug: string; data: Record<string, unknown>; content: string }[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      return { slug: file.replace(/\.mdx$/, ""), data, content };
    });
}

/* ---------- Projects ---------- */

export function getProjects(): ProjectMeta[] {
  return readCollection("projects")
    .map(({ slug, data }) => ({
      slug,
      title: String(data.title ?? slug),
      summary: String(data.summary ?? ""),
      category: String(data.category ?? "Project"),
      metric: String(data.metric ?? ""),
      stack: (data.stack as string[]) ?? [],
      year: String(data.year ?? ""),
      live: data.live ? String(data.live) : undefined,
      repo: data.repo ? String(data.repo) : undefined,
      preview: data.preview ? String(data.preview) : undefined,
      poster: data.poster ? String(data.poster) : undefined,
      previewShape: (data.previewShape === "phone" ? "phone" : "browser") as ProjectMeta["previewShape"],
      order: Number(data.order ?? 99),
      featured: Boolean(data.featured ?? false),
    }))
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects(): ProjectMeta[] {
  return getProjects().filter((p) => p.featured);
}

export function getProject(slug: string): Loaded<ProjectMeta> | null {
  const item = readCollection("projects").find((p) => p.slug === slug);
  if (!item) return null;
  const all = getProjects();
  const meta = all.find((p) => p.slug === slug)!;
  return { meta, content: item.content };
}

/* ---------- Awards ---------- */

export function getAwards(): AwardMeta[] {
  return readCollection("awards")
    .map(({ slug, data }) => ({
      slug,
      title: String(data.title ?? slug),
      result: String(data.result ?? ""),
      host: String(data.host ?? ""),
      team: data.team ? String(data.team) : undefined,
      idea: data.idea ? String(data.idea) : undefined,
      year: String(data.year ?? ""),
      date: String(data.date ?? data.year ?? ""),
      summary: String(data.summary ?? ""),
      images: Array.isArray(data.images)
        ? (data.images as { src?: unknown; alt?: unknown }[])
            .filter((i) => typeof i?.src === "string")
            .map((i) => ({ src: String(i.src), alt: String(i.alt ?? "") }))
        : [],
      order: Number(data.order ?? 99),
    }))
    .sort((a, b) => a.order - b.order);
}

/* ---------- Writing ---------- */

export function getPosts(): PostMeta[] {
  return readCollection("writing")
    .map(({ slug, data }) => ({
      slug,
      title: String(data.title ?? slug),
      summary: String(data.summary ?? ""),
      date: String(data.date ?? ""),
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Loaded<PostMeta> | null {
  const item = readCollection("writing").find((p) => p.slug === slug);
  if (!item) return null;
  const meta = getPosts().find((p) => p.slug === slug)!;
  return { meta, content: item.content };
}

export function formatDate(date: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
