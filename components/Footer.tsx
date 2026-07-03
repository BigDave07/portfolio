import { site, socials } from "@/data/site";

export function Footer() {
  return (
    <footer
      id="contact"
      className="container-page border-t border-[var(--color-border)] py-16"
    >
      <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Get in touch
          </p>
          <a
            href={site.links.email}
            className="font-serif text-2xl font-light text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent)] sm:text-3xl"
          >
            {site.email}
          </a>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--color-muted)]">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="transition-colors hover:text-[var(--color-fg)]"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-12 text-xs text-[var(--color-faint)]">
        © {new Date().getFullYear()} {site.fullName}. Built with Next.js &amp; Tailwind.
      </p>
    </footer>
  );
}
