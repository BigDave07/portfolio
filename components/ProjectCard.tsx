import Link from "next/link";
import type { ProjectMeta } from "@/lib/content";

export function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--color-accent)] sm:p-8"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-accent)]">
          {project.category}
        </span>
        <span className="font-mono text-xs text-[var(--color-faint)]">{project.year}</span>
      </div>

      <h3 className="font-serif text-2xl font-light text-[var(--color-fg)]">
        {project.title}
        <span className="ml-2 inline-block text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
          →
        </span>
      </h3>

      <p className="mt-3 text-[15px] leading-6 text-[var(--color-muted)] text-pretty">
        {project.summary}
      </p>

      {project.metric && (
        <p className="mt-5 border-l-2 border-[var(--color-accent)] pl-3 text-sm font-medium text-[var(--color-fg)]">
          {project.metric}
        </p>
      )}

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-muted)]"
          >
            {tech}
          </li>
        ))}
      </ul>
    </Link>
  );
}
