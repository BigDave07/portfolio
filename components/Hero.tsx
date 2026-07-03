"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { site, socials } from "@/data/site";

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="container-page flex min-h-[82vh] flex-col justify-center py-24">
      <motion.p
        {...rise(0)}
        className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-accent)]"
      >
        {site.role} · {site.location}
      </motion.p>

      <motion.h1
        {...rise(0.08)}
        className="max-w-4xl font-serif text-5xl font-light leading-[1.05] tracking-tight text-[var(--color-fg)] text-balance sm:text-6xl md:text-7xl"
      >
        {site.tagline}
      </motion.h1>

      <motion.div
        {...rise(0.18)}
        className="mt-10 flex flex-wrap items-center gap-4"
      >
        <Link
          href="/work"
          className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
        >
          View work
        </Link>
        <a
          href={site.resume}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-6 py-3 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-accent)]"
        >
          Resume
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </motion.div>

      <motion.ul
        {...rise(0.26)}
        className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--color-muted)]"
      >
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
      </motion.ul>
    </section>
  );
}
