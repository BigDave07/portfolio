import { capabilities } from "@/lib/agent/tools";

export const maxDuration = 30;

const voiceReady = () => Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID);
const MAX_CHARS = 500; // one spoken chunk; keeps each request cheap and fast

/** The page asks this once to decide whether to show the "Talk to David" button. */
export async function GET() {
  // In local development the Talk button always shows and falls back to the browser's robot voice,
  // so the whole flow can be tried before ElevenLabs is set up. In production it needs the real voice.
  const dev = process.env.NODE_ENV !== "production";
  return Response.json(
    { enabled: voiceReady() || dev, browserVoice: !voiceReady(), booking: capabilities().canBook },
    { headers: { "cache-control": "no-store" } },
  );
}

/**
 * Text in, speech out in David's cloned voice (ElevenLabs), streamed so playback starts quickly.
 * Abuse/cost protection: Vercel Firewall rate limit on this path plus the ElevenLabs plan's own credit cap.
 */
export async function POST(req: Request) {
  if (!voiceReady()) return Response.json({ error: "Voice isn't configured" }, { status: 501 });

  let text: unknown;
  try {
    ({ text } = await req.json());
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (typeof text !== "string" || !text.trim() || text.length > MAX_CHARS) {
    return new Response("Bad request", { status: 400 });
  }

  const upstream = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(process.env.ELEVENLABS_VOICE_ID!)}/stream?output_format=mp3_44100_64`,
    {
      method: "POST",
      headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY!, "content-type": "application/json" },
      body: JSON.stringify({
        text: text.trim(),
        // Flash = lowest latency and price. For a more expressive voice try ELEVENLABS_MODEL=eleven_v4_turbo.
        model_id: process.env.ELEVENLABS_MODEL ?? "eleven_flash_v2_5",
        voice_settings: { stability: 0.5, similarity_boost: 0.8, speed: 1 },
      }),
    },
  );

  if (!upstream.ok || !upstream.body) {
    console.error("[tts] ElevenLabs", upstream.status, (await upstream.text().catch(() => "")).slice(0, 200));
    return Response.json({ error: "Voice service error" }, { status: 502 });
  }
  return new Response(upstream.body, {
    headers: { "content-type": "audio/mpeg", "cache-control": "no-store" },
  });
}
