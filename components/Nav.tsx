import Link from "next/link";
import { site } from "@/data/site";
import { ThemeToggle } from "@/components/ThemeToggle";

const items = [
  { label: "Work", href: "/work" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/#about" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-[var(--color-fg)] transition-opacity hover:opacity-70"
        >
          {site.name}
          <span className="text-[var(--color-accent)]">.</span>
        </Link>

        <div className="flex items-center gap-6">
          <ul className="hidden items-center gap-6 text-sm text-[var(--color-muted)] sm:flex">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-[var(--color-fg)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
