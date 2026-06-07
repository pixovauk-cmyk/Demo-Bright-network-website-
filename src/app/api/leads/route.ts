// Creates contact in Brevo CRM. Returns Brevo contact ID for attaching chat note later.
export async function POST(req: Request) {
  try {
    const { name, email, company } = await req.json();
    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ") || "";

    if (!process.env.BREVO_API_KEY) {
      console.log("[LEAD - no Brevo key]", { name, email, company });
      return Response.json({ ok: true, contactId: null });
    }

    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
          COMPANY: company || "",
        },
        listIds: process.env.BREVO_LIST_ID ? [parseInt(process.env.BREVO_LIST_ID)] : [],
        updateEnabled: true,
      }),
    });

    const data = await res.json();

    // Brevo returns { id } on create, or { code, message } on error
    const contactId: number | null = data?.id ?? null;

    console.log("[LEAD]", { name, email, company, contactId, status: res.status });
    return Response.json({ ok: res.ok, contactId });
  } catch (err) {
    console.error("[LEAD ERROR]", err);
    return Response.json({ ok: false, contactId: null }, { status: 500 });
  }
}
