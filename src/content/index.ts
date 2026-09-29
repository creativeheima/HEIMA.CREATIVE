import { cache } from "react";
import { processSteps as fbProcess, techCategories as fbTech, values as fbValues } from "@/data/company";
import { projects as fbProjects } from "@/data/projects";
import { services as fbServices } from "@/data/services";
import { fallbackSettings } from "@/data/site";
import { imageUrl, sanityFetch } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { processQuery, projectsQuery, servicesQuery, settingsQuery, techCategoriesQuery, valuesQuery } from "@/sanity/queries";
import type { SanityImageSource } from "@sanity/image-url";
import type { ProcessStep, Project, Service, SiteSettings, TechCategory, Value } from "./types";

export type * from "./types";

/**
 * Content layer — satu-satunya pintu data untuk halaman.
 * Sanity terhubung → ambil dari CMS. Belum terhubung / gagal / koleksi kosong → konten lokal `src/data`.
 */
async function load<Raw, T>(query: string, map: (raw: Raw) => T, fallback: T, isEmpty: (v: T) => boolean): Promise<T> {
  if (!isSanityConfigured) return fallback;
  try {
    const raw = await sanityFetch<Raw>(query);
    if (raw == null) return fallback;
    const value = map(raw);
    return isEmpty(value) ? fallback : value;
  } catch (err) {
    console.error("[content] Gagal mengambil data Sanity, memakai fallback:", err);
    return fallback;
  }
}

const emptyList = (v: unknown[]) => v.length === 0;
const digits = (v: string) => v.replace(/\D/g, "");
const text = (v: unknown, fb = "") => (typeof v === "string" && v.trim() ? v : fb);
const list = <T>(v: T[] | null | undefined) => (Array.isArray(v) ? v.filter(Boolean) : []);

type RawSettings = Partial<Omit<SiteSettings, "contact">> & {
  contact?: Partial<Record<"email" | "phone" | "whatsapp" | "address" | "hours", string>>;
};

export const getSettings = cache(() =>
  load<RawSettings, SiteSettings>(
    settingsQuery,
    (raw) => {
      const fb = fallbackSettings;
      const phone = text(raw.contact?.phone, fb.contact.phone);
      const whatsapp = text(raw.contact?.whatsapp, fb.contact.whatsapp);
      return {
        tagline: text(raw.tagline, fb.tagline),
        description: text(raw.description, fb.description),
        location: text(raw.location, fb.location),
        contact: {
          email: text(raw.contact?.email, fb.contact.email),
          phone,
          phoneHref: `tel:+${digits(phone)}`,
          whatsapp,
          whatsappHref: `https://wa.me/${digits(whatsapp)}`,
          address: text(raw.contact?.address, fb.contact.address),
          hours: text(raw.contact?.hours, fb.contact.hours),
        },
        socials: list(raw.socials).length ? list(raw.socials) : fb.socials,
        stats: list(raw.stats).length ? list(raw.stats).map((s) => ({ ...s, prefix: s.prefix ?? undefined, suffix: s.suffix ?? undefined })) : fb.stats,
      };
    },
    fallbackSettings,
    () => false,
  ),
);

type RawService = Omit<Service, "image" | "capabilities"> & { image?: SanityImageSource; capabilities?: string[] };

export const getServices = cache(() =>
  load<RawService[], Service[]>(
    servicesQuery,
    (raw) => raw.map((s) => ({ ...s, capabilities: list(s.capabilities), image: imageUrl(s.image) })),
    fbServices,
    emptyList,
  ),
);

type RawProject = Omit<Project, "cover" | "gallery"> & { cover?: SanityImageSource; gallery?: SanityImageSource[] };

export const getProjects = cache(() =>
  load<RawProject[], Project[]>(
    projectsQuery,
    (raw) =>
      raw.map((p) => ({
        ...p,
        year: typeof p.year === "number" ? p.year : undefined,
        client: text(p.client),
        industry: text(p.industry, p.category),
        services: list(p.services),
        technology: list(p.technology),
        overview: text(p.overview),
        problem: text(p.problem),
        solution: text(p.solution),
        implementation: list(p.implementation),
        results: list(p.results),
        size: p.size === "medium" ? "medium" : "large",
        cover: imageUrl(p.cover),
        gallery: list(p.gallery).map((g) => imageUrl(g)),
      })),
    fbProjects,
    emptyList,
  ),
);

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug);
}

export async function getRelatedProjects(slug: string, count = 2) {
  const all = await getProjects();
  const index = all.findIndex((p) => p.slug === slug);
  return Array.from({ length: Math.min(count, all.length - 1) }, (_, i) => all[(index + i + 1) % all.length]);
}

export const getTechCategories = cache(() =>
  load<TechCategory[], TechCategory[]>(techCategoriesQuery, (raw) => raw.map((c) => ({ ...c, description: text(c.description), items: list(c.items) })), fbTech, emptyList),
);

export async function getTechnologies() {
  return (await getTechCategories()).flatMap((c) => c.items);
}

export const getValues = cache(() =>
  load<Value[], Value[]>(valuesQuery, (raw) => raw.map((v) => ({ ...v, description: text(v.description) })), fbValues, emptyList),
);

export const getProcessSteps = cache(() =>
  load<ProcessStep[], ProcessStep[]>(
    processQuery,
    (raw) => raw.map((s) => ({ ...s, description: text(s.description), detail: text(s.detail) })),
    fbProcess,
    emptyList,
  ),
);

/** Pilihan "Project type" di form kontak = nama layanan + "Lainnya". */
export async function getProjectTypes() {
  return [...(await getServices()).map((s) => s.title), "Lainnya"];
}
