import type { CSSProperties } from "react";
import Link from "next/link";
import { FaceCloud } from "@/components/hud/FaceCloud";
import { LocalClock } from "@/components/hud/LocalClock";
import { site } from "@/data/site";

const label = "font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-faint)]";

export function Hero() {
  return (
    <section className="relative isolate h-dvh min-h-[680px] overflow-hidden">
      <div className="hud-grid" />
      <FaceCloud className="absolute inset-x-0 top-0 z-0 h-[62%] [mask-image:linear-gradient(to_bottom,#000_55%,transparent_88%)] lg:inset-0 lg:h-full" />
      {/* Vignette keeps text legible over the head on small screens. */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-bg)_95%)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-[90rem] flex-col justify-end gap-10 px-5 pb-8 pt-24 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="rise max-w-2xl lg:max-w-[40%]">
          <p className={label}>
            <span className="text-[var(--color-accent)]">●</span> Software engineer / AI products / open to work
          </p>
          <h1 className="mt-4 font-serif text-[clamp(3rem,5.4vw,6rem)] leading-[0.95] tracking-tight text-[var(--color-fg)] [&>*]:whitespace-nowrap">
            <span className="block">{site.hud.headline[0]}</span>
            <em className="block text-[var(--color-muted)]">{site.hud.headline[1]}</em>
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-[var(--color-muted)]">{site.hero.subtext}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.18em]">
            <Link href="/work" className="pressable rounded-full bg-[var(--color-accent)] px-5 py-3 text-[var(--color-bg)]">
              View work →
            </Link>
            <a href={site.resume} target="_blank" rel="noreferrer" className="pressable rounded-full border border-[var(--color-border)] px-5 py-3 text-[var(--color-fg)] hover:border-[var(--color-fg)]">
              Resume
            </a>
          </div>
        </div>

        <div style={{ "--d": "300ms" } as CSSProperties} className="rise hidden w-[22rem] space-y-6 lg:block">
          <div>
            <p className={label}>Now</p>
            <dl className="mt-3 space-y-2.5">
              {site.hud.now.map((n) => (
                <div key={n.label} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-faint)]">{n.label}</dt>
                  <dd className="text-sm text-[var(--color-fg)]">{n.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-4 font-mono text-xs">
            <div>
              <p className={label}>Contact</p>
              <a href={site.links.email} className="mt-1 block truncate text-[var(--color-fg)] hover:text-[var(--color-accent)]">{site.email}</a>
            </div>
            <div>
              <p className={label}>Regina, SK</p>
              <p className="mt-1 text-[var(--color-fg)]"><LocalClock timeZone={site.timeZone} /></p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
