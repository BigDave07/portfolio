/** Render quality tier. Persisted per viewer; broadcast to the canvas. */
export type Quality = "high" | "med" | "saver";


const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, v: string) => {
  try {
    localStorage.setItem(key, v);
  } catch {}
};

export function getQuality(): Quality {
  const q = read("hud-quality");
  if (q === "high" || q === "med" || q === "saver") return q;
  // Default: go easy on small screens.
  return typeof window !== "undefined" && window.innerWidth < 768 ? "med" : "high";
}

export function setQuality(q: Quality) {
  write("hud-quality", q);
  window.dispatchEvent(new CustomEvent<Quality>("hud:quality", { detail: q }));
}

export function onQualityChange(fn: (q: Quality) => void) {
  const h = (e: Event) => fn((e as CustomEvent<Quality>).detail);
  window.addEventListener("hud:quality", h);
  return () => window.removeEventListener("hud:quality", h);
}
