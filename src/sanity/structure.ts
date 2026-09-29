import type { StructureResolver } from "sanity/structure";

const orderedList = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.documentTypeListItem(type)
    .title(title)
    .child(S.documentTypeList(type).title(title).defaultOrdering([{ field: "number", direction: "asc" }]));

/** Menu Studio: pengaturan (singleton) di atas, lalu koleksi konten. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("HEIMA.CREATIVE")
    .items([
      S.listItem()
        .title("Pengaturan Website")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Pengaturan Website")),
      S.divider(),
      orderedList(S, "project", "Projects"),
      orderedList(S, "service", "Layanan"),
      S.divider(),
      orderedList(S, "techCategory", "Teknologi"),
      orderedList(S, "companyValue", "Why HEIMA"),
      orderedList(S, "processStep", "Proses Kerja"),
    ]);
