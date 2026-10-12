"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

const suggestions = ["How did you build Synvora?", "What is Pickup?", "Are you open to new roles?"];
const AVATAR_VIDEO = "/ai/avatar.mp4";
const AVATAR_POSTER = "/ai/portrait.jpg";

function Avatar({ className }: { className: string }) {
  return (
    <video
      src={AVATAR_VIDEO}
      poster={AVATAR_POSTER}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden
      className={`object-cover grayscale ${className}`}
    />
  );
}

/** "AI David": animated-portrait launcher + streaming chat panel. Text only, no audio. */
export function ChatAgent() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (open) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ai-chat"
        aria-label={open ? "Close chat with AI David" : "Chat with AI David"}
        className="pressable group fixed bottom-5 right-5 z-50 flex items-center gap-3"
      >
        <span className="glass hidden rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] opacity-0 transition-opacity group-hover:opacity-100 sm:block">
          Ask AI David
        </span>
        <span className="relative block size-16 overflow-hidden rounded-full border border-[var(--color-fg)]/40 shadow-[0_0_30px_rgba(255,255,255,0.12)]">
          <Avatar className="size-full" />
          <span className="absolute bottom-1 right-1 size-2.5 rounded-full border border-black bg-emerald-400" />
        </span>
      </button>

      <section
        id="ai-chat"
        hidden={!open}
        aria-label="Chat with AI David"
        className="glass fixed bottom-24 right-5 z-50 flex h-[min(34rem,calc(100dvh-8rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl"
      >
        <header className="flex items-center gap-3 border-b border-[var(--color-border)] p-4">
          <Avatar className="size-10 rounded-full" />
          <div className="min-w-0 flex-1">
            <p className="font-serif text-xl leading-none tracking-wide">AI David</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-faint)]">
              {busy ? "Typing..." : "AI version of David / online"}
            </p>
          </div>
        </header>

        <div ref={listRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4 text-sm leading-6">
          {messages.length === 0 && (
            <div>
              <p className="text-[var(--color-muted)]">
                Hey, I&apos;m David&apos;s AI twin. Ask me about my projects, skills or what I&apos;m looking for.
              </p>
              <div className="mt-4 flex flex-col items-start gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="pressable rounded-full border border-[var(--color-border)] px-3 py-1.5 text-left text-xs text-[var(--color-muted)] hover:border-[var(--color-faint)] hover:text-[var(--color-fg)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex"}>
              <p
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 ${
                  m.role === "user"
                    ? "bg-[var(--color-fg)] text-[var(--color-bg)]"
                    : "border border-[var(--color-border)] text-[var(--color-fg)]"
                }`}
              >
                {m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text}</span> : null))}
              </p>
            </div>
          ))}
          {error && (
            <p className="font-mono text-xs text-red-400">Connection lost. Try again, or email me directly.</p>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2 border-t border-[var(--color-border)] p-3"
        >
          <label htmlFor="ai-chat-input" className="sr-only">Message</label>
          <input
            id="ai-chat-input"
            ref={inputRef}
            // Autofill/password extensions inject a style attr before hydration; harmless.
            suppressHydrationWarning
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={1500}
            placeholder="Ask me anything..."
            autoComplete="off"
            className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[var(--color-faint)] focus:border-[var(--color-faint)]"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="pressable rounded-lg bg-[var(--color-fg)] px-4 font-mono text-xs uppercase tracking-widest text-[var(--color-bg)] disabled:opacity-30"
          >
            Send
          </button>
        </form>
      </section>
    </>
  );
}
