import type { CSSProperties } from "react";
import { CopyEmail } from "@/components/CopyEmail";
import { LocalClock } from "@/components/hud/LocalClock";
import { site, socials } from "@/data/site";

const label = "font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-faint)]";
const i = (n: number) => ({ "--i": n }) as CSSProperties;

/**
 * Outro: closing statement, email front and centre, then a full-width wordmark whose letters
 * rise into place as you reach the bottom (CSS scroll timeline; static where unsupported).
 */
export function Footer() {
  const [first, last] = site.fullName.split(" ");
  const words = ["Let's", "build"];
  const words2 = ["something", "real."];

  return (
    <footer id="contact" className="relative mt-24 overflow-hidden border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-[90rem] px-5 pt-24 sm:px-8 sm:pt-32">
        <p className={label}>
          <span className="text-[var(--color-accent)]">●</span> You made it to the end
        </p>

        <h2 className="mt-5 font-serif text-[clamp(3.5rem,11vw,10.5rem)] leading-[0.88] tracking-tight">
          <span className="block">
            {words.map((w, n) => (
              <span key={w} style={i(n)} className="outro-word mr-[0.22em] inline-block">
                {w}
              </span>
            ))}
          </span>
          <em className="block text-[var(--color-accent)]">
            {words2.map((w, n) => (
              <span key={w} style={i(n + 2)} className="outro-word mr-[0.22em] inline-block">
                {w}
              </span>
            ))}
          </em>
        </h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="max-w-lg text-[16px] leading-7 text-[var(--color-muted)]">
              Hiring, building something, or just curious how Synvora or Pickup work? My inbox is open, and I reply fast.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={site.links.email}
                className="group relative py-2 font-serif text-[clamp(1.75rem,4.5vw,3.75rem)] leading-none text-[var(--color-fg)]"
              >
                {site.email}
                <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100" />
              </a>
              <CopyEmail email={site.email} />
            </div>
          </div>

          <a
            href="#main"
            className="pressable group inline-flex size-28 flex-col items-center justify-center self-start rounded-full border border-[var(--color-border)] font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-fg)] lg:self-end"
          >
            <span className="mb-1 text-lg transition-transform group-hover:-translate-y-1">↑</span>
            Back to top
          </a>
        </div>

        <div className="mt-16 grid gap-8 border-t border-[var(--color-border)] pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label="Site">
            <p className={label}>Explore</p>
            <ul className="mt-1 flex flex-wrap gap-x-5 text-sm">
              {[["Projects", "/work"], ["About", "/about"], ["Synvora", "/work/synvora"], ["Pickup", "/work/pickup"]].map(([name, href]) => (
                <li key={href}>
                  <a href={href} className="inline-flex min-h-11 items-center text-[var(--color-fg)] hover:text-[var(--color-accent)]">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className={label}>Elsewhere</p>
            <ul className="mt-1 flex flex-wrap gap-x-5 text-sm">
              {socials
                .filter((s) => s.label !== "Email")
                .map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="me noopener noreferrer" className="inline-flex min-h-11 items-center text-[var(--color-fg)] hover:text-[var(--color-accent)]">
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              <li>
                <a href={site.resume} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-[var(--color-fg)] hover:text-[var(--color-accent)]">
                  Resume ↗
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className={label}>Based in</p>
            <p className="mt-3 text-sm text-[var(--color-fg)]">
              Regina, SK <span className="text-[var(--color-faint)]">·</span> <LocalClock timeZone={site.timeZone} />
            </p>
          </div>
          <div>
            <p className={label}>Status</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-[var(--color-fg)]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--color-accent)] opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-[var(--color-accent)]" />
              </span>
              Open to SWE + AI engineering roles
            </p>
          </div>
        </div>
      </div>

      {/* Full-bleed wordmark, bottom cropped so it reads as the ground the page stands on. */}
      <p
        aria-hidden
        className="pointer-events-none mt-16 select-none whitespace-nowrap text-center font-serif text-[21.5vw] italic leading-[0.78] tracking-[-0.04em]"
      >
        {last.split("").map((ch, n) => (
          <span key={n} style={i(n)} className="outro-letter inline-block">
            {ch}
          </span>
        ))}
      </p>

      <div className="relative mx-auto flex max-w-[90rem] flex-wrap justify-between gap-2 px-5 pb-6 pr-24 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-faint)] sm:px-8">
        <span>
          © {new Date().getFullYear()} {first} {last}
        </span>
        <span>Built from scratch with Next.js, Three.js &amp; Claude</span>
      </div>
    </footer>
  );
}
