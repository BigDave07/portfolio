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
      "Technical cofounder of Synvora and founder of Pickup. I take AI products from customer discovery to production. Computer Science at the University of Regina, Dec 2026.",
  },

  /** Search / social metadata. Titles stay under ~60 chars, descriptions under ~160. */
  seo: {
    title: "David Oladipupo | Software Engineer & AI Builder in Regina, Canada",
    description:
      "David Oladipupo is a software engineer and technical cofounder in Regina, Canada, building AI products end to end, including the Synvora iOS app and Pickup voice agent.",
    /** ISO date of the last meaningful content update; feeds the sitemap. Bump when you change the site's content. */
    updated: "2026-11-16",
    /** Topics David can credibly be associated with (Person schema `knowsAbout`). Facts from the resume only. */
    knowsAbout: [
      "AI engineering",
      "LLM applications",
      "Claude API",
      "Voice agents",
      "React Native",
      "Next.js",
      "TypeScript",
      "Python",
      "Supabase",
      "Machine learning",
      "Retrieval-augmented generation",
      "LLM evaluation",
    ],
    city: "Regina",
    region: "Saskatchewan",
    country: "CA",
    university: "University of Regina",
  },

  location: "Regina, SK, Canada (open to relocation)",
  timeZone: "America/Regina",

  /** Hero: serif headline + the "Now" block on the right. */
  hud: {
    headline: ["I build AI products", "& ship them end to end."],
    now: [
      { label: "Building", value: "Pickup, an AI voice intake agent" },
      { label: "Shipped", value: "Synvora, live on the App Store" },
      { label: "Studying", value: "Computer Science, U of Regina, Dec 2026" },
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
    "I'm also building Pickup, a multi-tenant AI receptionist for law firms and local businesses, validated through 30+ customer discovery calls. I've interned as a software engineer at Pinterest (2024), Google (2025) and Farm Credit Canada (2025 to 2026). I'm finishing my Computer Science degree at the University of Regina (December 2026) and I'm open to SWE and AI engineering roles.",
  ],

  /** Work history, used by the AI agent (and anywhere else that needs it). Newest first; from the Nov 2026 resume. */
  experience: [
    {
      role: "Cofounder & Technical Lead",
      org: "Synvora, Regina",
      when: "July 2026 - present",
      points: [
        "Built and shipped the full product solo as the technical cofounder: a React Native (Expo, TypeScript) iOS app of 39+ screens, a Next.js marketing site, and a Supabase backend, from empty repo to App Store launch in under four months.",
        "Designed a multi-stage LLM backend on Supabase Edge Functions: a three-angle vision scan, a cached verdict layer, a routine assembler, a safety gate, and a conversational coach with memory of prior scans and onboarding answers.",
        "Cut inference cost by routing by task (Claude Sonnet for vision analysis and product verdicts, Haiku for chat) and caching verdicts against a curated product database rather than re-querying per user.",
        "Constrained model output to visible-trait observations rather than diagnosis, a product-safety requirement that shaped the prompt contract and the App Store health-content rating.",
        "Built the product database to 108 curated Canada-available SKUs with engine metadata (fragrance-free flags, ingredient conflicts, pregnancy cautions), merging and cleaning source data from Open Beauty Facts and enriching it via the Claude API.",
      ],
    },
    {
      role: "Founder",
      org: "Pickup",
      when: "May 2026 - present",
      points: [
        "Pickup (AI voice intake agent): conducted 30+ customer discovery calls across Regina, Saskatoon, Winnipeg, Calgary and Edmonton to validate intake failures in local firms.",
        "Validated the problem with two law firms, confirming paid-search leads were dropping before consultation booking.",
        "Built a working voice agent demo that qualifies inbound callers and books consultations into firm calendars, on Vercel and Google Cloud telephony.",
        "Architected the missed-call recovery MVP on Twilio, the Claude API, Supabase and a Next.js dashboard.",
        "Run direct outreach to target firms and handle technical pre-sales conversations with non-technical business owners.",
        "Position Pickup as a multi-tenant AI receptionist for law firms and local service businesses through trypickup.dev.",
      ],
    },
    {
      role: "Software Engineer Intern",
      org: "Farm Credit Canada, Regina",
      when: "Oct 2025 - Apr 2026",
      points: [
        "Built backend features for internal tools in Python and TypeScript in a collaborative development environment.",
        "Developed REST API endpoints supporting data exchange between internal systems and user-facing applications.",
        "Tested application changes and reported defects before release to improve stability and usability.",
        "Supported technical discovery by gathering requirements and clarifying feature scope with teammates.",
        "Implemented data queries and validation checks to improve reliability across internal reporting workflows.",
      ],
    },
    {
      role: "Software Engineer Intern",
      org: "Google, Toronto",
      when: "May 2025 - Sept 2025",
      points: [
        "Developed and maintained backend services for Google Cloud infrastructure.",
        "Designed scalable APIs and improved system performance.",
        "Collaborated with cross-functional teams to ship high-impact features.",
      ],
    },
    {
      role: "Software Engineer Intern",
      org: "Pinterest, Toronto",
      when: "May 2024 - Sept 2024",
      points: [
        "Executed scoped technical tasks end to end, contributing to Pinterest products and infrastructure.",
        "Delivered code that was documented, tested and operable in production.",
        "Collaborated with the team on production-oriented projects supporting company goals.",
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
  education:
    "Computer Science, University of Regina, expected December 2026. Coursework: Data Structures, Algorithms, Software Engineering, Machine Learning, Embedded Systems (Arduino).",
  certifications:
    "IBM Machine Learning Professional Certificate (supervised and unsupervised learning, deep learning, reinforcement learning), IBM Python for Data Science and IBM SQL, 7 IBM certificates in total. In progress: IBM RAG and Agentic AI Professional Certificate.",

  links: {
    github: "https://github.com/BigDave07",
    linkedin: "https://www.linkedin.com/in/david-oladipupo-088668326",
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
  "Hackathon winner",
  "Open to SWE + AI roles",
];
