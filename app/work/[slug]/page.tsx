import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Prose } from "@/components/Prose";
import { getProject, getProjects } from "@/lib/content";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.meta.title,
    description: project.meta.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { meta, content } = project;

  return (
    <article className="container-page py-24">
      <Link
        href="/work"
        className="group mb-12 inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
      >
        <span className="transition-transform group-hover:-translate-x-0.5">←</span>
        All work
      </Link>

      <header className="mb-14 max-w-3xl">
        <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-accent)]">
          <span>{meta.category}</span>
          <span className="text-[var(--color-faint)]">·</span>
          <span className="text-[var(--color-faint)]">{meta.year}</span>
        </div>
        <h1 className="font-serif text-4xl font-light tracking-tight text-[var(--color-fg)] text-balance sm:text-5xl">
          {meta.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--color-muted)] text-pretty">
          {meta.summary}
        </p>

        {meta.metric && (
          <p className="mt-6 border-l-2 border-[var(--color-accent)] pl-4 text-base font-medium text-[var(--color-fg)]">
            {meta.metric}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
          {meta.live && (
            <a
              href={meta.live}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[var(--color-accent)] px-4 py-2 font-medium text-black transition-transform hover:-translate-y-0.5"
            >
              Live demo →
            </a>
          )}
          {meta.repo && (
            <a
              href={meta.repo}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[var(--color-border)] px-4 py-2 text-[var(--color-fg)] transition-colors hover:border-[var(--color-accent)]"
            >
              Source
            </a>
          )}
        </div>

        <ul className="mt-8 flex flex-wrap gap-2">
          {meta.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-muted)]"
            >
              {tech}
            </li>
          ))}
        </ul>
      </header>

      <Prose>
        <MDXRemote source={content} />
      </Prose>
    </article>
  );
}
