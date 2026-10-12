export function SkillGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-t border-[var(--color-border)] pt-4">
      <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-faint)] before:mr-2 before:text-[var(--color-accent)] before:content-['>']">
        {title}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-sm border border-[var(--color-border)] px-2.5 py-1 font-mono text-xs text-[var(--color-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-fg)]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
