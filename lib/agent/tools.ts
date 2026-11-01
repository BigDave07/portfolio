import { tool } from "ai";
import { z } from "zod";
import { createBooking, getSlots, offeredLengths } from "@/lib/agent/cal";
import { notifyDavid, notifyReady } from "@/lib/agent/notify";

const minutes = z.union([z.literal(15), z.literal(30)]).describe("Meeting length in minutes: 15 or 30");

/**
 * Tools the agent can call. They validate their own input (the model's arguments are untrusted) and
 * return plain results the model can speak from. `timeZone` is the visitor's IANA zone, sent by the page.
 */
export function agentTools(timeZone: string) {
  const canBook = offeredLengths().length > 0;
  const all = {
    get_availability: tool({
      description:
        "Get David's open times for a call, shown in the visitor's time zone. Call this before offering any time; never invent times.",
      inputSchema: z.object({ minutes }),
      execute: async ({ minutes: m }) => {
        if (!offeredLengths().includes(m)) {
          return { available: false, reason: "Live booking isn't available right now. Offer to take their details instead (save_lead) or point them to the email." };
        }
        try {
          const slots = await getSlots(m, timeZone);
          if (!slots.length) return { available: false, reason: "No open times in the next 10 days. Offer to take their details (save_lead)." };
          return { available: true, timeZone, slots };
        } catch (e) {
          console.error("[agent] get_availability", e);
          return { available: false, reason: "The calendar didn't respond. Offer to take their details (save_lead)." };
        }
      },
    }),

    book_meeting: tool({
      description:
        "Book a call with David. Only call after the visitor has chosen one of the times from get_availability AND has given their name and email AND agreed that you pass these to David. Use the exact startIso from the slot they chose.",
      inputSchema: z.object({
        minutes,
        startIso: z.string().max(40).describe("The exact startIso of the chosen slot"),
        name: z.string().trim().min(1).max(100),
        email: z.string().trim().email().max(200),
        company: z.string().trim().max(200).optional(),
        role: z.string().trim().max(200).optional().describe("The role they're hiring for or want to discuss"),
        summary: z.string().trim().min(1).max(900).describe("2-4 sentences for David: who they are, what they're hiring for, why a call makes sense"),
        visitorAgreed: z.boolean().describe("true ONLY if the visitor has already said, in their own messages, that David may receive their name and email and that they want this booking. Never true on your own assumption."),
      }),
      execute: async ({ visitorAgreed, ...a }) => {
        if (!visitorAgreed) return { booked: false, reason: "The visitor hasn't agreed yet. Ask them (and stop talking until they answer), then call this again." };
        const t = new Date(a.startIso).getTime();
        if (!Number.isFinite(t) || t < Date.now() || t > Date.now() + 14 * 864e5) {
          return { booked: false, reason: "That time isn't valid. Call get_availability again and offer one of those times." };
        }
        if (!offeredLengths().includes(a.minutes)) {
          return { booked: false, reason: "Booking isn't available right now. Use save_lead instead." };
        }
        try {
          const b = await createBooking({ ...a, timeZone });
          const emailed = await notifyDavid({ kind: "meeting", ...a, when: b.whenLabel, meetingUrl: b.meetingUrl });
          return { booked: true, when: b.whenLabel, timeZone, meetingUrl: b.meetingUrl, inviteSentTo: a.email, davidNotified: emailed };
        } catch (e) {
          console.error("[agent] book_meeting", e);
          return { booked: false, reason: "That slot was just taken or the calendar had a problem. Call get_availability again and offer other times." };
        }
      },
    }),

    save_lead: tool({
      description:
        "Pass a hiring conversation to David when the visitor doesn't want a meeting right now, or booking isn't available. Only after they agree to share their details and have given a name and a way to reach them.",
      inputSchema: z.object({
        name: z.string().trim().min(1).max(100),
        email: z.string().trim().email().max(200),
        company: z.string().trim().max(200).optional(),
        role: z.string().trim().max(200).optional(),
        summary: z.string().trim().min(1).max(900).describe("2-4 sentences for David: who they are and what they're looking for"),
        visitorAgreed: z.boolean().describe("true ONLY if the visitor has already agreed, in their own messages, to share their details with David."),
      }),
      execute: async ({ visitorAgreed, ...a }) => {
        if (!visitorAgreed) return { saved: false, reason: "The visitor hasn't agreed yet. Ask them (and stop talking until they answer), then call this again." };
        return { saved: await notifyDavid({ kind: "lead", ...a }) };
      },
    }),
  };
  // Only hand the model tools that can actually work right now.
  return {
    ...(canBook ? { get_availability: all.get_availability, book_meeting: all.book_meeting } : {}),
    ...(notifyReady() ? { save_lead: all.save_lead } : {}),
  };
}

/** What the agent can really do right now, so the prompt never promises something that isn't set up. */
export function capabilities() {
  return { canBook: offeredLengths().length > 0, canNotify: notifyReady() };
}
