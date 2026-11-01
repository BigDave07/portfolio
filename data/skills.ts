/** Grouped, honest skill list (from the resume). Keep each group tight. */
export const skillGroups: { title: string; items: string[] }[] = [
  {
    title: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "PHP", "C++", "SQL", "HTML / CSS"],
  },
  {
    title: "AI / LLM",
    items: [
      "Claude API",
      "Gemini",
      "Prompt engineering",
      "Structured outputs",
      "Tool calling",
      "Agent orchestration",
      "Vision-language models",
      "RAG",
      "Evaluation sets",
      "MCP",
    ],
  },
  {
    title: "Backend & Data",
    items: ["Supabase (Postgres, Edge Functions, Auth)", "MySQL", "FastAPI", "Twilio", "REST APIs", "PostHog"],
  },
  {
    title: "Frontend & Mobile",
    items: ["Next.js", "React Native (Expo, Expo Router)", "Tailwind", "NativeWind", "Framer Motion"],
  },
  {
    title: "ML",
    items: ["PyTorch / TensorFlow fundamentals", "scikit-learn", "pandas", "NumPy", "YOLOv8", "Tableau", "Power BI"],
  },
  {
    title: "Tooling",
    items: ["Git / GitHub", "Claude Code", "Vercel", "Google Cloud", "RevenueCat", "TestFlight"],
  },
];
