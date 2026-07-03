import type { CSSProperties } from "react";

/**
 * Line-by-line reveal for a display headline: each line rises from behind a clip.
 * Pure CSS (runs without JS, screenshot-safe). The global reduced-motion block
 * collapses the animation to its final visible state.
 */
export function AnimatedHeading({
  lines,
  className,
  delay = 0,
}: {
  lines: readonly string[];
  className?: string;
  delay?: number;
}) {
  return (
    <h1 className={className}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <span
            className="line-reveal"
            style={{ "--d": `${delay + i * 90}ms` } as CSSProperties}
          >
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}
