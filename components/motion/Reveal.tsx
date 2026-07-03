import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Small extra delay (ms-ish, expressed as a fraction of a second). */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
};

/**
 * Fade + rise as the element scrolls into view, using a CSS view() timeline.
 * No JS and no scroll listeners: robust without hydration and screenshot-safe.
 * Reduced motion and unsupported browsers both resolve to the final visible state.
 */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const Tag = as;
  return (
    <Tag
      className={`reveal ${className ?? ""}`}
      style={delay ? ({ animationDelay: `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
