import { getProjects } from "@/lib/content";
import { abs } from "@/lib/seo";
import { site } from "@/data/site";

export const dynamic = "force-static";

/** llms.txt: a short, plain-text map of the site for AI assistants (https://llmstxt.org). */
export function GET() {
  const projects = getProjects();
  const body = `# ${site.fullName}

> ${site.seo.description}

${site.fullName} is based in ${site.seo.city}, ${site.seo.region}, Canada and is open to software engineering and AI engineering roles. Email: ${site.email}.

## Main pages

- [Home](${abs("/")}): who David is and what he is working on now
- [About](${abs("/about")}): story, work history, skills, education and certifications
- [Projects](${abs("/work")}): case studies with live links

## Projects

${projects.map((p) => `- [${p.title}](${abs(`/work/${p.slug}`)}): ${p.summary}`).join("\n")}

## Elsewhere

- [GitHub](${site.links.github})
- [LinkedIn](${site.links.linkedin})
- [Resume (PDF)](${abs(site.resume)})

## Optional

- [Full text of this site](${abs("/llms-full.txt")})
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
