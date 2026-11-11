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
      "Technical cofounder of Synvora and founder of Pickup. I take AI products from customer discovery to production. Software Engineering at the University of Regina, Dec 2026.",
  },

  /** Search / social metadata. Titles stay under ~60 chars, descriptions under ~160. */
  seo: {
    title: "David Oladipupo | Software Engineer & AI Builder in Regina, Canada",
    description:
      "David Oladipupo is a software engineer and technical cofounder in Regina, Canada, building AI products end to end, including the Synvora iOS app and Pickup voice agent.",
    /** ISO date of the last meaningful content update; feeds the sitemap. Bump when you change the site's content. */
    updated: "2026-11-01",
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
      { label: "Studying", value: "Software Engineering, U of Regina, Dec 2026" },
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
    "I'm also building Pickup, a multi-tenant AI receptionist for law firms and local businesses, validated through 30+ customer discovery calls. I've interned as an AI software intern at Autodesk (2024) and as a software engineer intern at Farm Credit Canada (2025 to 2026). I'm finishing my Software Engineering degree at the University of Regina (December 2026) and I'm open to SWE and AI engineering roles.",
  ],

  /** Work history, used by the AI agent (and anywhere else that needs it). Newest first; from the Nov 2026 resume. */
  experience: [
    {
      role: "Founder",
      org: "Pickup and Synvora",
      when: "May 2026 - present",
      points: [
        "Pickup (AI voice intake agent): conducted 30+ customer discovery calls across Regina, Saskatoon, Winnipeg, Calgary and Edmonton to validate intake failures in local firms.",
        "Validated the problem with two law firms, confirming paid-search leads were dropping before consultation booking.",
        "Built a working voice agent demo that qualifies inbound callers and books consultations into firm calendars, on Vercel and Google Cloud telephony.",
        "Architected the missed-call recovery MVP on Twilio, the Claude API, Supabase and a Next.js dashboard.",
        "Run direct outreach to target firms and handle technical pre-sales conversations with non-technical business owners.",
        "Position Pickup as a multi-tenant AI receptionist for law firms and local service businesses through trypickup.dev.",
        "Synvora (skincare analysis app): delivered a consumer iOS app from an empty repo to App Store launch, then built backend systems with LLM routing, caching and safety controls.",
      ],
    },
    {
      role: "Software Engineer Intern",
      org: "Farm Credit Canada (FCC), Regina",
      when: "Aug 2025 - Oct 2026",
      points: [
        "Built backend features for internal tools using Python and TypeScript in a collaborative development environment.",
        "Developed REST API endpoints to support data exchange between internal systems and user-facing applications.",
        "Tested application changes and reported defects before release to improve stability and usability.",
        "Supported technical discovery by gathering requirements and clarifying feature scope with teammates.",
        "Implemented data queries and validation checks to improve reliability across internal reporting workflows.",
      ],
    },
    {
      role: "AI Software Intern",
      org: "Autodesk, Toronto",
      when: "May 2024 - Sept 2024",
      points: [
        "Developed retrieval-augmented generation flows to ground responses in relevant internal content.",
        "Built API integrations to connect model outputs with downstream product and workflow systems.",
        "Designed LLM evaluation sets to compare response quality across common user scenarios.",
        "Implemented agent orchestration patterns to coordinate tool use and structured response handling.",
        "Reviewed model failures and updated guardrails for safer, more consistent responses.",
        "Refined SQL queries to support data checks, analysis and experiment review.",
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
    "Bachelor of Science, Software Engineering, University of Regina, expected December 2026. Coursework: Data Structures, Algorithms, Software Engineering, Machine Learning, Embedded Systems (Arduino).",
  certifications:
    "IBM Machine Learning Professional Certificate, IBM Python for Data Science, and IBM RAG and Agentic AI Professional Certificate.",

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
  "Hackathon winner",
  "Open to SWE + AI roles",
];
