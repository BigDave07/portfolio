import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { TiltCard } from "@/components/motion/TiltCard";
import type { ProjectMeta } from "@/lib/content";

/** Category-driven gradient wash so cards have real visual variation, not white-on-white. */
const washes: Record<string, string> = {
  "AI / ML": "from-[var(--color-accent)]/16 via-transparent",
  Data: "from-sky-500/14 via-transparent",
  "Web / Software": "from-emerald-500/14 via-transparent",
};

export function ProjectCard({ project }: { project: ProjectMeta }) {
  const wash = washes[project.category] ?? "from-[var(--color-accent)]/12 via-transparent";

  return (
    <TiltCard className="h-full">
      <Link
        href={`/work/${project.slug}`}
        className="pressable group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-accent)]/60 sm:p-8"
      >
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${wash} to-transparent opacity-60`}
        />

        <div className="relative z-10 flex flex-1 flex-col [transform:translateZ(30px)]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
              {project.category}
            </span>
            <span className="font-mono text-[11px] text-[var(--color-faint)]">{project.year}</span>
          </div>

          <h3 className="flex items-start justify-between gap-3 font-serif text-2xl font-light text-[var(--color-fg)]">
            <span>{project.title}</span>
            <ArrowUpRight
              weight="bold"
              className="mt-1 size-5 shrink-0 -translate-y-0.5 translate-x-0.5 text-[var(--color-faint)] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[var(--color-accent)] group-hover:opacity-100"
            />
          </h3>

          <p className="mt-3 text-[15px] leading-6 text-[var(--color-muted)] text-pretty">
            {project.summary}
          </p>

          {project.metric && (
            <p className="mt-5 border-l-2 border-[var(--color-accent)] pl-3 text-sm font-medium text-[var(--color-fg)]">
              {project.metric}
            </p>
          )}

          <ul className="mt-auto flex flex-wrap gap-2 pt-6">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/40 px-2.5 py-1 text-xs text-[var(--color-muted)]"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </TiltCard>
  );
}
