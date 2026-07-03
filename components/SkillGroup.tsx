export function SkillGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-t border-[var(--color-border)] pt-4">
      <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-faint)]">
        {title}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-muted)]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
