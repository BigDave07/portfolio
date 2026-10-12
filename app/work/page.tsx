import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { ProjectList } from "@/components/ProjectList";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "AI products and websites David Oladipupo has designed, built and shipped.",
};

export default function WorkPage() {
  const projects = getProjects();

  return (
    <Section index="01" eyebrow={`Projects.dir / ${String(projects.length).padStart(2, "0")} shipped`} title="Projects" className="border-t-0 pt-32">
      <p className="-mt-6 mb-12 max-w-xl text-[15px] leading-7 text-[var(--color-muted)]">
        Hover a project to watch it run. Click one for the story behind it, with a link to the live site.
      </p>
      <ProjectList projects={projects} />
    </Section>
  );
}
