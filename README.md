# oladipupo.dev

David Oladipupo's portfolio: a 3D point-cloud head, a project index with hover previews, and **AI David**,
an agent that chats, talks in David's cloned voice, explains how he fits a role, and books meetings.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Three.js, MDX and the Vercel AI SDK (Claude).

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in keys (see below)
npm run dev                  # http://localhost:3000
npm run build                # production build + typecheck
```

## Editing content

- `data/site.ts`: name, bio, experience, links, hero copy, `showWriting` flag.
- `data/skills.ts`: grouped skill lists.
- `content/projects/*.mdx`: one file per project (frontmatter drives the list; the body is the case study that
  AI David also learns from). `preview` / `poster` point at the hover video and still in `public/projects/`.

AI David's knowledge comes from `data/site.ts`, `data/skills.ts` and the project case studies, so editing those
updates the agent too. Its instructions live in `app/api/chat/route.ts`.

## AI David: chat, voice and booking

| Feature | Needs | If missing |
| --- | --- | --- |
| Text chat | `ANTHROPIC_API_KEY` | Chat shows an error |
| Voice ("Talk to David") | `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID` | Talk buttons are hidden |
| Booking calls | `CAL_API_KEY`, `CAL_EVENT_15`, `CAL_EVENT_30` | Agent just shares your email |
| Lead / booking emails to you | `RESEND_API_KEY` | Agent doesn't offer to pass details along |

Everything degrades cleanly, so the site is safe to deploy with any subset configured.

### 1. Your voice (ElevenLabs)
1. Create an account at elevenlabs.io and pick a plan with **Instant Voice Cloning** (Starter works).
2. Voices -> Add a new voice -> **Instant Voice Clone**. Upload 1-3 minutes of clean audio of you talking naturally
   (quiet room, no music). You must be the speaker or have the speaker's permission.
3. Copy the voice's ID into `ELEVENLABS_VOICE_ID`, and create an API key (Developers -> API keys) for
   `ELEVENLABS_API_KEY`. In the plan settings, leave overage/extra credits **off** so spend can't exceed the plan.
4. Optional: `ELEVENLABS_MODEL=eleven_v4_turbo` for a more expressive voice (default `eleven_flash_v2_5` is fastest/cheapest).

### 2. Booking (Cal.com)
1. Create a free account at cal.com and connect **Google Calendar** (Settings -> Calendars) so busy times block slots.
2. Create two event types: "15 min chat" and "30 min chat". Set working hours, buffers, a minimum notice
   (e.g. 12 hours) and a **limit on bookings per day** (protects you from spam). Choose Google Meet as the location.
3. Settings -> Developer -> API keys: create a key for `CAL_API_KEY`.
4. Each event type's numeric ID is in its URL when you open it in the dashboard: `CAL_EVENT_15` and `CAL_EVENT_30`.

### 3. Email notifications (Resend)
1. Create an account at resend.com and an API key for `RESEND_API_KEY`.
2. Out of the box emails send from `onboarding@resend.dev` to **the email you signed up to Resend with**. To send to a
   different address, verify `oladipupo.dev` in Resend and set `RESEND_FROM="AI David <ai@oladipupo.dev>"` and
   `LEAD_NOTIFY_EMAIL=you@example.com`.

### 4. Deploy
Add the same variables in Vercel (Project -> Settings -> Environment Variables, Production) and redeploy.

### Safety notes
- A Vercel Firewall rule rate-limits `/api/chat` and `/api/tts` (40 requests/min per IP).
- Set a monthly spend limit in the Anthropic console.
- Tools validate their input, require the visitor's explicit agreement before booking or sharing details, and the
  agent is instructed never to invent facts about David.
- `CAL_MOCK=1` (local development only) swaps in a fake calendar so you can try the booking flow without Cal.com.

## SEO

What is built in:
- Per-page titles, descriptions, canonical URLs and Open Graph / X cards, with generated share images for the site and every project.
- Structured data (JSON-LD): `Person`, the `Organization`s David founded, `WebSite`, `ProfilePage`, `CollectionPage`/`ItemList`, `CreativeWork` per project and `BreadcrumbList`.
- `robots.txt` (search and AI crawlers allowed, `/api/` blocked), `sitemap.xml` (real last-modified dates), `llms.txt` and `llms-full.txt` for AI assistants.
- Speed: Three.js and the voice screen load after the page is idle; Lighthouse (mobile) is ~95+ for performance and 100 for accessibility and SEO.

When you change content, bump `site.seo.updated` in `data/site.ts` so the sitemap reflects it.

Off-site steps (these need your accounts; the code can't do them for you):
1. **Google Search Console**: add `oladipupo.dev` as a *Domain* property (adds a DNS TXT record; Vercel DNS can add it in one click), or use the URL-prefix method and put the token in `GOOGLE_SITE_VERIFICATION`. Then submit `https://oladipupo.dev/sitemap.xml` and use URL Inspection -> Request indexing for `/`, `/about` and `/work`.
2. **Bing Webmaster Tools** (Bing powers ChatGPT search and Copilot): import from Google Search Console, or set `BING_SITE_VERIFICATION`. Submit the same sitemap.
3. **Link back to the site** from every profile you control: LinkedIn (Contact info -> Website, plus the Featured section), GitHub (profile Website field and the repo description), Synvora and Pickup (footer or about page), and any other bio. Links from real sites are the strongest signal for a new domain.
4. Keep the name consistent everywhere: "David Oladipupo", the same photo, and "Software Engineer & AI Builder".

