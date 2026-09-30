import { defineArrayMember, defineField, defineType } from "sanity";

/** Nomor urut 2 digit ("01", "02", …) — menentukan urutan tampil di website. */
const numberField = defineField({
  name: "number",
  title: "Nomor urut",
  type: "string",
  description: 'Dua digit, mis. "01". Menentukan urutan tampil.',
  validation: (r) => r.required().regex(/^\d{2}$/, { name: "dua digit" }),
});

const stringList = (name: string, title: string, description?: string) =>
  defineField({ name, title, description, type: "array", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Pengaturan Website",
  type: "document",
  groups: [
    { name: "general", title: "Umum", default: true },
    { name: "contact", title: "Kontak" },
    { name: "stats", title: "Statistik" },
  ],
  fields: [
    defineField({ name: "tagline", title: "Tagline", type: "string", group: "general", initialValue: "IT & Digital Solutions" }),
    defineField({
      name: "description",
      title: "Deskripsi perusahaan (SEO)",
      type: "text",
      rows: 3,
      group: "general",
      validation: (r) => r.max(200).warning("Idealnya ≤ 160 karakter untuk mesin pencari."),
    }),
    defineField({ name: "location", title: "Lokasi", type: "string", group: "general", initialValue: "Magelang — Indonesia" }),
    defineField({
      name: "contact",
      title: "Kontak",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "email", title: "Email", type: "string", validation: (r) => r.required().email() }),
        defineField({ name: "phone", title: "Telepon", type: "string", description: "Format bebas, mis. +62 812 3456 7890" }),
        defineField({ name: "whatsapp", title: "WhatsApp", type: "string", description: "Nomor dengan kode negara, mis. +62 812 3456 7890" }),
        defineField({ name: "address", title: "Alamat", type: "text", rows: 2 }),
        defineField({ name: "hours", title: "Jam operasional", type: "string" }),
      ],
    }),
    defineField({
      name: "socials",
      title: "Sosial media",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({ name: "label", title: "Nama", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "URL", type: "url", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Statistik perusahaan",
      description: "Angka dengan animasi count-up di homepage.",
      type: "array",
      group: "stats",
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", title: "Angka", type: "number", validation: (r) => r.required().min(0) }),
            defineField({ name: "prefix", title: "Prefix", type: "string" }),
            defineField({ name: "suffix", title: "Suffix", type: "string", description: 'mis. "+" atau "/7"' }),
            defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
          ],
          preview: {
            select: { value: "value", suffix: "suffix", label: "label" },
            prepare: ({ value, suffix, label }) => ({ title: `${value ?? ""}${suffix ?? ""}`, subtitle: label }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Pengaturan Website" }) },
});

export const service = defineType({
  name: "service",
  title: "Layanan",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Nama layanan", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    numberField,
    defineField({ name: "category", title: "Kategori singkat", type: "string", description: 'Satu kata, mis. "Web"', validation: (r) => r.required() }),
    defineField({ name: "summary", title: "Ringkasan", type: "text", rows: 3, validation: (r) => r.required() }),
    stringList("capabilities", "Kapabilitas"),
    defineField({ name: "image", title: "Gambar", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
  ],
  orderings: [{ title: "Nomor urut", name: "numberAsc", by: [{ field: "number", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "number", media: "image" } },
});

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "info", title: "Info", default: true },
    { name: "story", title: "Studi kasus" },
    { name: "media", title: "Gambar" },
  ],
  fields: [
    defineField({ name: "title", title: "Nama project", type: "string", group: "info", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug (URL)", type: "slug", group: "info", options: { source: "title" }, validation: (r) => r.required() }),
    { ...numberField, group: "info" },
    defineField({ name: "category", title: "Kategori", type: "string", group: "info", validation: (r) => r.required() }),
    defineField({ name: "year", title: "Tahun", type: "number", group: "info", validation: (r) => r.integer().min(2000).max(2100) }),
    defineField({ name: "client", title: "Klien", type: "string", group: "info" }),
    defineField({ name: "industry", title: "Industri", type: "string", group: "info" }),
    { ...stringList("services", "Layanan yang dikerjakan"), group: "info" },
    { ...stringList("technology", "Teknologi"), group: "info" },
    defineField({
      name: "size",
      title: "Ukuran tampilan",
      type: "string",
      group: "info",
      options: { list: [{ title: "Besar", value: "large" }, { title: "Sedang", value: "medium" }], layout: "radio" },
      initialValue: "large",
    }),
    defineField({ name: "excerpt", title: "Ringkasan (SEO)", type: "text", rows: 2, group: "story", validation: (r) => r.required() }),
    defineField({ name: "overview", title: "Project overview", type: "text", rows: 4, group: "story" }),
    defineField({ name: "problem", title: "Problem", type: "text", rows: 4, group: "story" }),
    defineField({ name: "solution", title: "Solution", type: "text", rows: 4, group: "story" }),
    { ...stringList("implementation", "Tahapan implementasi"), group: "story", options: {} },
    defineField({
      name: "results",
      title: "Hasil",
      type: "array",
      group: "story",
      validation: (r) => r.max(3),
      of: [
        defineArrayMember({
          type: "object",
          name: "result",
          fields: [
            defineField({ name: "value", title: "Nilai", type: "string", description: 'mis. "-92%"', validation: (r) => r.required() }),
            defineField({ name: "label", title: "Keterangan", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
    defineField({ name: "cover", title: "Gambar utama", type: "image", group: "media", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({
      name: "gallery",
      title: "Galeri (3 gambar)",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      validation: (r) => r.max(3),
    }),
  ],
  orderings: [{ title: "Nomor urut", name: "numberAsc", by: [{ field: "number", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "category", media: "cover" } },
});

export const techCategory = defineType({
  name: "techCategory",
  title: "Kategori Teknologi",
  type: "document",
  fields: [
    numberField,
    defineField({ name: "title", title: "Nama kategori", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Deskripsi", type: "text", rows: 2 }),
    stringList("items", "Teknologi", "Tampil juga di marquee teknologi homepage."),
  ],
  orderings: [{ title: "Nomor urut", name: "numberAsc", by: [{ field: "number", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "number" } },
});

export const companyValue = defineType({
  name: "companyValue",
  title: "Why HEIMA (Value)",
  type: "document",
  fields: [
    numberField,
    defineField({ name: "title", title: "Judul", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Deskripsi", type: "text", rows: 2 }),
  ],
  orderings: [{ title: "Nomor urut", name: "numberAsc", by: [{ field: "number", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "number" } },
});

export const processStep = defineType({
  name: "processStep",
  title: "Tahap Proses",
  type: "document",
  fields: [
    numberField,
    defineField({ name: "title", title: "Judul", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Deskripsi singkat", type: "string" }),
    defineField({ name: "detail", title: "Detail", type: "text", rows: 2 }),
  ],
  orderings: [{ title: "Nomor urut", name: "numberAsc", by: [{ field: "number", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "number" } },
});

export const schemaTypes = [siteSettings, service, project, techCategory, companyValue, processStep];
