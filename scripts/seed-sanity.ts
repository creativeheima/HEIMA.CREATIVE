/**
 * Memindahkan konten bawaan (src/data) + gambarnya ke Sanity.
 *
 *   npm run sanity:seed              → hanya membuat dokumen yang belum ada (aman diulang)
 *   npm run sanity:seed -- --replace → menimpa dokumen dengan konten bawaan
 *
 * Butuh di .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient, type SanityDocumentStub } from "@sanity/client";
import { processSteps, techCategories, values } from "../src/data/company";
import { projects } from "../src/data/projects";
import { services } from "../src/data/services";
import { fallbackSettings } from "../src/data/site";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const replace = process.argv.includes("--replace");

if (!projectId || !token) {
  console.error("✗ Isi NEXT_PUBLIC_SANITY_PROJECT_ID dan SANITY_API_WRITE_TOKEN di .env.local terlebih dahulu.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2025-10-01", useCdn: false });

const uploaded = new Map<string, string>();
async function image(url: string, name: string) {
  if (!uploaded.has(url)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Gagal mengunduh ${url}: ${res.status}`);
    const asset = await client.assets.upload("image", Buffer.from(await res.arrayBuffer()), { filename: `${name}.jpg` });
    uploaded.set(url, asset._id);
    console.log(`  ↑ gambar ${name}`);
  }
  return { _type: "image", asset: { _type: "reference", _ref: uploaded.get(url)! } };
}

const key = (i: number) => `k${i}`;
const slug = (current: string) => ({ _type: "slug", current });

async function main() {
  console.log(`→ Seeding ke ${projectId}/${dataset}${replace ? " (replace)" : ""}`);
  const existing = new Set<string>(await client.fetch(`*[!(_id in path("drafts.**"))]._id`));
  const docs: SanityDocumentStub[] = [];

  const { contact, socials, stats, ...general } = fallbackSettings;
  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    ...general,
    contact: { email: contact.email, phone: contact.phone, whatsapp: contact.whatsapp, address: contact.address, hours: contact.hours },
    socials: socials.map((s, i) => ({ _key: key(i), _type: "social", ...s })),
    stats: stats.map((s, i) => ({ _key: key(i), _type: "stat", ...s })),
  });

  for (const s of services) {
    const id = `service-${s.slug}`;
    if (existing.has(id) && !replace) continue;
    const { image: img, slug: sl, ...rest } = s;
    docs.push({ _id: id, _type: "service", ...rest, slug: slug(sl), image: await image(img, id) });
  }

  for (const p of projects) {
    const id = `project-${p.slug}`;
    if (existing.has(id) && !replace) continue;
    const { cover, gallery, slug: sl, results, ...rest } = p;
    docs.push({
      _id: id,
      _type: "project",
      ...rest,
      slug: slug(sl),
      results: results.map((r, i) => ({ _key: key(i), _type: "result", ...r })),
      cover: await image(cover, `${id}-cover`),
      gallery: await Promise.all(gallery.map(async (g, i) => ({ _key: key(i), ...(await image(g, `${id}-${i + 1}`)) }))),
    });
  }

  techCategories.forEach((c) => docs.push({ _id: `techCategory-${c.number}`, _type: "techCategory", ...c }));
  values.forEach((v) => docs.push({ _id: `companyValue-${v.number}`, _type: "companyValue", ...v }));
  processSteps.forEach((s) => docs.push({ _id: `processStep-${s.number}`, _type: "processStep", ...s }));

  const tx = client.transaction();
  for (const doc of docs) {
    if (replace) tx.createOrReplace(doc as SanityDocumentStub & { _id: string });
    else tx.createIfNotExists(doc as SanityDocumentStub & { _id: string });
  }
  await tx.commit();
  console.log(`✓ Selesai: ${docs.length} dokumen diproses, ${uploaded.size} gambar diunggah.`);
}

main().catch((err) => {
  console.error("✗ Seed gagal:", err.message ?? err);
  process.exit(1);
});
