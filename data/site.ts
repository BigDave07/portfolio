/**
 * Single source of truth for personal details.
 * Update these as things change - nothing else needs to change.
 */
export const site = {
  name: "David",
  /** Shown in the browser tab / metadata. */
  fullName: "David Oladipupo",
  role: "Computer Science Student",
  /** One-line positioning statement, used for metadata / OG. */
  tagline:
    "Computer science student building software and machine learning projects. Open to SWE and ML internships.",

  /** Hero content. headline renders 2 lines with a kinetic reveal; keep it 2 lines at desktop. */
  hero: {
    eyebrow: "Open to SWE / ML internships",
    headline: ["I build software and", "machine learning projects."],
    subtext:
      "Computer science student at the University of Regina, focused on AI, ML, and shipping real work.",
  },

  location: "Regina, SK, Canada",
  /** Absolute URL of the deployed site (used for metadata / OG / sitemap). Update when you deploy. */
  url: "https://davidoladipupo.dev",
  email: "daveed3k3k@gmail.com",
  /** Path to your resume in /public. Add public/resume.pdf when ready. */
  resume: "/resume.pdf",

  /** 2-3 sentence bio for the About section. */
  bio: [
    "I'm a computer science student at the University of Regina with strong interests in AI, machine learning, and software development. Recent IBM certifications in Python for Data Science, SQL, and Machine Learning reflect a focus on practical, data-driven skill-building.",
    "As a software intern at RCCG Mount Zion Parish, I built and maintain a responsive community website with a focus on clean, user-friendly design. I'm currently open to SWE and ML internships and collaborations.",
  ],

  links: {
    // TODO: swap for your real GitHub handle if this changes.
    github: "https://github.com/BigDave07",
    linkedin: "https://www.linkedin.com/in/david-oladipupo-088668326/",
    email: "mailto:daveed3k3k@gmail.com",
  },
} as const;

export const socials = [
  { label: "GitHub", href: site.links.github, external: true },
  { label: "LinkedIn", href: site.links.linkedin, external: true },
  { label: "Email", href: site.links.email, external: false },
] as const;

/** Marquee strip content (kinetic, decorative). */
export const marqueeItems = [
  "Python",
  "Machine Learning",
  "SQL",
  "Deep Learning",
  "Data Analytics",
  "React",
  "Open to internships",
];
