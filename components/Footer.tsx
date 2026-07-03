import { GithubLogo, LinkedinLogo, EnvelopeSimple, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { site, socials } from "@/data/site";

const icons = { GitHub: GithubLogo, LinkedIn: LinkedinLogo, Email: EnvelopeSimple } as const;

export function Footer() {
  return (
    <footer
      id="contact"
      className="container-page border-t border-[var(--color-border)] py-20"
    >
      <div className="flex flex-col gap-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-lg">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Get in touch
          </p>
          <a
            href={site.links.email}
            className="group inline-flex items-center gap-2 font-serif text-3xl font-light text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent)] sm:text-4xl"
          >
            {site.email}
            <ArrowUpRight
              weight="bold"
              className="size-6 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
            />
          </a>
        </div>

        <ul className="flex items-center gap-3">
          {socials.map((s) => {
            const Icon = icons[s.label as keyof typeof icons];
            return (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.external ? "_blank" : undefined}
                  rel={s.external ? "noreferrer" : undefined}
                  aria-label={s.label}
                  className="pressable grid size-11 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-fg)]"
                >
                  <Icon weight="regular" className="size-5" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-14 text-xs text-[var(--color-faint)]">
        © {new Date().getFullYear()} {site.fullName}. Built with Next.js and Tailwind.
      </p>
    </footer>
  );
}
