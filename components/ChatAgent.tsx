"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { messageText } from "@/components/voice/text";

// The voice screen (and the speech code with it) only downloads when someone opens it.
const VoiceAgent = dynamic(() => import("@/components/voice/VoiceAgent").then((m) => m.VoiceAgent), { ssr: false });

const suggestions = ["How did you build Synvora?", "What is Pickup?", "Are you open to new roles?"];
const AVATAR_VIDEO = "/ai/avatar.mp4";
const AVATAR_POSTER = "/ai/avatar-poster.jpg"; // 128px, ~4 KB: this circle is 64px, so the full portrait would be wasted bytes

/** Still image first; the looping video is swapped in once the browser is idle so it never competes with the page. */
function Avatar({ className }: { className: string }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = () => setPlaying(true);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(start, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(start, 2500);
    return () => clearTimeout(t);
  }, []);
  return playing ? (
    <video src={AVATAR_VIDEO} poster={AVATAR_POSTER} autoPlay muted loop playsInline aria-hidden className={`object-cover grayscale ${className}`} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- tiny static still
    <img src={AVATAR_POSTER} alt="" width={128} height={128} aria-hidden className={`object-cover grayscale ${className}`} />
  );
}

/** "AI David": animated-portrait launcher, streaming text chat, and the full-screen voice conversation. */
export function ChatAgent() {
  const [open, setOpen] = useState(false);
  // The launcher appears once the page has settled, so the headline (the real content) is what paints first.
  const [launcherReady, setLauncherReady] = useState(false);
  useEffect(() => {
    const show = () => setLauncherReady(true);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(show, { timeout: 2500 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(show, 1200);
    return () => clearTimeout(t);
  }, []);
  const [voiceOpen, setVoiceOpen] = useState(false);
  // Whether the voice agent is available (needs the ElevenLabs voice configured; always on in local dev).
  const [voice, setVoice] = useState<{ enabled: boolean; browserVoice: boolean; booking: boolean }>({ enabled: false, browserVoice: false, booking: false });
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, setMessages, stop, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    fetch("/api/tts")
      .then((r) => r.json())
      .then(setVoice)
      .catch(() => {});
    const openVoice = () => setVoiceOpen(true);
    addEventListener("agent:open-voice", openVoice);
    return () => removeEventListener("agent:open-voice", openVoice);
  }, []);

  /** Every request carries how the visitor is talking and their time zone (for booking times). */
  const sendAs = useCallback(
    (text: string, mode: "text" | "voice") =>
      sendMessage({ text }, { body: { mode, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone } }),
    [sendMessage],
  );
  const addGreeting = useCallback(
    (text: string) =>
      setMessages((prev) => [...prev, { id: `greeting-${Date.now()}`, role: "assistant", parts: [{ type: "text", text }] }]),
    [setMessages],
  );
  const sendVoice = useCallback((text: string) => sendAs(text, "voice"), [sendAs]);
  const closeVoice = useCallback(() => setVoiceOpen(false), []);

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
    sendAs(t, "text");
    setInput("");
  }

  return (
    <>
      {(launcherReady || open) && (
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ai-chat"
        aria-label={open ? "Close chat with AI David" : "Ask AI David"}
        className="pressable group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-50 flex items-center gap-3"
      >
        <span className="glass hidden rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] opacity-0 transition-opacity group-hover:opacity-100 sm:block">
          Ask AI David
        </span>
        <span className="relative block size-16 overflow-hidden rounded-full border border-[var(--color-fg)]/40 shadow-[0_0_30px_rgba(255,255,255,0.12)]">
          <Avatar className="size-full" />
          <span className="absolute bottom-1 right-1 size-2.5 rounded-full border border-black bg-emerald-400" />
        </span>
      </button>
      )}

      <section
        id="ai-chat"
        hidden={!open}
        aria-label="Chat with AI David"
        className="glass bg-[var(--color-bg)]/95 fixed bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))+4.75rem)] right-5 z-50 flex h-[min(34rem,calc(100dvh-9rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl"
      >
        <header className="flex items-center gap-3 border-b border-[var(--color-border)] p-4">
          <Avatar className="size-10 rounded-full" />
          <div className="min-w-0 flex-1">
            <p className="font-serif text-xl leading-none tracking-wide">AI David</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-faint)]">
              {busy ? "Typing..." : "AI version of David / online"}
            </p>
          </div>
          {voice.enabled && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setVoiceOpen(true);
              }}
              className="pressable rounded-full border border-[var(--color-accent)] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
            >
              ● Talk
            </button>
          )}
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
          {messages.map((m) => {
            const text = messageText(m);
            const booked = m.parts.find(
              (p) => p.type === "tool-book_meeting" && "state" in p && p.state === "output-available" && (p.output as { booked?: boolean })?.booked,
            ) as { output: { when: string; inviteSentTo: string } } | undefined;
            const working = m.parts.some(
              (p) => p.type.startsWith("tool-") && "state" in p && p.state !== "output-available" && p.state !== "output-error",
            );
            return (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex flex-col items-start gap-2"}>
                {text && (
                  <p
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 ${
                      m.role === "user"
                        ? "bg-[var(--color-fg)] text-[var(--color-bg)]"
                        : "border border-[var(--color-border)] text-[var(--color-fg)]"
                    }`}
                  >
                    {text}
                  </p>
                )}
                {working && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">Checking David&apos;s calendar…</p>
                )}
                {booked && (
                  <div className="max-w-[85%] rounded-2xl border border-[var(--color-accent)]/60 px-3.5 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">Meeting booked</p>
                    <p className="mt-1 font-serif text-xl">{booked.output.when}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-muted)]">Invite sent to {booked.output.inviteSentTo}</p>
                  </div>
                )}
              </div>
            );
          })}
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
            className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2.5 text-base outline-none sm:py-2 sm:text-sm placeholder:text-[var(--color-faint)] focus:border-[var(--color-faint)]"
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

      {voiceOpen && (
        <VoiceAgent
          messages={messages}
          status={status}
          send={sendVoice}
          abort={stop}
          addGreeting={addGreeting}
          browserVoice={voice.browserVoice}
          booking={voice.booking}
          onClose={closeVoice}
        />
      )}
    </>
  );
}
