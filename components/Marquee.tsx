import { Star } from "@phosphor-icons/react/dist/ssr";

/**
 * Single kinetic marquee (max one per page, per taste-skill). Constant linear motion.
 * The track is duplicated so the -50% translate loops seamlessly.
 */
export function Marquee({ items }: { items: string[] }) {
  const sequence = [...items, ...items];
  return (
    <section
      aria-hidden
      className="relative flex overflow-hidden border-y border-[var(--color-border)] py-5"
    >
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--color-bg)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--color-bg)] to-transparent" />
      <div className="marquee-track">
        {sequence.map((item, i) => (
          <span
            key={i}
            className="mx-6 inline-flex items-center gap-6 font-serif text-2xl font-light text-[var(--color-muted)] sm:text-3xl"
          >
            {item}
            <Star weight="fill" className="size-3 text-[var(--color-accent)]" />
          </span>
        ))}
      </div>
    </section>
  );
}
