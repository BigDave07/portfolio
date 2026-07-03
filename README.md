# Portfolio

A fast, accessible, dark-editorial portfolio for a software + AI engineer.
Built with Next.js (App Router), TypeScript, Tailwind CSS v4, and MDX.

## Stack

- **Next.js 15** + React 19 (App Router)
- **Tailwind CSS v4** (design tokens in `app/globals.css`)
- **motion** (Framer Motion) — subtle, `prefers-reduced-motion`-aware
- **MDX** case studies + blog via `next-mdx-remote`
- **next-themes** (dark by default, light toggle)

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + typecheck
npm start        # serve the production build
```

## Editing content

Everything you need to personalize lives in two places — no component edits required:

- **`data/site.ts`** — name, tagline, bio, links, email, resume path.
- **`data/skills.ts`** — grouped skill lists.
- **`content/projects/*.mdx`** — one file per project. Frontmatter drives the cards
  (`title`, `summary`, `category`, `metric`, `stack`, `year`, `live`, `repo`, `order`,
  `featured`); the body is the case study.
- **`content/writing/*.mdx`** — one file per post (`title`, `summary`, `date` frontmatter).

Replace `public/resume.pdf` with your real resume. Set the deployed URL in `data/site.ts`
(`url`) so metadata, Open Graph, and the sitemap resolve correctly.

## Routes

| Route            | Description                        |
| ---------------- | ---------------------------------- |
| `/`              | Hero, selected work, about, skills |
| `/work`          | Full project index                 |
| `/work/[slug]`   | Project case study (MDX)           |
| `/writing`       | Blog index                         |
| `/writing/[slug]`| Post (MDX)                         |

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — the framework preset is detected
   automatically; no config needed.
3. Set your custom domain and update `url` in `data/site.ts`.

## Before you ship

- [ ] Swap placeholder projects/bio for real content
- [ ] Add real `resume.pdf`, screenshots, and a headshot (optional)
- [ ] Run the `site-audit` skill against the dev server
- [ ] Check Lighthouse (aim 95+ across the board)
