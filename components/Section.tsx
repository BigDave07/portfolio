import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

type SectionProps = {
  id?: string;
  /** Small eyebrow label above the heading, e.g. "01 — Selected work". */
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, title, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={`container-page scroll-mt-24 border-t border-[var(--color-border)] py-20 sm:py-28 ${className ?? ""}`}
    >
      {(eyebrow || title) && (
        <Reveal className="mb-12">
          {eyebrow && (
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="font-serif text-3xl font-light tracking-tight text-[var(--color-fg)] sm:text-4xl">
              {title}
            </h2>
          )}
        </Reveal>
      )}
      {children}
    </section>
  );
}
