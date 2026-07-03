/**
 * Single source of truth for personal details.
 * Swap these placeholder values for your real content — nothing else needs to change.
 */
export const site = {
  name: "Daveed",
  /** Shown in the browser tab / metadata. */
  fullName: "Daveed",
  role: "Software Engineer",
  /** One-line positioning statement — the most important sentence on the site. */
  tagline:
    "Software engineer shipping production AI — from full-stack apps to LLM agents and ML systems.",
  location: "Remote",
  /** Absolute URL of the deployed site (used for metadata / OG / sitemap). */
  url: "https://daveed.dev",
  email: "daveed3k3k@gmail.com",
  /** Path to your resume in /public. Replace public/resume.pdf with the real file. */
  resume: "/resume.pdf",

  /** 2–3 sentence bio for the About section. */
  bio: [
    "I'm a software engineer who ships end-to-end: full-stack products on one side, LLM agents and ML systems on the other. I care about the boring parts that make software feel fast and trustworthy.",
    "Most of my recent work lives at the seam between application code and AI — turning models into reliable, measurable product features rather than demos.",
  ],

  links: {
    github: "https://github.com/your-handle",
    linkedin: "https://linkedin.com/in/your-handle",
    x: "https://x.com/your-handle",
    email: "mailto:daveed3k3k@gmail.com",
  },
} as const;

/** Convenience array for rendering social links in order. */
export const socials = [
  { label: "GitHub", href: site.links.github },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "X", href: site.links.x },
  { label: "Email", href: site.links.email },
] as const;
