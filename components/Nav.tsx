"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, socials } from "@/data/site";

const items = [
  { label: "Work", href: "/work" },
  ...(site.showWriting ? [{ label: "Writing", href: "/writing" }] : []),
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
];

/** Slim top bar: monogram + model tag on the left, numbered links on the right, sheet menu on mobile. */
export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)]/50 bg-[var(--color-bg)]/70 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex max-w-[90rem] items-center justify-between px-5 py-5 font-mono text-xs sm:px-8">
        <Link href="/" className="group -m-2 flex items-center gap-3 p-2">
          <span aria-hidden className="grid size-8 place-items-center rounded-full border border-[var(--color-border)] font-serif text-base italic text-[var(--color-fg)] transition-colors group-hover:border-[var(--color-accent)]">
            d
          </span>
          <span className="hidden text-[var(--color-muted)] sm:inline">
            {site.fullName.toLowerCase()} <span className="text-[var(--color-faint)]">/ software engineer</span>
            <span className="sr-only"> (home)</span>
          </span>
          <span className="sr-only sm:hidden">{site.fullName}, home</span>
        </Link>

        <ul className="hidden items-center gap-7 sm:flex">
          {items.map((item, i) => {
            const active = item.href !== "/" && !item.href.includes("#") && pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group inline-flex items-baseline gap-1.5 uppercase tracking-[0.18em] transition-colors ${
                    active ? "text-[var(--color-fg)]" : "text-[var(--color-muted)] hover:text-[var(--color-fg)]"
                  }`}
                >
                  <span className={active ? "text-[var(--color-accent)]" : "text-[var(--color-faint)]"}>0{i + 1}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-sheet"
          onClick={() => setOpen((o) => !o)}
          className="pressable min-h-11 rounded-full border border-[var(--color-border)] px-5 uppercase tracking-[0.18em] text-[var(--color-fg)] sm:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      <div id="nav-sheet" hidden={!open} className="glass mx-5 rounded-2xl p-5 sm:hidden">
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)} className="flex items-baseline gap-3 py-2.5">
                <span className="font-mono text-xs text-[var(--color-faint)]">0{i + 1}</span>
                <span className="font-serif text-3xl text-[var(--color-fg)]">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-4 flex flex-wrap gap-4 border-t border-[var(--color-border)] pt-4 font-mono text-xs text-[var(--color-faint)]">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target={s.external ? "_blank" : undefined} rel={s.external ? "noreferrer" : undefined}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
