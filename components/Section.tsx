import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

type SectionProps = {
  id?: string;
  /** Optional small eyebrow label above the heading. Use sparingly (max 1 per 3 sections). */
  eyebrow?: string;
  /** HUD index shown before the eyebrow, e.g. "02". */
  index?: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, index, title, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={`container-page scroll-mt-24 border-t border-[var(--color-border)] py-20 sm:py-28 ${className ?? ""}`}
    >
      {(eyebrow || index || title) && (
        <Reveal className="mb-12">
          {(eyebrow || index) && (
            <p className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-faint)]">
              {index && <span className="text-[var(--color-accent)]">[{index}]</span>}
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="font-serif text-5xl leading-[0.95] tracking-tight text-[var(--color-fg)] sm:text-7xl">
              {title}
            </h2>
          )}
        </Reveal>
      )}
      {children}
    </section>
  );
}
