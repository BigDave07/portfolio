import type { AwardMeta } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

/** Photo(s) when there are any; otherwise a typographic card built from the result itself. */
function Visual({ award }: { award: AwardMeta }) {
  const [main, extra] = award.images;
  if (!main) {
    return (
      <div className="grid aspect-[3/2] place-items-center overflow-hidden rounded-xl border border-[var(--color-border)] bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--color-accent)_16%,transparent),transparent_65%)] p-6 text-center">
        <p className="font-serif text-5xl leading-none text-[var(--color-fg)] sm:text-6xl">{award.result}</p>
      </div>
    );
  }
  return (
    <div className={`grid gap-2 ${extra ? "grid-cols-[2fr_1fr]" : "grid-cols-1"}`}>
      {[main, extra].filter(Boolean).map((img) => (
        // eslint-disable-next-line @next/next/no-img-element -- small static photos
        <img
          key={img!.src}
          src={img!.src}
          alt={img!.alt}
          loading="lazy"
          width={1170}
          height={775}
          className="aspect-[3/2] size-full rounded-xl border border-[var(--color-border)] object-cover"
        />
      ))}
    </div>
  );
}

/** Hackathons and competitions, newest additions are just new files in content/awards. */
export function Awards({ awards }: { awards: AwardMeta[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
      {awards.map((a, i) => (
        <Reveal key={a.slug} as="li" delay={i * 0.06}>
          <article>
            <Visual award={a} />
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent)]">{a.result}</p>
            <h3 className="mt-2 font-serif text-3xl leading-tight text-[var(--color-fg)] sm:text-4xl">{a.title}</h3>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-faint)]">
              {[a.host, a.team && `Team ${a.team}`, a.idea && `Pitch: ${a.idea}`, a.date].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-[var(--color-muted)]">{a.summary}</p>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}
