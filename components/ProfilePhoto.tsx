"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";

/**
 * Animated profile photo frame.
 * - Entrance: clip-reveal + rise (CSS).
 * - Idle: gentle float.
 * - Border: slow rotating amber "beam".
 * - Hover (fine pointers): subtle zoom + amber glow.
 * Falls back to the DO monogram if the image is missing.
 * Motion collapses to static under prefers-reduced-motion.
 */
export function ProfilePhoto({ src = "/David01.jpeg" }: { src?: string }) {
  const [errored, setErrored] = useState(false);

  return (
    <div className="photo-reveal relative mx-auto w-full max-w-[21rem]">
      <div className="float-y group relative h-[26rem] w-full sm:h-[30rem]">
        {/* hover glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-[var(--color-accent)]/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* rotating beam frame */}
        <div className="beam absolute inset-0 rounded-[1.5rem]">
          <div className="beam-inner rounded-[calc(1.5rem-2px)] bg-[var(--color-surface)]">
            {errored ? (
              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[var(--color-accent)]/16 via-transparent to-transparent">
                <Logo className="h-16 w-auto text-[var(--color-fg)]" />
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt="David Oladipupo"
                onError={() => setErrored(true)}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-center transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.04]"
              />
            )}
            {/* depth gradient at the base */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-bg)]/55 to-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
