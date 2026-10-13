import { site } from "@/data/site";
import type { ProjectMeta } from "@/lib/content";

/** Absolute URL on the canonical domain. */
export const abs = (path = "/") => {
  const base = site.url.replace(/\/$/, "");
  if (path === "/") return base; // the root has no trailing slash, matching its canonical tag
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

/** Stable ids so schema nodes can reference each other across pages. */
export const ids = {
  person: abs("/#person"),
  website: abs("/#website"),
  synvora: abs("/#synvora"),
  pickup: abs("/#pickup"),
};

const portrait = abs("/ai/portrait.jpg");

const orgs = [
  { "@type": "Organization", "@id": ids.synvora, name: "Synvora", url: "https://synvoraskin.com", description: "Consumer skincare AI app (iOS and web).", founder: { "@id": ids.person } },
  { "@type": "Organization", "@id": ids.pickup, name: "Pickup", url: "https://trypickup.dev", description: "Multi-tenant AI voice intake agent for law firms and local service businesses.", founder: { "@id": ids.person } },
];

const person = {
  "@type": "Person",
  "@id": ids.person,
  name: site.fullName,
  url: abs("/"),
  image: portrait,
  jobTitle: site.role,
  description: site.seo.description,
  email: site.email,
  address: { "@type": "PostalAddress", addressLocality: site.seo.city, addressRegion: site.seo.region, addressCountry: site.seo.country },
  knowsAbout: site.seo.knowsAbout,
  sameAs: [site.links.github, site.links.linkedin],
  worksFor: [{ "@id": ids.synvora }, { "@id": ids.pickup }],
  affiliation: { "@type": "EducationalOrganization", name: site.seo.university },
};

/** Sitewide graph: who David is, the site, and the two companies he founded. Rendered once in the layout. */
export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    person,
    ...orgs,
    {
      "@type": "WebSite",
      "@id": ids.website,
      url: abs("/"),
      name: site.fullName,
      description: site.seo.description,
      inLanguage: "en-CA",
      publisher: { "@id": ids.person },
    },
  ],
};

export const aboutGraph = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": abs("/about#profile"),
  url: abs("/about"),
  name: `About ${site.fullName}`,
  inLanguage: "en-CA",
  dateModified: site.seo.updated,
  isPartOf: { "@id": ids.website },
  mainEntity: { "@id": ids.person },
};

export function breadcrumbs(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function projectGraph(p: ProjectMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": abs(`/work/${p.slug}#project`),
    url: abs(`/work/${p.slug}`),
    name: p.title,
    headline: p.title,
    description: `${p.summary} ${p.metric}.`,
    genre: p.category,
    dateCreated: p.year,
    inLanguage: "en-CA",
    keywords: p.stack.join(", "),
    author: { "@id": ids.person },
    creator: { "@id": ids.person },
    ...(p.poster ? { image: abs(p.poster) } : {}),
    ...(p.live ? { sameAs: [p.live], mainEntityOfPage: abs(`/work/${p.slug}`) } : {}),
  };
}
