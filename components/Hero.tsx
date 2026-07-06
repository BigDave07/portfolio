import type { CSSProperties } from "react";
import { GithubLogo, LinkedinLogo, EnvelopeSimple, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { AnimatedHeading } from "@/components/motion/AnimatedHeading";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ProfilePhoto } from "@/components/ProfilePhoto";
import { site, socials } from "@/data/site";

const icons = { GitHub: GithubLogo, LinkedIn: LinkedinLogo, Email: EnvelopeSimple } as const;
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[92dvh] flex-col justify-center overflow-hidden pt-20">
      <div className="hero-grid" />
      <div className="hero-aurora" />

      <div className="container-page relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
        <p
          style={d(0)}
          className="rise mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)] backdrop-blur"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--color-accent)] opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[var(--color-accent)]" />
          </span>
          {site.hero.eyebrow}
        </p>

        <AnimatedHeading
          lines={site.hero.headline}
          delay={120}
          className="font-serif text-5xl font-light leading-[1.03] tracking-tight text-[var(--color-fg)] sm:text-6xl"
        />

        <p
          style={d(430)}
          className="rise mt-8 max-w-xl text-lg leading-8 text-[var(--color-muted)] text-pretty"
        >
          {site.hero.subtext}
        </p>

        <div style={d(520)} className="rise mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton href="/work" variant="primary">
            View work
            <ArrowRight weight="bold" className="size-4" />
          </MagneticButton>
          <MagneticButton href={site.resume} variant="ghost" external>
            Resume
          </MagneticButton>
        </div>

        <ul style={d(620)} className="rise mt-12 flex items-center gap-3">
          {socials.map((s) => {
            const Icon = icons[s.label as keyof typeof icons];
            return (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.external ? "_blank" : undefined}
                  rel={s.external ? "noreferrer" : undefined}
                  aria-label={s.label}
                  className="pressable grid size-10 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-fg)]"
                >
                  <Icon weight="regular" className="size-[18px]" />
                </a>
              </li>
            );
          })}
        </ul>
        </div>

        <div className="order-first lg:order-last lg:col-span-5">
          <ProfilePhoto />
        </div>
      </div>
    </section>
  );
}
