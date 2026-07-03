"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * 3D parallax tilt that tracks the cursor, plus a spotlight driven by CSS vars.
 * Motion values + spring keep it off the React render path (per taste-skill 3.B).
 * Reduced motion => no tilt, no spotlight movement.
 */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springRx = useSpring(rx, { stiffness: 200, damping: 18 });
  const springRy = useSpring(ry, { stiffness: 200, damping: 18 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    // Spotlight position (CSS vars) always tracks; tilt only when motion is allowed.
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (reduce) return;
    ry.set((px - 0.5) * 10);
    rx.set((0.5 - py) * 10);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: springRx, rotateY: springRy, transformPerspective: 900 }}
      className={`card-spotlight [transform-style:preserve-3d] ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
