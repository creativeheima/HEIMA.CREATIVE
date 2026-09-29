import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { SANITY_TAG } from "@/sanity/client";

/**
 * Webhook Sanity → perbarui cache website segera setelah konten dipublish.
 * Set SANITY_REVALIDATE_SECRET yang sama di Vercel dan di pengaturan webhook Sanity.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "SANITY_REVALIDATE_SECRET belum diisi" }, { status: 500 });

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);
  if (!isValidSignature) return NextResponse.json({ ok: false, error: "Signature tidak valid" }, { status: 401 });

  revalidateTag(SANITY_TAG, { expire: 0 });
  return NextResponse.json({ ok: true, type: body?._type ?? null, now: Date.now() });
}
