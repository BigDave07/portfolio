import type { UIMessage } from "ai";

/** All text of a message, with a space between parts (parts are separated by tool calls). */
export const messageText = (m: UIMessage) =>
  m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .filter(Boolean)
    .join(" ");
