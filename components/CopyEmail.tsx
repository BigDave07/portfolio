"use client";

import { useState } from "react";

/** One-click copy for the email address, with a brief confirmation. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          location.href = `mailto:${email}`;
        }
      }}
      className="pressable min-h-11 rounded-full border border-[var(--color-border)] px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-fg)]"
    >
      <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
    </button>
  );
}
