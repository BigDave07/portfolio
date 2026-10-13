import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { aboutGraph, breadcrumbs } from "@/lib/seo";
import { skillGroups } from "@/data/skills";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: "About David Oladipupo | Software Engineer in Regina, SK" },
  description:
    "About David Oladipupo: software engineer and technical cofounder of Synvora and founder of Pickup, finishing Computer Science at the University of Regina in December 2026.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", type: "profile", title: "About David Oladipupo", description: site.seo.description },
};

const label = "font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-faint)]";

/** Headline numbers, all straight from the resume. */
const stats = [
  { value: "39+", label: "screens in the Synvora iOS app, shipped solo" },
  { value: "<4 mo", label: "from empty repo to App Store launch" },
  { value: "30+", label: "customer discovery calls for Pickup" },
  { value: "7", label: "IBM certificates, incl. Machine Learning Professional" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-5 pb-24 pt-32 sm:px-8">
      <JsonLd data={aboutGraph} />
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <Reveal>
        <p className={label}>
          <span className="text-[var(--color-accent)]">[03]</span> about.me
        </p>
        <h1 className="mt-3 font-serif text-[clamp(3.5rem,9vw,8rem)] leading-[0.9] tracking-tight">
          Meet <em className="text-[var(--color-muted)]">David.</em>
          <span className="sr-only"> Oladipupo, software engineer in {site.seo.city}, {site.seo.region}, Canada</span>
        </h1>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20">
        {/* Portrait stays in view while the story scrolls. */}
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element -- single static portrait */}
            <img
              src="/ai/portrait-640.jpg"
              alt={`Portrait of ${site.fullName}, software engineer in ${site.seo.city}, ${site.seo.region}`}
              width={640}
              height={640}
              fetchPriority="high"
              className="aspect-[4/5] w-full rounded-2xl border border-[var(--color-border)] object-cover grayscale"
            />
            <figcaption className={`${label} mt-3 flex flex-col gap-1`}>
              <span>{site.location}</span>
              <span className="text-[var(--color-accent)]">● open to work</span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="space-y-20">
          <Reveal>
            <p className={label}>Software engineer / technical cofounder</p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
              I build AI products, from the first customer call to the App Store.
            </h2>
            <div className="mt-6 max-w-2xl space-y-4 text-[16px] leading-8 text-[var(--color-muted)]">
              {site.bio.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <p className={label}>
              <span className="text-[var(--color-accent)]">&gt;</span> quick_facts
            </p>
            <dl className="mt-4 grid max-w-2xl gap-x-6 gap-y-3 text-[15px] leading-7 sm:grid-cols-[8rem_1fr]">
              {[
                ["Who", `${site.fullName}, ${site.role.toLowerCase()} and technical cofounder`],
                ["Based in", `${site.seo.city}, ${site.seo.region}, Canada (open to relocation)`],
                ["Founded", "Synvora (AI skincare app) and Pickup (AI voice intake agent)"],
                ["Builds with", "TypeScript, Python, React Native, Next.js, Supabase and the Claude API"],
                ["Studying", `Computer Science, ${site.seo.university}, graduating December 2026`],
                ["Looking for", "Software engineering and AI engineering roles"],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-faint)] sm:pt-1.5">{k}</dt>
                  <dd className="text-[var(--color-muted)]">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] xl:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-[var(--color-bg)] p-6">
                  <dt className="font-serif text-5xl text-[var(--color-fg)]">{s.value}</dt>
                  <dd className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <section>
            <Reveal>
              <p className={label}>
                <span className="text-[var(--color-accent)]">&gt;</span> experience.log
              </p>
            </Reveal>
            <ol className="mt-6 border-l border-[var(--color-border)]">
              {site.experience.map((e) => (
                <Reveal key={e.org} as="li" className="relative pb-10 pl-8 last:pb-0">
                  <span className="absolute -left-[5px] top-2 size-2.5 rounded-full border border-[var(--color-accent)] bg-[var(--color-bg)]" />
                  <p className={label}>{e.when}</p>
                  <h3 className="mt-1 font-serif text-3xl">
                    {e.role} <em className="text-[var(--color-muted)]">at {e.org}</em>
                  </h3>
                  <ul className="mt-3 max-w-2xl list-disc space-y-1.5 pl-5 text-[15px] leading-7 text-[var(--color-muted)] marker:text-[var(--color-faint)]">
                    {e.points.map((pt) => (
                      <li key={pt.slice(0, 32)}>{pt}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </ol>
          </section>

          <section>
            <Reveal>
              <p className={label}>
                <span className="text-[var(--color-accent)]">&gt;</span> stack.sys
              </p>
            </Reveal>
            <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {skillGroups.map((g, i) => (
                <Reveal key={g.title}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    <span className="text-[var(--color-faint)]">sector_{String(i + 1).padStart(2, "0")} /</span> {g.title}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {g.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-sm border border-[var(--color-border)] px-2.5 py-1 font-mono text-xs text-[var(--color-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-fg)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </section>

          <Reveal>
            <p className={label}>
              <span className="text-[var(--color-accent)]">&gt;</span> education.txt
            </p>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[var(--color-muted)]">{site.education}</p>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[var(--color-muted)]">{site.certifications}</p>
          </Reveal>

          <Reveal className="rounded-2xl border border-[var(--color-border)] p-8 sm:p-10">
            <p className={label}>Next step</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
              Have an idea worth <em className="text-[var(--color-accent)]">shipping?</em>
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-7 text-[var(--color-muted)]">
              I&apos;m open to SWE and AI engineering roles, and always up for talking about a hard product problem.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.18em]">
              <a href={site.links.email} className="pressable rounded-full bg-[var(--color-accent)] px-5 py-3 text-[var(--color-bg)]">
                Email me →
              </a>
              <a href={site.resume} target="_blank" rel="noreferrer" className="pressable rounded-full border border-[var(--color-border)] px-5 py-3 hover:border-[var(--color-fg)]">
                Resume
              </a>
              <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="pressable rounded-full border border-[var(--color-border)] px-5 py-3 hover:border-[var(--color-fg)]">
                LinkedIn
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
