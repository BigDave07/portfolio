/**
 * Single source of truth for personal details.
 * Update these as things change — nothing else needs to change.
 */
export const site = {
  name: "David",
  /** Shown in the browser tab / metadata. */
  fullName: "David Oladipupo",
  role: "Computer Science Student",
  /** One-line positioning statement — the most important sentence on the site. */
  tagline:
    "Computer science student building software and machine learning projects — open to SWE/ML internships.",
  location: "Regina, SK, Canada",
  /** Absolute URL of the deployed site (used for metadata / OG / sitemap). Update when you deploy. */
  url: "https://davidoladipupo.dev",
  email: "daveed3k3k@gmail.com",
  /** Path to your resume in /public. Add public/resume.pdf when ready. */
  resume: "/resume.pdf",

  /** 2–3 sentence bio for the About section. */
  bio: [
    "I'm a computer science student at the University of Regina with strong interests in AI, machine learning, and software development. Recent IBM certifications in Python for Data Science, SQL, and Machine Learning reflect a focus on practical, data-driven skill-building.",
    "As a software intern at RCCG Mount Zion Parish, I built and maintain a responsive community website with a focus on clean, user-friendly design. I'm currently open to SWE/ML internships and collaborations.",
  ],

  links: {
    github: "https://github.com/BigDave07",
    linkedin: "https://www.linkedin.com/in/david-oladipupo-088668326/",
    email: "mailto:daveed3k3k@gmail.com",
  },
} as const;

/** Convenience array for rendering social links in order. */
export const socials = [
  { label: "GitHub", href: site.links.github },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "Email", href: site.links.email },
] as const;
