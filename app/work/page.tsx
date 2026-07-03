import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/motion/Reveal";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects across full-stack software and applied AI/ML.",
};

export default function WorkPage() {
  const projects = getProjects();

  return (
    <Section eyebrow="Work" title="Selected projects" className="border-t-0 pt-28">
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.06}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
