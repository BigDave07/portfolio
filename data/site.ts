/**
 * Single source of truth for personal details.
 * Update these as things change - nothing else needs to change.
 */
export const site = {
  name: "David",
  /** Shown in the browser tab / metadata. */
  fullName: "David Oladipupo",
  role: "Software Engineer & AI Builder",
  /** One-line positioning statement, used for metadata / OG. */
  tagline:
    "Software engineer and technical cofounder shipping AI products end to end: a Claude-powered iOS app and a multi-tenant AI voice agent.",

  /** Hero content. headline renders 2 lines with a kinetic reveal; keep it 2 lines at desktop. */
  hero: {
    eyebrow: "Open to SWE / AI engineering roles",
    headline: ["Hi, I'm David.", "I build AI products."],
    subtext:
      "Technical cofounder of Synvora and founder of Pickup. I take AI products from customer discovery to production. CS @ University of Regina, Dec 2026.",
  },

  location: "Regina, SK, Canada (open to relocation)",
  timeZone: "America/Regina",

  /** Hero: serif headline + the "Now" block on the right. */
  hud: {
    headline: ["I build AI products", "& ship them end to end."],
    now: [
      { label: "Building", value: "Pickup, an AI voice intake agent" },
      { label: "Shipped", value: "Synvora, live on the App Store" },
      { label: "Studying", value: "CS @ University of Regina, Dec 2026" },
      { label: "Open to", value: "SWE + AI engineering roles" },
    ],
  },
  /** Writing section (nav, sitemap, /writing routes). Off until there are new posts. */
  showWriting: false,
  /** Absolute URL of the deployed site (used for metadata / OG / sitemap). Update when you deploy. */
  url: "https://oladipupo.dev",
  email: "daveed3k3k@gmail.com",
  /** Path to your resume in /public. Add public/resume.pdf when ready. */
  resume: "/resume.pdf",

  /** 2-3 sentence bio for the About section. */
  bio: [
    "I'm a software engineer and technical cofounder who ships production systems end to end. At Synvora I built the whole product solo: a 39+ screen React Native iOS app, a Next.js site, and a multi-stage Claude backend on Supabase Edge Functions, from empty repo to the App Store in under four months.",
    "I'm also building Pickup, a multi-tenant AI receptionist for law firms and local businesses, validated through 30+ customer discovery calls. I'm finishing Computer Science at the University of Regina (December 2026) and I'm open to SWE and AI engineering roles.",
  ],

  /** Work history, used by the AI agent (and anywhere else that needs it). */
  experience: [
    {
      role: "Cofounder & Technical Lead",
      org: "Synvora",
      when: "July 2026 - present",
      points: [
        "Built and shipped the full product solo: React Native (Expo, TypeScript) iOS app of 39+ screens, Next.js marketing site and a Supabase backend, from empty repo to App Store launch in under four months.",
        "Designed a multi-stage LLM backend on Supabase Edge Functions: three-angle vision scan, cached verdict layer, routine assembler, safety gate and a conversational coach with memory.",
        "Cut inference cost by routing by task (Claude Sonnet for vision and product verdicts, Haiku for chat) and caching verdicts against a curated product database.",
        "Constrained model output to visible-trait observations rather than diagnosis, a product-safety requirement that shaped the prompt contract and App Store rating.",
        "Built a database of 108 curated Canada-available products with ingredient metadata, cleaned from Open Beauty Facts and enriched via the Claude API.",
      ],
    },
    {
      role: "Founder",
      org: "Pickup (AI voice intake agent)",
      when: "August - present",
      points: [
        "Ran 30+ customer discovery calls across Regina, Saskatoon, Winnipeg, Calgary and Edmonton; validated that paid-search leads die at phone intake, confirmed independently by two law firms.",
        "Built a working voice agent demo that qualifies callers and books consultations into the firm's calendar, deployed on Vercel with Google Cloud telephony.",
        "Architected the missed-call recovery MVP on Twilio, the Claude API, Supabase and a Next.js dashboard; moved to a multi-tenant self-serve platform after benchmarking Vapi and Retell AI.",
      ],
    },
    {
      role: "Web Development Intern",
      org: "RCCG Mount Zion Parish",
      when: "2023 - present",
      points: [
        "Built and maintain the parish website, owning the content workflow end to end.",
        "Building an automated LED-screen display system for lyrics, scripture and service countdowns.",
      ],
    },
    {
      role: "Teaching Assistant, Microsoft Office & Graphics",
      org: "IGT Tutors, Lagos",
      when: "2022 - 2023",
      points: ["Taught Office and Photoshop to 50+ students and gave one-on-one technical mentorship."],
    },
  ],
  education: "Computer Science, University of Regina (2023 - December 2026). Coursework: Data Structures, Algorithms, Software Engineering, Machine Learning, Embedded Systems.",
  certifications: "IBM Machine Learning Professional Certificate (supervised, unsupervised, deep and reinforcement learning), IBM Python for Data Science, IBM SQL: 7 certificates total. In progress: IBM RAG and Agentic AI Professional Certificate.",

  links: {
    github: "https://github.com/BigDave07",
    linkedin: "https://www.linkedin.com/in/david-oladipupo",
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
  "Claude API",
  "TypeScript",
  "React Native",
  "Next.js",
  "Supabase",
  "Python",
  "Agent orchestration",
  "Open to SWE + AI roles",
];
