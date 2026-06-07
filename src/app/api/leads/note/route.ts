// Attaches the full chat transcript as a CRM note on the Brevo contact.
export async function POST(req: Request) {
  try {
    const { contactId, messages } = await req.json();

    if (!process.env.BREVO_API_KEY || !contactId || !messages?.length) {
      return Response.json({ ok: false, reason: "missing_data" });
    }

    // Format messages into readable transcript
    const transcript = messages
      .map((m: { role: string; content: string }) =>
        `[${m.role === "user" ? "Visitor" : "Alex AI"}]: ${m.content}`
      )
      .join("\n\n");

    const noteText = `--- Alex AI Chat Transcript ---\n\n${transcript}\n\n--- End of Chat ---`;

    const res = await fetch("https://api.brevo.com/v3/crm/notes", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: noteText,
        contactIds: [contactId],
      }),
    });

    const data = await res.json();
    console.log("[NOTE]", { contactId, status: res.status, data });
    return Response.json({ ok: res.ok });
  } catch (err) {
    console.error("[NOTE ERROR]", err);
    return Response.json({ ok: false }, { status: 500 });
  }
}
