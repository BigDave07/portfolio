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
  /** Display order — lower is shown first. */
  order: number;
  featured: boolean;
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
