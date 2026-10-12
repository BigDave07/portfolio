"use client";

import { useEffect, useState } from "react";

/** Live local time for a fixed IANA zone. Renders a stable placeholder until mounted (no hydration mismatch). */
export function LocalClock({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <time suppressHydrationWarning className="tabular-nums">
      {now ? now.toLocaleTimeString("en-CA", { timeZone, hour: "numeric", minute: "2-digit", second: "2-digit" }) : "--:--:--"}
    </time>
  );
}
