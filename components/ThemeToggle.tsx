"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "@phosphor-icons/react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="pressable grid size-9 place-items-center overflow-hidden rounded-full border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-fg)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ y: 14, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        >
          {isDark ? <Moon weight="fill" className="size-4" /> : <Sun weight="fill" className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
