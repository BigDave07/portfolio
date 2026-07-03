import type { ReactNode } from "react";

/**
 * Long-form typography wrapper for MDX (case studies + blog posts).
 * Tailwind v4 has no typography plugin here, so styles are hand-tuned
 * for the editorial dark theme.
 */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        max-w-[42rem] text-[15px] leading-7 text-[var(--color-muted)]
        [&_a]:text-[var(--color-fg)] [&_a]:underline [&_a]:decoration-[var(--color-accent)] [&_a]:decoration-1 [&_a]:underline-offset-4 hover:[&_a]:text-[var(--color-accent)]
        [&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-light [&_h2]:text-[var(--color-fg)]
        [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-[var(--color-fg)]
        [&_p]:my-5
        [&_strong]:font-medium [&_strong]:text-[var(--color-fg)]
        [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-2
        [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-5
        [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-accent)] [&_blockquote]:pl-4 [&_blockquote]:italic
        [&_code]:rounded [&_code]:bg-[var(--color-surface)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-[var(--color-fg)]
        [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-[var(--radius-card)] [&_pre]:border [&_pre]:border-[var(--color-border)] [&_pre]:bg-[var(--color-surface)] [&_pre]:p-4 [&_pre]:text-[13px]
        [&_pre_code]:bg-transparent [&_pre_code]:p-0
        [&_hr]:my-10 [&_hr]:border-[var(--color-border)]
        [&_img]:my-8 [&_img]:rounded-[var(--radius-card)] [&_img]:border [&_img]:border-[var(--color-border)]
      "
    >
      {children}
    </div>
  );
}
