import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
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

      <Section id="work" title="Selected work">
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.06} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            All projects
            <ArrowRight
              weight="bold"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>
      </Section>

      <Section id="about" title="Studying CS, building with AI">
        <div className="max-w-2xl space-y-5 text-lg leading-8 text-[var(--color-muted)] text-pretty">
          {site.bio.map((para) => (
            <Reveal key={para.slice(0, 24)}>
              <p>{para}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="skills" title="What I work with">
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
