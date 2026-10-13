/**
 * Cal.com v2 client: available slots + booking. Cal.com owns the real calendar (Google Calendar sync,
 * working hours, buffers, booking limits, invites with video links), so nothing here can double-book.
 */
const API = "https://api.cal.com/v2";

export type Minutes = 15 | 30;
export type Slot = { startIso: string; label: string };

const eventTypeId = (m: Minutes) => Number(m === 15 ? process.env.CAL_EVENT_15 : process.env.CAL_EVENT_30) || 0;

/** Which meeting lengths are configured (an event type id exists for them). */
export function offeredLengths(): Minutes[] {
  if (!process.env.CAL_API_KEY) return [];
  return ([15, 30] as const).filter((m) => eventTypeId(m));
}

/** Local-only fake calendar so the whole flow can be tried before Cal.com is set up. Never active in production. */
const mock = () => process.env.CAL_MOCK === "1" && process.env.NODE_ENV !== "production";

const headers = (version: string) => ({
  Authorization: `Bearer ${process.env.CAL_API_KEY}`,
  "cal-api-version": version,
  "content-type": "application/json",
});

export function label(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short",
  }).format(new Date(iso));
}

/** Up to 6 open slots over the next 10 days, spread across days (earliest + a later one per day). */
export async function getSlots(minutes: Minutes, timeZone: string): Promise<Slot[]> {
  const days = 10;
  if (mock()) {
    const out: Slot[] = [];
    for (let d = 1; out.length < 6 && d <= days; d++) {
      const day = new Date(Date.now() + d * 864e5);
      if ([0, 6].includes(day.getUTCDay())) continue;
      for (const hour of [16, 20]) {
        const t = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour));
        out.push({ startIso: t.toISOString(), label: label(t.toISOString(), timeZone) });
      }
    }
    return out.slice(0, 6);
  }

  const start = new Date();
  const end = new Date(Date.now() + days * 864e5);
  const qs = new URLSearchParams({
    eventTypeId: String(eventTypeId(minutes)),
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
    timeZone,
  });
  const res = await fetch(`${API}/slots?${qs}`, { headers: headers("2024-09-04"), cache: "no-store" });
  if (!res.ok) throw new Error(`Cal.com slots ${res.status}`);
  const json = (await res.json()) as { data?: Record<string, Array<string | { start: string }>> };

  const slots: Slot[] = [];
  for (const day of Object.values(json.data ?? {})) {
    const starts = day.map((s) => (typeof s === "string" ? s : s.start));
    // Skip anything under 2 hours away so nobody books a call that's about to start.
    const usable = starts.filter((s) => new Date(s).getTime() > Date.now() + 2 * 36e5);
    const picks = usable.length > 3 ? [usable[0], usable[Math.floor(usable.length / 2)]] : usable.slice(0, 2);
    for (const s of picks) slots.push({ startIso: s, label: label(s, timeZone) });
  }
  return slots.slice(0, 6);
}

export type Booking = { whenLabel: string; meetingUrl?: string };

export async function createBooking(input: {
  minutes: Minutes;
  startIso: string;
  name: string;
  email: string;
  timeZone: string;
  company?: string;
  role?: string;
}): Promise<Booking> {
  if (mock()) return { whenLabel: label(input.startIso, input.timeZone), meetingUrl: "https://meet.example.com/mock" };

  const res = await fetch(`${API}/bookings`, {
    method: "POST",
    headers: headers("2026-02-25"),
    body: JSON.stringify({
      start: new Date(input.startIso).toISOString(), // Cal.com wants UTC
      eventTypeId: eventTypeId(input.minutes),
      attendee: { name: input.name, email: input.email, timeZone: input.timeZone, language: "en" },
      metadata: {
        source: "ai-david",
        ...(input.company ? { company: input.company.slice(0, 400) } : {}),
        ...(input.role ? { role: input.role.slice(0, 400) } : {}),
      },
    }),
  });
  if (!res.ok) throw new Error(`Cal.com booking ${res.status}`);
  const json = (await res.json()) as { data?: { start?: string; location?: string } };
  return {
    whenLabel: label(json.data?.start ?? input.startIso, input.timeZone),
    meetingUrl: json.data?.location?.startsWith("http") ? json.data.location : undefined,
  };
}
