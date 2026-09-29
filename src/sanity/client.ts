import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

export const client = createClient({
  projectId: isSanityConfigured ? projectId : "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/** Tag cache untuk revalidasi on-demand via webhook (/api/revalidate). */
export const SANITY_TAG = "sanity";

export function sanityFetch<T>(query: string, params: Record<string, unknown> = {}) {
  return client.fetch<T>(query, params, { next: { revalidate: 60, tags: [SANITY_TAG] } });
}

const builder = createImageUrlBuilder({ projectId: projectId || "placeholder", dataset });

/** URL gambar Sanity (CDN) — ukuran akhir tetap dioptimasi next/image. */
export function imageUrl(source: SanityImageSource | null | undefined, width = 2000) {
  if (!source) return "";
  return builder.image(source).width(width).auto("format").quality(80).url();
}
