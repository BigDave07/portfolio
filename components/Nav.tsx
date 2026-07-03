import Link from "next/link";
import { site } from "@/data/site";
import { NavLink } from "@/components/NavLink";
import { ThemeToggle } from "@/components/ThemeToggle";

const items = [
  { label: "Work", href: "/work" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/#about" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)]/60 bg-[var(--color-bg)]/70 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-[var(--color-fg)] transition-opacity hover:opacity-70"
        >
          {site.name}
          <span className="text-[var(--color-accent)]">.</span>
        </Link>

        <div className="flex items-center gap-6">
          <ul className="hidden items-center gap-6 sm:flex">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} />
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
