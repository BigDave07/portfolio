"use client";

import type { UIMessage } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaceCloud } from "@/components/hud/FaceCloud";
import {
  createListener,
  createSpeaker,
  forSpeech,
  listeningSupported,
  takeChunks,
  type Listener,
  type Speaker,
} from "@/components/voice/speech";

export const GREETING =
  "Hey, I'm David's AI. I can walk you through his work, or help if you're hiring. Are you hiring, or just exploring?";

type Phase = "intro" | "live";
type AgentState = "idle" | "listening" | "thinking" | "speaking";

const emit = (detail: { level?: number; state?: string }) =>
  window.dispatchEvent(new CustomEvent("agent:voice", { detail }));

/** All text of a message, with a space between parts (parts are separated by tool calls). */
export const messageText = (m: UIMessage) =>
  m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .filter(Boolean)
    .join(" ");

type Props = {
  messages: UIMessage[];
  status: "submitted" | "streaming" | "ready" | "error";
  send: (text: string) => void;
  /** Cancel a reply that's in flight. */
  abort: () => void;
  addGreeting: (text: string) => void;
  /** Use the browser's robot voice (local testing only). */
  browserVoice: boolean;
  /** Whether live booking is set up (changes what the intro promises). */
  booking: boolean;
  onClose: () => void;
};

/**
 * Full-screen voice conversation: your 3D head listens, thinks and speaks. Tapping Start (a user gesture) unlocks
 * audio and the mic. Replies are spoken sentence by sentence as they stream in; after each reply it listens again.
 */
export function VoiceAgent({ messages, status, send, abort, addGreeting, browserVoice, booking: canBook, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [state, setState] = useState<AgentState>("idle");
  const [mic, setMic] = useState(true);
  const [interim, setInterim] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const canListen = useRef(false);
  const speaker = useRef<Speaker | null>(null);
  const listener = useRef<Listener | null>(null);
  const live = useRef(false);
  const micRef = useRef(true);
  const statusRef = useRef(status);
  const sendRef = useRef(send);
  statusRef.current = status;
  sendRef.current = send;
  micRef.current = mic;
  // What has already been spoken from the latest assistant message.
  const track = useRef({ id: "", consumed: 0, first: true });

  const setAgent = useCallback((s: AgentState) => {
    setState(s);
    emit({ state: s });
  }, []);

  const startListening = useCallback(() => {
    if (!live.current || !micRef.current || !listener.current) return;
    setAgent("listening");
    setInterim("");
    listener.current.start();
  }, [setAgent]);

  // Build speaker/listener once; tear everything down on close.
  useEffect(() => {
    canListen.current = listeningSupported();
    speaker.current = createSpeaker({
      browserVoice,
      onLevel: (level) => emit({ level }),
      onIdle: () => {
        // Only hand the floor to the visitor once the whole reply has streamed in and been spoken.
        if (statusRef.current === "ready") startListening();
      },
    });
    if (canListen.current) {
      listener.current = createListener({
        onInterim: setInterim,
        onFinal: (text) => {
          setInterim("");
          if (!text) return startListening();
          setAgent("thinking");
          sendRef.current(text);
        },
        onProblem: (reason) => {
          setMic(false);
          setAgent("idle");
          setNote(
            reason === "denied"
              ? "Microphone access was blocked, so type below and I'll still answer out loud."
              : "I didn't catch anything. Tap the mic to talk, or type below.",
          );
        },
      });
    }
    return () => {
      live.current = false;
      speaker.current?.stop();
      listener.current?.stop();
      emit({ level: 0, state: "idle" });
    };
  }, [browserVoice, setAgent, startListening]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onClose]);

  function start() {
    speaker.current?.unlock();
    live.current = true;
    // Don't re-read anything from earlier text chat.
    const last = messages[messages.length - 1];
    track.current = { id: last?.id ?? "", consumed: last ? messageText(last).length : 0, first: true };
    setPhase("live");
    addGreeting(GREETING);
    setAgent("speaking");
    speaker.current?.say(forSpeech(GREETING));
  }

  // Speak the latest reply as it streams in.
  useEffect(() => {
    if (phase !== "live") return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    const t = track.current;
    const text = messageText(last);
    if (last.id !== t.id) Object.assign(t, { id: last.id, consumed: 0, first: true });
    if (text.length < t.consumed) return;
    const { chunks, rest } = takeChunks(text.slice(t.consumed), status === "ready", t.first);
    if (!chunks.length) return;
    t.consumed = text.length - rest.length;
    t.first = false;
    setAgent("speaking");
    for (const c of chunks) speaker.current?.say(forSpeech(c));
  }, [messages, status, phase, setAgent]);

  // If a reply finished with nothing left to say (or the answer was only a tool step), take the floor back.
  useEffect(() => {
    if (phase === "live" && status === "ready" && !speaker.current?.busy()) startListening();
  }, [status, phase, startListening]);

  // Recovery: a reply that errors out or goes quiet for too long shouldn't leave the screen hanging.
  const activity = useRef(Date.now());
  useEffect(() => {
    activity.current = Date.now();
  }, [messages, status]);
  useEffect(() => {
    if (phase !== "live") return;
    const id = setInterval(() => {
      const s = statusRef.current;
      if ((s === "submitted" || s === "streaming") && Date.now() - activity.current > 25000) {
        abort();
        speaker.current?.stop();
        setNote("That took too long. Say it again, or type it.");
        startListening();
      }
    }, 2000);
    return () => clearInterval(id);
  }, [phase, abort, startListening]);
  useEffect(() => {
    if (phase === "live" && status === "error") {
      speaker.current?.stop();
      setNote("Something went wrong on my end. Try again, or email David directly.");
      startListening();
    }
  }, [status, phase, startListening]);

  function interrupt() {
    speaker.current?.stop();
    startListening();
  }

  function toggleMic() {
    if (mic) {
      listener.current?.stop();
      setMic(false);
      setAgent("idle");
    } else {
      setNote(null);
      setMic(true);
      micRef.current = true;
      speaker.current?.stop();
      startListening();
    }
  }

  function submitTyped(e: React.FormEvent) {
    e.preventDefault();
    const text = typed.trim();
    if (!text) return;
    setTyped("");
    speaker.current?.stop();
    listener.current?.stop();
    setAgent("thinking");
    send(text);
  }

  // Latest things to show.
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  // Show just the latest few sentences so the caption stays short and readable.
  const caption = lastAssistant
    ? (messageText(lastAssistant).match(/[^.!?…]+[.!?…]+["')\]]?\s*|[^.!?…]+$/g) ?? []).slice(-3).join("").trim()
    : "";
  const booking = [...messages]
    .reverse()
    .flatMap((m) => m.parts)
    .find(
      (p) =>
        p.type === "tool-book_meeting" &&
        "state" in p &&
        p.state === "output-available" &&
        (p.output as { booked?: boolean } | undefined)?.booked,
    ) as { output: { when: string; inviteSentTo: string; meetingUrl?: string } } | undefined;

  const label: Record<AgentState, string> = {
    idle: mic ? "Ready" : "Mic off",
    listening: "Listening…",
    thinking: "Thinking…",
    speaking: "Speaking",
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Voice conversation with AI David" className="fixed inset-0 z-[160] bg-[var(--color-bg)]">
      <FaceCloud className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_40%,#000_45%,transparent_85%)]" />

      <button
        type="button"
        onClick={onClose}
        aria-label="End conversation"
        className="pressable absolute right-5 top-5 z-10 grid size-11 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/70 text-lg backdrop-blur hover:border-[var(--color-fg)]"
      >
        ×
      </button>
      <p className="absolute left-5 top-6 z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-faint)]">
        <span className="text-[var(--color-accent)]">●</span> AI David / voice
      </p>

      {phase === "intro" ? (
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/90 to-transparent pt-24">
        <div className="mx-auto max-w-xl px-5 pb-12 text-center">
          <h2 className="font-serif text-5xl leading-tight">Talk to David</h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--color-muted)]">
            A quick voice chat with my AI twin. It speaks in my voice and can talk through whether I&apos;d fit a role
            {canBook ? ", and can book a 15 or 30 minute call with me." : "."}
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-[var(--color-faint)]">
            Uses your microphone. Your browser transcribes your speech; the AI voice is generated for you.
            {canBook ? " If you book a call, your name and email go to David." : ""}
          </p>
          <button
            type="button"
            autoFocus
            onClick={start}
            className="pressable mt-7 rounded-full bg-[var(--color-accent)] px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-bg)]"
          >
            Start talking
          </button>
          {typeof window !== "undefined" && !listeningSupported() && (
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              This browser can&apos;t listen, but you can type and I&apos;ll answer out loud.
            </p>
          )}
        </div>
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/85 to-transparent pt-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-8 text-center">
          {booking && (
            <div className="mb-5 rounded-2xl border border-[var(--color-accent)]/60 bg-[var(--color-bg)]/80 px-6 py-4 backdrop-blur">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent)]">Meeting booked</p>
              <p className="mt-1 font-serif text-3xl">{booking.output.when}</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">Invite sent to {booking.output.inviteSentTo}</p>
            </div>
          )}

          <p aria-live="polite" className="min-h-[3.5rem] max-w-xl font-serif text-2xl leading-snug sm:text-[1.7rem]">
            {state === "listening" && interim ? <span className="text-[var(--color-muted)]">{interim}</span> : caption}
          </p>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent)]">{label[state]}</p>
          {note && <p className="mt-2 text-sm text-[var(--color-muted)]">{note}</p>}

          <div className="mt-5 flex items-center gap-4">
            {canListen.current && (
              <button
                type="button"
                onClick={toggleMic}
                aria-pressed={mic}
                aria-label={mic ? "Mute microphone" : "Turn microphone on"}
                className={`pressable grid size-14 place-items-center rounded-full border text-xl ${
                  mic && state === "listening"
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-bg)]"
                    : "border-[var(--color-border)] text-[var(--color-fg)] hover:border-[var(--color-fg)]"
                }`}
              >
                {mic ? "●" : "○"}
              </button>
            )}
            {state === "speaking" && (
              <button
                type="button"
                onClick={interrupt}
                className="pressable rounded-full border border-[var(--color-border)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] hover:border-[var(--color-fg)]"
              >
                Tap to interrupt
              </button>
            )}
          </div>

          <form onSubmit={submitTyped} className="mt-5 flex w-full max-w-md gap-2">
            <label htmlFor="voice-typed" className="sr-only">Type instead</label>
            <input
              id="voice-typed"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              maxLength={600}
              placeholder="Or type here (handy for your email)…"
              autoComplete="off"
              suppressHydrationWarning
              className="min-w-0 flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/70 px-4 py-2.5 text-sm outline-none backdrop-blur placeholder:text-[var(--color-faint)] focus:border-[var(--color-faint)]"
            />
            <button
              type="submit"
              disabled={!typed.trim()}
              className="pressable rounded-full bg-[var(--color-fg)] px-5 font-mono text-[10px] uppercase tracking-widest text-[var(--color-bg)] disabled:opacity-30"
            >
              Send
            </button>
          </form>
        </div>
        </div>
      )}
    </div>
  );
}
