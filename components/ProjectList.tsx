"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ProjectMeta } from "@/lib/content";

/** Preview window size (px): wide for site captures, tall for phone app recordings. */
const SIZE = { browser: { w: 380, h: 238 }, phone: { w: 200, h: 434 } } as const;

/**
 * Index-style project list. Hovering a row floats a preview window by the cursor that plays a
 * scroll-through of the live site; the row itself opens the live site (or the case study when
 * there's no live link). Touch / reduced-motion visitors get the static thumbnails instead.
 */
export function ProjectList({ projects, as: Heading = "h3" }: { projects: ProjectMeta[]; /** Heading level for project titles; use "h2" when the page title is an h1. */ as?: "h2" | "h3" }) {
  const [active, setActive] = useState<ProjectMeta | null>(null);
  const [canFloat, setCanFloat] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const size = SIZE[active?.previewShape ?? "browser"];
  const sizeRef = useRef(size);
  sizeRef.current = size;

  useEffect(() => {
    setCanFloat(
      matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  // Follow the cursor with a little lag so the window feels attached, not glued.
  useEffect(() => {
    if (!canFloat) return;
    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX + 24;
      pos.current.ty = e.clientY - sizeRef.current.h / 2;
    };
    addEventListener("pointermove", onMove);
    let raf = 0;
    const tick = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.16;
      p.y += (p.ty - p.y) * 0.16;
      // Keep the window on screen.
      const { w, h } = sizeRef.current;
      const x = Math.min(p.x, innerWidth - w - 16);
      const y = Math.max(16, Math.min(p.y, innerHeight - h - 16));
      if (box.current) box.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [canFloat]);

  // Restart the clip each time a new project is hovered.
  useEffect(() => {
    const v = video.current;
    if (!v || !active?.preview) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [active]);

  return (
    <>
      <ul className="group/list border-t border-[var(--color-border)]" onPointerLeave={() => setActive(null)}>
        {projects.map((p, i) => {
          return (
            <li
              key={p.slug}
              onPointerEnter={() => setActive(p)}
              className="group/row relative border-b border-[var(--color-border)] transition-opacity duration-300 group-hover/list:opacity-40 hover:!opacity-100"
            >
              <div className="grid grid-cols-[2.5rem_1fr] items-center gap-x-4 gap-y-4 py-7 sm:grid-cols-[3rem_1fr_11rem] sm:gap-x-8">
                <span className="self-start pt-2 font-mono text-xs text-[var(--color-faint)]">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <Heading className="font-serif text-3xl leading-tight text-[var(--color-fg)] sm:text-[2.6rem]">
                    {/* Stretched link: the whole row opens the case study (the live site is one click further). */}
                    <Link
                      href={`/work/${p.slug}`}
                      className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-[var(--color-accent)]"
                    >
                      {p.title}
                      <span className="ml-3 inline-block align-middle font-mono text-sm text-[var(--color-accent)] opacity-0 transition-all duration-300 group-hover/row:translate-x-1 group-hover/row:opacity-100">
                        →
                      </span>
                    </Link>
                  </Heading>
                  <ul className="mt-3 flex flex-wrap gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
                    {[p.category, p.year, ...p.stack.slice(0, 3)].map((t) => (
                      <li key={t} className="rounded-sm border border-[var(--color-border)] px-2 py-0.5">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 max-w-2xl text-[15px] leading-6 text-[var(--color-muted)]">{p.summary}</p>
                </div>

                <Thumb project={p} className="col-span-2 aspect-[16/10] w-full sm:col-span-1" />
              </div>
            </li>
          );
        })}
      </ul>

      {canFloat && (
        <div
          ref={box}
          aria-hidden
          className={`pointer-events-none fixed left-0 top-0 z-[60] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl transition-[opacity,scale,width,height] duration-300 ${active?.previewShape === "phone" ? "rounded-[1.75rem]" : "rounded-xl"}`}
          style={{ width: size.w, height: size.h, opacity: active ? 1 : 0, scale: active ? "1" : "0.92" }}
        >
          {active?.preview ? (
            <video
              ref={video}
              key={active.preview}
              src={active.preview}
              poster={active.poster}
              muted
              loop
              playsInline
              autoPlay
              className="size-full object-cover object-top"
            />
          ) : active ? (
            <Thumb project={active} className="size-full" />
          ) : null}
          {active && (
            <span className="absolute bottom-2 left-2 rounded-full bg-[var(--color-bg)]/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)] backdrop-blur">
              View project →
            </span>
          )}
        </div>
      )}
    </>
  );
}

/** Static still of the project, or a typographic card when there's no capture yet. */
function Thumb({ project, className }: { project: ProjectMeta; className: string }) {
  if (project.poster) {
    const phone = project.previewShape === "phone";
    return (
      // eslint-disable-next-line @next/next/no-img-element -- small static posters; next/image adds nothing here
      <img
        src={project.poster}
        alt=""
        loading="lazy"
        className={`rounded-lg border border-[var(--color-border)] object-top ${phone ? "bg-[var(--color-surface)] object-contain py-2" : "object-cover"} ${className}`}
      />
    );
  }
  return (
    <div className={`grid place-items-center rounded-lg border border-[var(--color-border)] bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--color-accent)_14%,transparent),transparent_60%)] ${className}`}>
      <span className="px-3 text-center font-serif text-xl italic text-[var(--color-muted)]">{project.title.split(":")[0]}</span>
    </div>
  );
}
