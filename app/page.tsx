import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillGroup } from "@/components/SkillGroup";
import { Reveal } from "@/components/motion/Reveal";
import { getFeaturedProjects } from "@/lib/content";
import { skillGroups } from "@/data/skills";
import { site } from "@/data/site";

export default function Home() {
  const projects = getFeaturedProjects();

  return (
    <>
      <Hero />

      <Section id="work" eyebrow="01 — Selected work" title="Things I've built">
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.06}>
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
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </Reveal>
      </Section>

      <Section id="about" eyebrow="02 — About" title="Studying CS, building with AI">
        <div className="max-w-2xl space-y-5 text-lg leading-8 text-[var(--color-muted)] text-pretty">
          {site.bio.map((para) => (
            <Reveal key={para.slice(0, 24)}>
              <p>{para}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="skills" eyebrow="03 — Toolkit" title="What I work with">
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
