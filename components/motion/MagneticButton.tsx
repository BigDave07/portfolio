"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  className?: string;
};

/**
 * Button that eases toward the cursor (decorative magnetic micro-physics).
 * Uses motion values + spring (never React state) so it stays off the render path.
 * Collapses to a plain button under reduced motion.
 */
export function MagneticButton({
  href,
  children,
  variant = "primary",
  external,
  className,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 12, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 12, mass: 0.1 });

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  const base =
    "pressable relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium";
  const styles =
    variant === "primary"
      ? "bg-[var(--color-accent)] text-black"
      : "border border-[var(--color-border)] text-[var(--color-fg)] hover:border-[var(--color-accent)]";

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-flex">
      <Link
        ref={ref}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={reset}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={`${base} ${styles} ${className ?? ""}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}
