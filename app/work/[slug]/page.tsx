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

      <header className="mb-14 max-w-4xl pt-8">
        <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
          <span>{meta.category}</span>
          <span className="text-[var(--color-faint)]">·</span>
          <span className="text-[var(--color-faint)]">{meta.year}</span>
        </div>
        <h1 className="font-serif text-5xl leading-[0.98] tracking-tight text-[var(--color-fg)] text-balance sm:text-7xl">
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
              Visit live site ↗
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
              className="rounded-sm border border-[var(--color-border)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]"
            >
              {tech}
            </li>
          ))}
        </ul>
      </header>

      {meta.preview && (
        <figure
          className={`mb-16 overflow-hidden border border-[var(--color-border)] ${
            meta.previewShape === "phone" ? "mx-auto max-w-[20rem] rounded-[2.25rem]" : "rounded-2xl"
          }`}
        >
          <video
            src={meta.preview}
            poster={meta.poster}
            autoPlay
            muted
            loop
            playsInline
            aria-label={`Scrolling through ${meta.title}`}
            className={`w-full object-cover object-top ${meta.previewShape === "phone" ? "aspect-[664/1440]" : "aspect-[16/10]"}`}
          />
        </figure>
      )}

      <Prose>
        <MDXRemote source={content} />
      </Prose>

      {meta.live && (
        <a
          href={meta.live}
          target="_blank"
          rel="noreferrer"
          className="group mt-20 flex max-w-3xl items-center justify-between gap-6 border-y border-[var(--color-border)] py-8 transition-colors hover:border-[var(--color-accent)]"
        >
          <span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-faint)]">
              See it for yourself
            </span>
            <span className="mt-2 block font-serif text-4xl leading-tight text-[var(--color-fg)] sm:text-5xl">
              Visit {new URL(meta.live).host}
            </span>
          </span>
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[var(--color-accent)] text-2xl text-[var(--color-bg)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 sm:size-20">
            ↗
          </span>
        </a>
      )}

      <nav className="mt-10 max-w-3xl">
        <Link href="/work" className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] hover:text-[var(--color-accent)]">
          ← All projects
        </Link>
      </nav>
    </article>
  );
}
