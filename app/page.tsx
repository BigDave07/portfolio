import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { ProjectList } from "@/components/ProjectList";
import { SkillGroup } from "@/components/SkillGroup";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { getFeaturedProjects } from "@/lib/content";
import { skillGroups } from "@/data/skills";
import { site, marqueeItems } from "@/data/site";

export default function Home() {
  const projects = getFeaturedProjects();

  return (
    <>
      <Hero />

      <Marquee items={marqueeItems} />

      <Section id="work" index="02" eyebrow="Projects.dir" title="Selected work">
        <ProjectList projects={projects} />
        <Reveal className="mt-10">
          <Link
            href="/work"
            className="group inline-flex min-h-11 items-center gap-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            All projects
            <ArrowRight
              weight="bold"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>
      </Section>

      <Section id="about" index="03" eyebrow="About.log" title="Building AI products, end to end">
        <div className="max-w-2xl space-y-5 text-lg leading-8 text-[var(--color-muted)] text-pretty">
          {site.bio.map((para) => (
            <Reveal key={para.slice(0, 24)}>
              <p>{para}</p>
            </Reveal>
          ))}
          <Reveal>
            <Link
              href="/about"
              className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]"
            >
              More about me
              <ArrowRight weight="bold" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </Section>

      <Section id="skills" index="04" eyebrow="Stack.sys" title="What I work with">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.05}>
              <SkillGroup title={group.title} items={group.items} />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
