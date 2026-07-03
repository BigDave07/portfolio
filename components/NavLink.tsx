"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Nav item with an animated underline that grows from the left on hover / active. */
export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const base = href.split("#")[0];
  // Section links (e.g. "/#about") and the home link never show as "active" here.
  const active = base !== "/" && base !== "" && pathname.startsWith(base);

  return (
    <Link
      href={href}
      className="group relative py-1 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
    >
      {label}
      <span
        className={`absolute -bottom-0.5 left-0 h-px bg-[var(--color-accent)] transition-all duration-300 ease-out ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}
