import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { ProjectList } from "@/components/ProjectList";
import { JsonLd } from "@/components/JsonLd";
import { abs, breadcrumbs } from "@/lib/seo";
import { site } from "@/data/site";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Projects: AI Apps, Voice Agents & Websites | David Oladipupo" },
  description:
    "Projects by David Oladipupo: Synvora, an AI skincare iOS app; Pickup, an AI voice intake agent; and websites built with Next.js. Each has a case study and a live link.",
  alternates: { canonical: "/work" },
  openGraph: { url: "/work", title: "Projects by David Oladipupo", description: "Synvora, Pickup and more: AI products built end to end." },
};

export default function WorkPage() {
  const projects = getProjects();

  return (
    <>
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": abs("/work#projects"),
        url: abs("/work"),
        name: `Projects by ${site.fullName}`,
        isPartOf: { "@id": abs("/#website") },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/work/${p.slug}`), name: p.title })),
        },
      }}
    />
    <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Projects", path: "/work" }])} />
    <Section as="h1" index="01" eyebrow={`Projects.dir / ${String(projects.length).padStart(2, "0")} shipped`} title="Projects" className="border-t-0 pt-32">
      <p className="-mt-6 mb-12 max-w-xl text-[15px] leading-7 text-[var(--color-muted)]">
        Hover a project to watch it run. Click one for the story behind it, with a link to the live site.
      </p>
      <ProjectList projects={projects} as="h2" />
    </Section>
    </>
  );
}
