# HEIMA.CREATIVE — Website Resmi

Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP ScrollTrigger · Lenis · Sanity CMS

## Menjalankan lokal

```bash
npm install
npm run dev        # http://localhost:3000
```

Salin `.env.example` → `.env.local` dan isi sesuai kebutuhan (lihat di bawah).

## Konten & CMS

Semua halaman mengambil data lewat `src/content` (content layer):

- **Sanity belum dihubungkan** → website memakai konten bawaan di `src/data/*` (tetap berfungsi penuh).
- **Sanity terhubung** → konten diambil dari CMS; panel admin ada di **`/studio`**.

Yang bisa diedit di CMS: pengaturan website (tagline, deskripsi SEO, kontak, sosial media, statistik),
layanan, project (halaman detail + sitemap otomatis), kategori teknologi, value "Why HEIMA", dan tahap proses.
Tampilan/animasi tidak berubah — CMS hanya mengganti sumber data.

### Setup Sanity (sekali saja)

1. Buat project gratis di <https://www.sanity.io/manage> (dataset: `production`).
2. Salin **Project ID** → `NEXT_PUBLIC_SANITY_PROJECT_ID` di `.env.local`.
3. **API → CORS origins**: tambahkan `http://localhost:3000` dan domain Vercel Anda
   (mis. `https://heima-creative.vercel.app`) dengan opsi **Allow credentials** dicentang.
4. **API → Tokens**: buat token dengan izin **Editor** → `SANITY_API_WRITE_TOKEN` di `.env.local`
   (hanya untuk lokal, jangan dimasukkan ke Vercel).
5. Pindahkan konten bawaan + foto ke Sanity:
   ```bash
   npm run sanity:seed
   ```
   (Aman diulang — dokumen yang sudah ada tidak ditimpa. Pakai `-- --replace` untuk menimpa.)
6. Buka `http://localhost:3000/studio`, login, dan mulai edit.
7. Undang tim lewat **Members** di sanity.io/manage.

### Update instan setelah publish (webhook)

Tanpa webhook, perubahan tampil dalam ±60 detik. Agar instan:

- Isi `SANITY_REVALIDATE_SECRET` (string acak panjang) di Vercel.
- sanity.io/manage → **API → Webhooks → Create**:
  URL `https://<domain-anda>/api/revalidate`, dataset `production`,
  trigger *Create/Update/Delete*, HTTP method `POST`, **Secret** = nilai yang sama.

## Deploy ke Vercel

1. Push repo ini ke GitHub (atau GitLab/Bitbucket).
2. Di <https://vercel.com/new> → **Import** repo → framework otomatis terdeteksi (Next.js).
3. **Environment Variables**:

   | Nama | Nilai |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://<domain-anda>` |
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Project ID Sanity (kosongkan bila belum pakai CMS) |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` |
   | `SANITY_REVALIDATE_SECRET` | string acak (untuk webhook) |
   | `CONTACT_WEBHOOK_URL` | opsional — tujuan submit form kontak |

4. **Deploy**. Setiap `git push` ke branch utama akan otomatis ter-deploy.
5. Setelah domain final diketahui, perbarui `NEXT_PUBLIC_SITE_URL` + CORS origin Sanity, lalu redeploy.

> Mengubah environment variable di Vercel butuh **redeploy** agar berlaku.
> Paket **Hobby** Vercel hanya untuk penggunaan non-komersial; website perusahaan sebaiknya memakai paket **Pro**.

## Struktur

```
sanity.config.ts       konfigurasi Sanity Studio
scripts/seed-sanity.ts migrasi konten bawaan → Sanity
src/
  app/
    (site)/            halaman website (home, services, projects, projects/[slug], about, technology, contact)
    studio/            Sanity Studio (/studio)
    api/contact        endpoint form kontak
    api/revalidate     webhook Sanity → refresh cache
    sitemap.ts, robots.ts, opengraph-image.tsx
  content/             content layer (Sanity ⇄ fallback lokal) + tipe data
  data/                konten bawaan / fallback
  sanity/              client, query GROQ, skema, struktur menu Studio
  components/          layout, motion, ui, visuals, sections
```

Identitas visual & token desain: lihat [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).
