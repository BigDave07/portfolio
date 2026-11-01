"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Face = dynamic(() => import("@/components/hud/FaceCloud").then((m) => m.FaceCloud), {
  ssr: false,
  loading: () => null,
});

/**
 * Three.js (~170 KB) and the head model load after the page has painted and the browser is idle,
 * so the headline (the real content) is never competing with the 3D scene for the main thread.
 */
export function LazyFace({ className }: { className?: string }) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const start = () => setGo(true);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(start, { timeout: 1200 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(start, 400);
    return () => clearTimeout(t);
  }, []);
  return go ? <Face className={className} /> : <div aria-hidden className={className} />;
}
