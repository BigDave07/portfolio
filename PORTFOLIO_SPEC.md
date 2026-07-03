# Portfolio Design Spec — Software + AI Engineer

A research-backed spec for a **top-1%** portfolio positioning you as a strong software engineer who also ships real AI/ML work. This is a build blueprint, not the site itself.

**Positioning statement (draft):**
> Software engineer who ships production AI — from full-stack apps to LLM agents and ML systems.

---

## 1. What separates a top-1% portfolio

Distilled from curated collections (emmabostian/developer-portfolios) and reference portfolios (Brittany Chiang, Lee Robinson, Nikita Kozodoi, and AI/agentic-engineer examples).

- **Instant positioning above the fold.** One line stating role + specialization — not a generic "Hi, I'm X."
- **Proof over claims.** Live demos, real metrics/benchmarks, links straight to code. For AI/ML: model demos, benchmark/eval tables, model cards — not a skills list.
- **Depth on 2–4 flagship projects** over a long shallow grid. Each: problem → approach → stack → *measurable* outcome → live link + repo.
- **Craft as signal.** Restrained, fast, accessible design. For engineers, polish itself is evidence of quality.
- **Writing.** A blog / technical write-ups show communication and deepen the AI/ML story (design decisions, tradeoffs, post-mortems).
- **Fast, accessible, responsive.** High Lighthouse scores, keyboard nav, mobile-clean. Top portfolios feel noticeably snappy.
- **Clear CTA + easy contact.** Resume, GitHub, LinkedIn, email — all one click away.

**AI/ML-specific expectations:** interactive demos, benchmark/eval tables, links to notebooks or HF Spaces, model/architecture notes, and honest tradeoff discussion.

Sources: [developer-portfolios](https://github.com/emmabostian/developer-portfolios) · [Colorlib](https://colorlib.com/wp/developer-portfolios/) · [Kozodoi](https://kozodoi.com/portfolio) · [SitesPlaced](https://sitesplaced.com/blog/best-portfolio-website-for-software-engineers)

---

## 2. Sections (in order) + content checklist

### 1. Hero
- [ ] Name
- [ ] One-line positioning statement (above)
- [ ] Primary CTA (View work) + secondary (Resume)
- [ ] Social links (GitHub, LinkedIn, email)
- [ ] Subtle entrance motion — no fluff

### 2. Selected work — 3–4 flagship projects
For each project (mix at least one AI/ML project *with a demo or eval numbers* and one strong software/full-stack project):
- [ ] Title + one-line summary
- [ ] Problem being solved
- [ ] Approach (short)
- [ ] Stack / tools
- [ ] **Measurable outcome** (latency, accuracy, users, revenue, eval score…)
- [ ] Live demo link + repo link
- [ ] For AI/ML: benchmark/eval table or model card, architecture note

### 3. About
- [ ] Short narrative connecting software depth + AI focus
- [ ] Headshot (optional)
- [ ] Current focus / what you're looking for

### 4. Skills / stack (grouped, tight, honest)
- [ ] Languages
- [ ] Frontend
- [ ] Backend
- [ ] AI/ML (models, frameworks, eval, serving)
- [ ] Infra / DevOps

### 5. Writing / notes
- [ ] 1–2 technical posts or build logs to start (design decisions, tradeoffs, post-mortems)

### 6. Contact / footer
- [ ] Email, GitHub, LinkedIn
- [ ] Resume PDF
- [ ] Copyright / built-with line

---

## 3. Recommended tech stack

- **Next.js (App Router) + TypeScript + Tailwind CSS**
- **Content:** MDX — projects and blog posts as MDX files
- **Motion:** Framer Motion, used sparingly
- **Deploy:** Vercel + custom domain
- **Quality bar:** Lighthouse 95+ across all four categories, semantic HTML, keyboard-accessible, dark mode

**Design direction:** editorial, minimal, "AI-era precision" — serif or high-contrast display headline, clean sans body text, generous whitespace, one restrained accent color, subtle grain/depth. Fast first, decorative second.

---

## 4. Suggested Next.js file / route structure

```
Portfolio/
├── app/
│   ├── layout.tsx            # root layout, fonts, theme provider
│   ├── page.tsx              # home: hero + selected work + about + skills + contact
│   ├── work/
│   │   ├── page.tsx          # full project index
│   │   └── [slug]/page.tsx   # project case study (renders MDX)
│   ├── writing/
│   │   ├── page.tsx          # blog index
│   │   └── [slug]/page.tsx   # post (renders MDX)
│   └── globals.css           # Tailwind + base styles
├── components/
│   ├── Hero.tsx
│   ├── ProjectCard.tsx
│   ├── SkillGroup.tsx
│   ├── Nav.tsx
│   └── Footer.tsx
├── content/
│   ├── projects/*.mdx        # one file per flagship project
│   └── writing/*.mdx         # one file per post
├── lib/
│   └── content.ts            # load/parse MDX frontmatter
├── public/
│   ├── resume.pdf
│   └── og/                   # social preview images
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

---

## 5. Before you build (do this first)

- [ ] Pick your 3–4 flagship projects (ensure ≥1 AI/ML with a demo or numbers)
- [ ] Gather **metrics** for each (the outcome line is what sells)
- [ ] Finalize your one-line positioning statement
- [ ] Grab a domain (yourname.dev / .com)
- [ ] Collect assets: headshot, resume PDF, project screenshots/GIFs
- [ ] Draft 1 short technical post

---

*Next step: once you've picked flagship projects and approved this spec, scaffold the Next.js site from the structure above.*
