"use client";

import { useEffect, useState } from "react";

/** Hero call to action. Only renders once the server says the voice agent is available. */
export function TalkButton() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    fetch("/api/tts")
      .then((r) => r.json())
      .then((d) => setEnabled(Boolean(d.enabled)))
      .catch(() => {});
  }, []);
  if (!enabled) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("agent:open-voice"))}
      className="pressable inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)] px-5 py-3 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-current" />
      </span>
      Talk to David
    </button>
  );
}
