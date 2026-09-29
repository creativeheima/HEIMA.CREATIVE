import { NextResponse } from "next/server";

type Payload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  message?: string;
  website?: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Endpoint form kontak.
 * Jika `CONTACT_WEBHOOK_URL` diisi, data diteruskan (Slack, Make, Zapier, CRM, dsb.).
 * Ganti/perluas bagian "deliver" untuk mengirim email (mis. Resend, SMTP).
 */
export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Format data tidak valid." }, { status: 400 });
  }

  // Bot mengisi honeypot → pura-pura sukses
  if (body.website) return NextResponse.json({ ok: true });

  const clean = (v?: string, max = 200) => (v ?? "").toString().trim().slice(0, max);
  const data = {
    name: clean(body.name),
    company: clean(body.company),
    email: clean(body.email),
    phone: clean(body.phone, 40),
    projectType: clean(body.projectType, 80),
    message: clean(body.message, 5000),
    submittedAt: new Date().toISOString(),
  };

  if (!data.name || !data.email || !data.message) {
    return NextResponse.json({ ok: false, error: "Nama, email, dan pesan wajib diisi." }, { status: 422 });
  }
  if (!EMAIL_RE.test(data.email)) {
    return NextResponse.json({ ok: false, error: "Alamat email tidak valid." }, { status: 422 });
  }

  // deliver
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
    } catch (err) {
      console.error("[contact] webhook gagal:", err);
      return NextResponse.json({ ok: false, error: "Server sedang sibuk." }, { status: 502 });
    }
  } else {
    console.info("[contact] pesan baru (set CONTACT_WEBHOOK_URL untuk meneruskan):", data);
  }

  return NextResponse.json({ ok: true });
}
