import { site } from "@/data/site";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export const notifyReady = () => Boolean(process.env.RESEND_API_KEY);

export type Lead = {
  kind: "meeting" | "lead";
  name: string;
  email?: string;
  company?: string;
  role?: string;
  summary: string;
  when?: string;
  meetingUrl?: string;
};

/**
 * Emails David about a hiring conversation (Resend). Returns false when email isn't configured or fails,
 * so the agent can tell the visitor to use the direct email instead of promising a follow-up.
 * Until a domain is verified in Resend, the default sender can only deliver to the Resend account's own email.
 */
export async function notifyDavid(lead: Lead): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[agent] RESEND_API_KEY not set; lead not emailed:", lead.kind, lead.company ?? "");
    return false;
  }
  const rows: Array<[string, string | undefined]> = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Company", lead.company],
    ["Role", lead.role],
    ["Meeting", lead.when],
    ["Link", lead.meetingUrl],
  ];
  const html = `<div style="font:15px/1.5 -apple-system,Segoe UI,sans-serif;max-width:560px">
<h2 style="margin:0 0 12px">${lead.kind === "meeting" ? "Meeting booked by AI David" : "New hiring lead from AI David"}</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><b>${esc(v as string)}</b></td></tr>`)
    .join("")}</table>
<h3 style="margin:18px 0 6px">What they were after</h3><p style="margin:0">${esc(lead.summary)}</p>
<p style="color:#888;margin-top:20px">Reply to this email to reach them directly.</p></div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "AI David <onboarding@resend.dev>",
        to: [process.env.LEAD_NOTIFY_EMAIL ?? site.email],
        ...(lead.email ? { reply_to: lead.email } : {}),
        subject: `${lead.kind === "meeting" ? "Meeting booked" : "New lead"}: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
        html,
      }),
    });
    if (!res.ok) console.error("[agent] Resend failed", res.status, (await res.text()).slice(0, 200));
    return res.ok;
  } catch (e) {
    console.error("[agent] Resend error", e);
    return false;
  }
}
