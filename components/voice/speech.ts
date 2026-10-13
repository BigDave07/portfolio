/**
 * Browser-side speech plumbing for the voice agent:
 *  - createSpeaker: plays David's voice (/api/tts) sentence by sentence, with a level meter for the 3D head.
 *  - createListener: speech-to-text via the browser's built-in SpeechRecognition (no key, no extra cost).
 *  - takeChunks / forSpeech: split a streaming reply into speakable pieces and clean it for the voice.
 */

/* ---------- text helpers ---------- */

const ZONES: Record<string, string> = {
  EDT: "Eastern time", EST: "Eastern time", CDT: "Central time", CST: "Central time",
  MDT: "Mountain time", MST: "Mountain time", PDT: "Pacific time", PST: "Pacific time",
  ADT: "Atlantic time", AST: "Atlantic time", NDT: "Newfoundland time", NST: "Newfoundland time",
};

/** Strip markdown and make symbols/abbreviations pronounceable. */
export function forSpeech(text: string) {
  return text
    .replace(/https?:\/\/\S+/g, "the link in the chat")
    .replace(/[*_`#>]+/g, "")
    .replace(/\b(E[DS]T|C[DS]T|M[DS]T|P[DS]T|A[DS]T|N[DS]T)\b/g, (z) => ZONES[z] ?? z)
    .replace(/\bC\+\+/g, "C plus plus")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pull complete, speakable chunks out of streaming text. A chunk ends at a sentence boundary followed by
 * whitespace; short sentences are merged (better prosody, fewer requests). The first chunk may be shorter
 * so speech starts sooner. With `flush`, whatever is left is returned too.
 */
export function takeChunks(buf: string, flush: boolean, first: boolean): { chunks: string[]; rest: string } {
  const chunks: string[] = [];
  let rest = buf;
  let isFirst = first;
  const re = /[.!?…]+["')\]]?\s+/g;
  for (;;) {
    const min = isFirst ? 20 : 60;
    re.lastIndex = 0;
    let end = -1;
    for (let m = re.exec(rest); m; m = re.exec(rest)) {
      if (m.index + m[0].length >= min) {
        end = m.index + m[0].length;
        break;
      }
    }
    if (end < 0) break;
    chunks.push(rest.slice(0, end).trim());
    rest = rest.slice(end);
    isFirst = false;
  }
  if (flush && rest.trim()) {
    chunks.push(rest.trim());
    rest = "";
  }
  return { chunks, rest };
}

/* ---------- speaker ---------- */

export type Speaker = {
  /** Call from a click/tap so the browser allows audio. */
  unlock(): void;
  say(text: string): void;
  stop(): void;
  /** True while audio is playing or queued. */
  busy(): boolean;
};

export function createSpeaker(opts: {
  /** Use the browser's built-in (robotic) voice. Only for local testing before a real voice is configured. */
  browserVoice: boolean;
  onLevel: (level: number) => void;
  /** Fires when everything queued has been spoken. */
  onIdle: () => void;
}): Speaker {
  let ctx: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let audio: HTMLAudioElement | null = null;
  const queue: Array<Promise<Blob | null>> = [];
  let playing = false;
  let generation = 0; // bumps on stop() so in-flight work is ignored
  let abort = new AbortController();
  let pendingBrowser = 0;
  let raf = 0;
  const data = new Uint8Array(512);

  function meter() {
    if (!analyser) return;
    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }
    opts.onLevel(Math.min(1, Math.sqrt(sum / data.length) * 4.5));
    raf = requestAnimationFrame(meter);
  }

  function fetchAudio(text: string): Promise<Blob | null> {
    return fetch("/api/tts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
      signal: abort.signal,
    })
      .then((r) => (r.ok ? r.blob() : null))
      .catch(() => null);
  }

  function speakBrowser(text: string) {
    if (!("speechSynthesis" in window)) return;
    pendingBrowser++;
    const gen = generation;
    const u = new SpeechSynthesisUtterance(text);
    // No real audio signal to meter here, so fake a plausible talking pulse.
    const t0 = performance.now();
    const pulse = setInterval(() => opts.onLevel(0.35 + 0.35 * Math.abs(Math.sin((performance.now() - t0) / 90))), 40);
    const finish = () => {
      clearInterval(pulse);
      if (gen !== generation) return; // stop() already reset state
      pendingBrowser = Math.max(0, pendingBrowser - 1);
      if (pendingBrowser === 0) {
        opts.onLevel(0);
        opts.onIdle();
      }
    };
    u.onend = finish;
    u.onerror = finish;
    speechSynthesis.speak(u);
  }

  async function pump() {
    if (playing) return;
    playing = true;
    const gen = generation;
    while (queue.length && gen === generation) {
      const next = queue.shift()!;
      const blob = await next;
      if (gen !== generation) break;
      if (blob && audio) {
        const url = URL.createObjectURL(blob);
        audio.src = url;
        await new Promise<void>((resolve) => {
          audio!.onended = () => resolve();
          audio!.onerror = () => resolve();
          audio!.play().catch(() => resolve());
        });
        URL.revokeObjectURL(url);
      }
    }
    if (gen !== generation) return; // stop() already reset state
    playing = false;
    cancelAnimationFrame(raf);
    opts.onLevel(0);
    if (!queue.length) opts.onIdle();
  }

  return {
    unlock() {
      if (!ctx) {
        ctx = new AudioContext();
        audio = new Audio();
        audio.crossOrigin = "anonymous";
        const src = ctx.createMediaElementSource(audio);
        analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        src.connect(analyser);
        analyser.connect(ctx.destination);
      }
      void ctx.resume();
      // Safari wants a play() inside the gesture; a silent clip does it.
      audio!.src = "data:audio/mpeg;base64,/+MYxAAAAANIAAAAAExBTUUzLjk4LjIAAAAAAAAAAAAAAAAkAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN";
      void audio!.play().catch(() => {});
    },
    say(text) {
      if (opts.browserVoice) return speakBrowser(text);
      queue.push(fetchAudio(text)); // fetch starts now, so the next chunk is ready while this one plays
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(meter);
      void pump();
    },
    stop() {
      generation++;
      abort.abort();
      abort = new AbortController();
      queue.length = 0;
      playing = false;
      pendingBrowser = 0;
      audio?.pause();
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      cancelAnimationFrame(raf);
      opts.onLevel(0);
    },
    busy: () => playing || queue.length > 0 || pendingBrowser > 0,
  };
}

/* ---------- listener ---------- */

type Rec = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};

export const listeningSupported = () =>
  typeof window !== "undefined" && Boolean((window as never as Record<string, unknown>).SpeechRecognition || (window as never as Record<string, unknown>).webkitSpeechRecognition);

export type Listener = { start(): void; stop(): void };

export function createListener(opts: {
  onInterim: (text: string) => void;
  /** A finished utterance. */
  onFinal: (text: string) => void;
  /** Mic denied, no speech heard repeatedly, or recognition unavailable. */
  onProblem: (reason: "denied" | "silence" | "unavailable") => void;
}): Listener {
  const w = window as never as Record<string, new () => Rec>;
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  let rec: Rec | null = null;
  let active = false;
  let heard = false;
  let silences = 0;

  function begin() {
    if (!Ctor) return opts.onProblem("unavailable");
    rec = new Ctor();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    heard = false;
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const t = r[0].transcript;
        if (r.isFinal) {
          heard = true;
          silences = 0;
          active = false;
          opts.onFinal(t.trim());
          return;
        }
        interim += t;
      }
      if (interim) opts.onInterim(interim);
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        active = false;
        opts.onProblem("denied");
      }
    };
    rec.onend = () => {
      if (!active) return;
      // Ended without a result (silence): retry a couple of times, then hand control back to the user.
      if (!heard && ++silences >= 3) {
        active = false;
        silences = 0;
        opts.onProblem("silence");
        return;
      }
      try {
        rec?.start();
      } catch {}
    };
    try {
      rec.start();
    } catch {}
  }

  return {
    start() {
      if (active) return;
      active = true;
      silences = 0;
      begin();
    },
    stop() {
      active = false;
      try {
        rec?.abort();
      } catch {}
    },
  };
}
