import { getProject, getProjects } from "@/lib/content";
import { abs } from "@/lib/seo";
import { skillGroups } from "@/data/skills";
import { site } from "@/data/site";

export const dynamic = "force-static";

const plain = (mdx: string) =>
  mdx.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\n{3,}/g, "\n\n").trim();

/** The whole site as one plain-text document, so an AI assistant can read everything in a single fetch. */
export function GET() {
  const experience = site.experience
    .map((e) => `### ${e.role}, ${e.org} (${e.when})\n${e.points.map((p) => `- ${p}`).join("\n")}`)
    .join("\n\n");
  const projects = getProjects()
    .map((p) => {
      const body = getProject(p.slug)?.content ?? "";
      return `### ${p.title} (${p.year}, ${p.category})\nURL: ${abs(`/work/${p.slug}`)}${p.live ? `\nLive site: ${p.live}` : ""}\nStack: ${p.stack.join(", ")}\nResult: ${p.metric}\n\n${p.summary}\n\n${plain(body)}`;
    })
    .join("\n\n");
  const skills = skillGroups.map((g) => `- ${g.title}: ${g.items.join(", ")}`).join("\n");

  const text = `# ${site.fullName}: full site text

${site.seo.description}

Location: ${site.location}. Contact: ${site.email}. LinkedIn: ${site.links.linkedin}. GitHub: ${site.links.github}.

## About

${site.bio.join("\n\n")}

## Experience

${experience}

## Projects

${projects}

## Skills

${skills}

## Education and certifications

${site.education}

${site.certifications}
`;
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
